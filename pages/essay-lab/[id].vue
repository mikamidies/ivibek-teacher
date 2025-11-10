<script setup>
import { message } from "ant-design-vue";
import PageBanner from "@/components/PageBanner.vue";

definePageMeta({
  layoutTitle: "Essay Details",
});

const route = useRoute();
const { fetchEssayById, sendFeedback } = useEssay();

const loading = ref(false);
const essay = ref(null);
const feedbackUrl = ref("");
const sendingFeedback = ref(false);
const copied = ref(false);

onMounted(async () => {
  await loadEssay();
});

const loadEssay = async () => {
  loading.value = true;
  const essayId = Number(route.params.id);

  const result = await fetchEssayById(essayId);

  loading.value = false;

  if (result.success) {
    essay.value = result.data;
  } else {
    message.error(result.error || "Unable to load essay");
  }
};

const handleSendFeedback = async () => {
  if (!feedbackUrl.value.trim()) {
    message.warning("Enter feedback text");
    return;
  }

  sendingFeedback.value = true;
  const essayId = Number(route.params.id);

  const result = await sendFeedback(essayId, {
    feedbackUrl: feedbackUrl.value,
  });

  sendingFeedback.value = false;

  if (result.success) {
    message.success("Feedback sent successfully");
    feedbackUrl.value = "";
    await loadEssay();
  } else {
    message.error(result.error || "Failed to send feedback");
  }
};

const formatDate = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const getStatusLabel = (status) => {
  const statuses = {
    UNPAID: "Not Paid",
    PAID: "Paid",
    PENDING: "Pending",
    IN_PROGRESS: "Processing",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
  };
  return statuses[status] || status;
};

const copyToClipboard = async () => {
  if (!essay.value?.content?.body) {
    message.warning("No text to copy");
    return;
  }

  try {
    await navigator.clipboard.writeText(essay.value.content.body);
    copied.value = true;
    message.success("Text copied to clipboard");

    setTimeout(() => {
      copied.value = false;
    }, 20000);
  } catch (error) {
    message.error("Failed to copy text");
    console.error("Copy failed:", error);
  }
};
</script>

