<script setup>
import PageBanner from "@/components/PageBanner.vue";

const { fetchStudents } = useStudents();

const loading = ref(false);
const searchQuery = ref("");
const students = ref([]);

onMounted(async () => {
  students.value = await fetchStudents();
});

const debouncedSearch = ref(searchQuery.value);
let searchTimeout;

watch(searchQuery, (newValue) => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    debouncedSearch.value = newValue;
  }, 500);
});

watch(debouncedSearch, async () => {
  students.value = await fetchStudents(debouncedSearch.value);
});
</script>

<template>
  <div class="booking-page">
    <PageBanner
      titleProps="Students"
      backgroundProps="#0092B8"
      iconProps="/page-icons/academics.png"
    />
    <div class="teachers__body">
      <div class="teachers__top">
        <!-- <div class="teachers__top-left light__borders">
          <a-select
            v-model:value="selectedUniversity"
            placeholder="Choose university"
          >
            <a-select-option :value="null">All Universities</a-select-option>
            <a-select-option
              v-for="university in universities"
              :key="university.id"
              :value="university.id"
            >
              {{ university.name }}
            </a-select-option>
          </a-select>
          <a-select
            v-model:value="selectedFaculty"
            placeholder="Choose faculty"
          >
            <a-select-option :value="null">All Faculties</a-select-option>
            <a-select-option
              v-for="faculty in faculties"
              :key="faculty.id"
              :value="faculty.id"
            >
              {{ faculty.name }}
            </a-select-option>
          </a-select>
        </div> -->
        <div class="teachers__top-right">
          <a-input
            v-model:value="searchQuery"
            placeholder="Search"
            class="search__input"
          />
          <Icon name="lucide:search" style="width: 16px; height: 16px" />
        </div>
      </div>
      <div v-if="loading" class="essay__loading">
        <a-spin size="large" />
      </div>

      <div v-else-if="!students.length" class="essay__empty">
        <Icon name="lucide:file-text" class="empty-icon" />
        <p>No students yet</p>
      </div>

      <div class="teachers__items" v-else>
        <div class="teachers__item" v-for="item in students" :key="item.id">
          <NuxtLink :to="`/students/${item.id}`">
            <div class="teachers__item-top">
              <div class="teachers__item-img">
                <img
                  :src="item.image || '/images/default-person.jpg'"
                  alt="Student"
                  width="56"
                  height="56"
                />
              </div>
              <div class="teachers__item-info">
                <h5 class="teachers__item-name">{{ item.fullName }}</h5>
                <span class="teachers__item-sub">
                  {{ item?.email || "Email not set" }}
                </span>
              </div>
            </div>
            <!-- <div class="teachers__item-bottom">
              <p class="teachers__item-status">
                {{ item.faculty?.name || "Faculty not set" }}
              </p>
            </div> -->
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.booking-page {
  padding: 24px 24px 120px 24px;
  background: var(--border);
  height: 100vh;
  overflow: auto;
}
.teachers__body {
  padding: 24px;
  background: #ffffff;
  border-radius: 16px;
  margin-top: 24px;
}
.teachers__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}
.teachers__top-left {
  display: flex;
  align-items: center;
  gap: 16px;
}
.teachers__top-right {
  position: relative;
  border: 1px solid var(--border-darker);
  border-radius: 8px;
  padding: 0;
}
.teachers__top-left :deep(.ant-select) {
  width: 420px;
}
.search__input {
  width: 420px;
  border: 0;
  padding: 10px 12px;
}
@media (max-width: 1660px) {
  .teachers__top-left :deep(.ant-select) {
    width: 280px;
  }
  .search__input {
    width: 280px;
  }
}
.teachers__top-right span {
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  color: var(--light-grey);
}
.teachers__items {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
.teachers__item {
  border: 1px solid var(--border-darker);
  border-radius: 16px;
  padding: 24px;
}
.teachers__item-top {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}
.teachers__item-img {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}
.teachers__item-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.teachers__item-info {
  flex-grow: 1;
}
.teachers__item-name {
  font-weight: 600;
  font-size: 20px;
  line-height: 28px;
  margin-bottom: 4px;
}
.teachers__item-sub {
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  color: var(--light-grey);
}
.teachers__item-status {
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  background: var(--light-green);
  display: inline-flex;
  color: var(--green);
  padding: 4px 8px;
  border-radius: 8px;
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
</style>
