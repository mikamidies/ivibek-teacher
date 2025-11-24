<script setup>
const { user } = useAuth();
const { fetchSidebarData } = useSidebar();

const sidebarData = ref(null);
const loading = ref(true);

onMounted(async () => {
  loading.value = true;
  sidebarData.value = await fetchSidebarData();
  loading.value = false;
});

const displayInfo = computed(() => {
  if (sidebarData.value) {
    return sidebarData.value.info;
  }
  return user.value?.info || {};
});

const activeSessionsCount = computed(() => {
  return sidebarData.value?.activeSessionsCount || 0;
});

const sentEssaysCount = computed(() => {
  return sidebarData.value?.sentEssaysCount || 0;
});
</script>

<template>
  <div class="info__card">
    <div class="header">
      <h4 class="title">My profile</h4>
      <NuxtLink to="/profile" class="header__link">
        <Icon name="lucide:pencil" />
      </NuxtLink>
    </div>
    <div class="info" v-if="!loading">
      <div class="person">
        <img
          :src="user?.image || '/images/default-person.jpg'"
          alt="person"
          width="80"
          height="80"
          format="webp"
          class="person__img"
        />
        <div class="person__info">
          <h4 class="person__name">{{ displayInfo?.fullName || "N/A" }}</h4>
          <p class="person__role">{{ displayInfo?.email || "N/A" }}</p>
        </div>
      </div>
      <div class="items">
        <div class="item" v-if="user?.info?.country">
          <p class="answer">Country</p>
          <h4 class="value">{{ user?.info?.country?.name || "N/A" }}</h4>
        </div>
        <div class="item">
          <p class="answer">University</p>
          <h4 class="value">{{ displayInfo?.university?.name || "N/A" }}</h4>
        </div>
        <div class="item">
          <p class="answer">Faculty</p>
          <h4 class="value">{{ displayInfo?.faculty?.name || "N/A" }}</h4>
        </div>
      </div>
    </div>
    <div class="info" v-else>
      <a-spin />
    </div>

    <div class="cards" v-if="!loading">
      <div class="card">
        <p class="card__name">Sent Essays</p>
        <div class="card__flexer">
          <div class="card__icon">
            <Icon name="lucide:pen-tool" />
          </div>
          <p class="card__num">{{ sentEssaysCount }}</p>
        </div>
      </div>
      <div class="card">
        <p class="card__name">Active Sessions</p>
        <div class="card__flexer">
          <div class="card__icon">
            <Icon name="lucide:calendar-check" />
          </div>
          <p class="card__num">{{ activeSessionsCount }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.info__card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  height: max-content;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.title {
  font-weight: 500;
  font-size: 20px;
  line-height: 28px;
}
.person {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}
.person__img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}
.person__name {
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  margin-bottom: 4px;
}
.person__role {
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: var(--light-grey);
}
.items {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--border);
}
.answer {
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: var(--light-grey);
  margin-bottom: 4px;
}
.value {
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
}
.cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}
.card {
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.card__name {
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
}
.card__flexer {
  display: flex;
  align-items: center;
  gap: 12px;
}
.card__icon {
  width: 48px;
  height: 48px;
  font-size: 20px;
  background: var(--light-blue);
  color: var(--blue);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.card:last-child .card__icon {
  background: var(--light-green);
  color: var(--green);
}
.card__num {
  font-weight: 500;
  font-size: 20px;
  line-height: 28px;
}
.header__link span {
  width: 16px;
  height: 16px;
  color: var(--light-grey);
}
</style>
