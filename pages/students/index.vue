<script setup>
import PageBanner from "@/components/PageBanner.vue";
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
        <div class="teachers__top-left">
          <a-select placeholder="Choose university">
            <a-select-option value="1">All Teachers</a-select-option>
            <a-select-option value="2">My Teachers</a-select-option>
          </a-select>
          <a-select placeholder="Choose faculty">
            <a-select-option value="1">All Subjects</a-select-option>
            <a-select-option value="2">My Subjects</a-select-option>
          </a-select>
        </div>
        <div class="teachers__top-right">
          <a-input placeholder="Search" class="search__input" />
          <Icon name="lucide:search" style="width: 16px; height: 16px" />
        </div>
      </div>
      <div class="teachers__items">
        <div class="teachers__item">
          <NuxtLink to="/students/id">
            <div class="teachers__item-top">
              <div class="teachers__item-img">
                <img
                  src="/images/person.jpg"
                  alt="Teacher"
                  width="56"
                  height="56"
                />
              </div>
              <div class="teachers__item-info">
                <h5 class="teachers__item-name">Yu Jimin</h5>
                <span class="teachers__item-sub"> Computer Science </span>
              </div>
            </div>
            <div class="teachers__item-bottom">
              <p class="teachers__item-status">
                Software Engineering Specialist
              </p>
            </div>
          </NuxtLink>
        </div>
        <div class="teachers__item">
          <NuxtLink to="/students/id">
            <div class="teachers__item-top">
              <div class="teachers__item-img">
                <img
                  src="/images/person.jpg"
                  alt="Teacher"
                  width="56"
                  height="56"
                />
              </div>
              <div class="teachers__item-info">
                <h5 class="teachers__item-name">Yu Jimin</h5>
                <span class="teachers__item-sub"> Computer Science </span>
              </div>
            </div>
            <div class="teachers__item-bottom">
              <p class="teachers__item-status">
                Software Engineering Specialist
              </p>
            </div>
          </NuxtLink>
        </div>
        <div class="teachers__item">
          <NuxtLink to="/students/id">
            <div class="teachers__item-top">
              <div class="teachers__item-img">
                <img
                  src="/images/person.jpg"
                  alt="Teacher"
                  width="56"
                  height="56"
                />
              </div>
              <div class="teachers__item-info">
                <h5 class="teachers__item-name">Yu Jimin</h5>
                <span class="teachers__item-sub"> Computer Science </span>
              </div>
            </div>
            <div class="teachers__item-bottom">
              <p class="teachers__item-status">
                Software Engineering Specialist
              </p>
            </div>
          </NuxtLink>
        </div>
        <div class="teachers__item">
          <NuxtLink to="/students/id">
            <div class="teachers__item-top">
              <div class="teachers__item-img">
                <img
                  src="/images/person.jpg"
                  alt="Teacher"
                  width="56"
                  height="56"
                />
              </div>
              <div class="teachers__item-info">
                <h5 class="teachers__item-name">Yu Jimin</h5>
                <span class="teachers__item-sub"> Computer Science </span>
              </div>
            </div>
            <div class="teachers__item-bottom">
              <p class="teachers__item-status">
                Software Engineering Specialist
              </p>
            </div>
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
  border: 1px solid var(--border);
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
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 24px;
}
.teachers__item-top {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 16px;
}
.teachers__item-img {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
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
</style>
