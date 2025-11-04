<script setup>
import { message } from "ant-design-vue";
import PageBanner from "@/components/PageBanner.vue";

definePageMeta({
  layoutTitle: "Essay Lab",
});

const { fetchEssays } = useEssay();

const loading = ref(false);
const essays = ref([]);
const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
});

onMounted(async () => {
  await loadEssays();
});

const loadEssays = async (page = 0) => {
  loading.value = true;

  const result = await fetchEssays(page, pagination.value.pageSize);

  loading.value = false;

  if (result.success) {
    essays.value = result.data.content;
    pagination.value = {
      current: result.data.number + 1,
      pageSize: result.data.size,
      total: result.data.totalElements,
    };
  } else {
    message.error(result.error || "Не удалось загрузить эссе");
  }
};

const handlePageChange = (page) => {
  loadEssays(page - 1);
};

const formatDate = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getStatusLabel = (status) => {
  const statuses = {
    UNPAID: "Не оплачено",
    PENDING: "В ожидании",
    IN_PROGRESS: "В процессе",
    PAID: "Оплачено",
    CANCELLED: "Отменено",
    COMPLETED: "Завершено",
  };
  return statuses[status] || status;
};

const truncateText = (text, maxLength = 60) => {
  if (!text) return "-";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

console.log(essays);
</script>

<template>
  <div class="essay-page">
    <PageBanner
      titleProps="Essays"
      backgroundProps="#0092B8"
      iconProps="/page-icons/booking.png"
    />
    <div class="essay__body">
      <div class="essay__head">
        <h4 class="essay__title">Essay overview</h4>
      </div>

      <div class="essay__content">
        <div v-if="loading" class="essay__loading">
          <a-spin size="large" />
        </div>

        <div v-else-if="!essays.length" class="essay__empty">
          <Icon name="lucide:file-text" class="empty-icon" />
          <p>Пока нет эссе</p>
        </div>

        <div v-else>
          <table>
            <thead>
              <tr>
                <th>Студент</th>
                <th>Название</th>
                <th>Тип</th>
                <th>Статус</th>
                <th>Создано</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="essay in essays" :key="essay.id">
                <td>{{ essay.student?.fullName || "-" }}</td>
                <td>{{ truncateText(essay.title, 50) }}</td>
                <td>
                  <span class="essay-type">
                    {{
                      essay.essayType === "PERSONAL"
                        ? "Personal"
                        : "Supplemental"
                    }}
                  </span>
                </td>
                <td>
                  <span
                    class="status"
                    :class="`status--${essay.status?.toLowerCase()}`"
                  >
                    {{ getStatusLabel(essay.status) }}
                  </span>
                </td>
                <td>{{ formatDate(essay.createdAt) }}</td>
                <td>
                  <NuxtLink
                    :to="`/essay-lab/${essay.id}`"
                    class="btn btn--secondary"
                    title="Просмотр"
                  >
                    <Icon name="lucide:eye" class="icon" />
                  </NuxtLink>
                </td>
              </tr>
            </tbody>
          </table>

          <div class="essay__pagination">
            <a-pagination
              v-if="pagination.total > pagination.pageSize"
              v-model:current="pagination.current"
              :total="pagination.total"
              :page-size="pagination.pageSize"
              :show-size-changer="false"
              @change="handlePageChange"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.essay-page {
  padding: 24px 24px 120px 24px;
  background: var(--border);
  min-height: 100vh;
  overflow: auto;
}
.essay__body {
  margin-top: 24px;
  padding: 24px;
  background: white;
  border-radius: 16px;
}
.essay__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.essay__title {
  font-size: 20px;
  line-height: 28px;
  font-weight: 500;
}
.essay__loading {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px;
}
.essay__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px;
  gap: 16px;
}
.empty-icon {
  font-size: 48px;
  color: var(--light-grey);
}
.essay__empty p {
  font-size: 16px;
  color: var(--light-grey);
}
table {
  width: 100%;
  border-collapse: collapse;
}
thead {
  background: var(--border);
}
th {
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  font-size: 14px;
  color: var(--light-grey);
}
td {
  padding: 16px;
  border-bottom: 1px solid var(--border);
}
tbody tr:hover {
  background: var(--border);
}
.essay-type {
  font-size: 14px;
  color: var(--text-grey);
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
.essay__pagination {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}
</style>