<template>
  <div class="essay__edit-page">
    <PageBanner
      titleProps="Essays"
      backgroundProps="#0092B8"
      iconProps="/page-icons/booking.png"
    />

    <div v-if="loading" class="essay__loading">
      <a-spin size="large" />
    </div>

    <div v-else-if="!essay" class="essay__empty">
      <Icon name="lucide:file-x" class="empty-icon" />
      <p>Essay not found</p>
      <NuxtLink to="/essay-lab" class="btn btn--primary">
        Back to list
      </NuxtLink>
    </div>

    <div v-else class="essay__grid">
      <div class="essay__left">
        <div class="top__top">
          <NuxtLink to="/essay-lab" class="btn btn--secondary back__btn">
            <Icon name="lucide:arrow-left" class="icon" />
            Back
          </NuxtLink>
          <div
            class="copy__btn"
            @click="copyToClipboard"
            :class="{ copied: copied }"
          >
            <Icon
              :name="copied ? 'lucide:check' : 'lucide:copy'"
              class="link-icon"
            />
            <span>{{ copied ? "Copied" : "Copy text" }}</span>
          </div>
        </div>
        <h4 class="essay__title">
          {{ essay.content?.title || "Unnamed" }}
        </h4>
        <div class="essay__meta">
          <div class="meta__item">
            <Icon name="lucide:calendar" class="meta-icon" />
            <span>{{ formatDate(essay.createdAt) }}</span>
          </div>
          <div class="meta__item">
            <Icon name="lucide:clock" class="meta-icon" />
            <span>{{ essay.content?.deadline?.name || "-" }}</span>
          </div>
          <div class="meta__item">
            <Icon name="lucide:file-text" class="meta-icon" />
            <span>{{ essay.content?.wordLimit?.name || "-" }}</span>
          </div>
          <div class="meta__item">
            <span
              class="status"
              :class="`status--${essay.status?.toLowerCase()}`"
            >
              {{ getStatusLabel(essay.status) }}
            </span>
          </div>
        </div>
        <div class="essay__text">
          <p v-if="essay.content?.body">{{ essay.content.body }}</p>
          <p v-else class="no-content">Empty essay</p>
        </div>
      </div>
      <div class="essay__right">
        <div>
          <div class="right__head">
            <h4 class="section__title">Student</h4>
          </div>
          <div>
            <div class="essay__info">
              <div class="essay__img">
                <img src="/images/person.jfif" alt="Student" />
              </div>
              <div>
                <p class="essay__name">
                  {{ essay.student?.fullName || "Unknown" }}
                </p>
                <p class="essay__status">
                  {{ essay.student?.email || "-" }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div v-if="!essay.feedback">
          <div class="right__head">
            <h4 class="section__title">Feedback Link</h4>
          </div>
          <form @submit.prevent="handleSendFeedback">
            <a-input
              v-model:value="feedbackUrl"
              placeholder="Write your feedback..."
              :disabled="sendingFeedback"
            />
            <a-button
              type="primary"
              html-type="submit"
              :loading="sendingFeedback"
              block
            >
              Send
            </a-button>
          </form>
        </div>

        <div v-else>
          <div class="right__head">
            <h4 class="section__title">Feedback</h4>
          </div>
          <div class="feedback__completed">
            <Icon name="lucide:check-circle" class="completed-icon" />
            <p class="feedback__sent">Feedback sent</p>
            <div class="feedback__content">
              <p class="feedback__label">Your response:</p>
              <p class="feedback__text">{{ essay.feedback.feedbackUrl }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.top__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.copy__btn {
  margin-bottom: 16px;
  padding: 10px 12px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--border);
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;
}
.copy__btn:hover {
  background: #e5e7eb;
}
.copy__btn.copied {
  background: #e8f5e9;
  color: #388e3c;
}
.copy__btn.copied .link-icon {
  color: #388e3c;
}
.essay__edit-page {
  padding: 24px 24px 120px 24px;
  background: var(--border);
  min-height: 100vh;
  overflow: auto;
}
.essay__loading,
.essay__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px;
  gap: 16px;
  background: white;
  border-radius: 16px;
  margin-top: 24px;
}
.empty-icon {
  font-size: 48px;
  color: var(--light-grey);
}
.essay__empty p {
  font-size: 16px;
  color: var(--light-grey);
}
.essay__grid {
  display: grid;
  grid-template-columns: 1fr 384px;
  gap: 24px;
  margin-top: 24px;
}
.essay__left {
  background: white;
  padding: 24px;
  border-radius: 16px;
  height: fit-content;
}
.essay__title {
  font-size: 20px;
  line-height: 28px;
  font-weight: 500;
  margin: 8px 0 16px 0;
}
.essay__meta {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding: 16px;
  background: var(--border);
  border-radius: 8px;
}
.meta__item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: var(--text-grey);
}
.meta-icon {
  font-size: 16px;
  color: var(--light-grey);
}
.essay__text {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  color: var(--text-grey);
  line-height: 1.6;
  white-space: pre-wrap;
}
.no-content {
  text-align: center;
  color: var(--light-grey);
  font-style: italic;
}
.essay__right {
  display: flex;
  flex-direction: column;
  gap: 24px;
  background: white;
  padding: 24px;
  border-radius: 16px;
  height: fit-content;
}
.right__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.section__title {
  font-size: 16px;
  line-height: 24px;
  font-weight: 500;
}
.essay__info {
  display: flex;
  align-items: center;
  gap: 16px;
}
.essay__img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}
.essay__img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.essay__name {
  font-size: 16px;
  line-height: 24px;
  font-weight: 500;
}
.essay__status {
  font-size: 14px;
  line-height: 20px;
  color: var(--light-grey);
}
.back__btn {
  margin-bottom: 16px;
  padding: 10px 12px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--border);
}
.back__btn span {
  font-size: 18px;
}
form {
  display: grid;
  grid-template-columns: 1fr 100px;
  gap: 12px;
}
.status {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}
.status--unpaid {
  background: #ffebee;
  color: #d32f2f;
}
.status--paid {
  background: #e3f2fd;
  color: #1976d2;
}
.status--pending {
  background: #fff3e0;
  color: #f57c00;
}
.status--in_progress {
  background: #e3f2fd;
  color: #1976d2;
}
.status--completed {
  background: #e8f5e9;
  color: #388e3c;
}
.status--cancelled {
  background: #ffebee;
  color: #d32f2f;
}
.feedback__completed {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  gap: 12px;
  background: #e8f5e9;
  border-radius: 8px;
}
.completed-icon {
  font-size: 32px;
  color: #388e3c;
}
.feedback__sent {
  font-size: 14px;
  color: #388e3c;
  font-weight: 500;
}
.feedback__content {
  width: 100%;
  padding: 16px;
  background: white;
  border-radius: 8px;
  margin-top: 8px;
}
.feedback__label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-grey);
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.feedback__text {
  font-size: 14px;
  color: var(--black);
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
}
.link-icon {
  font-size: 16px;
}
</style>
