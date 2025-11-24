<script setup>
import MyInfoCard from "~/components/cards/MyInfoCard.vue";
import PageBanner from "@/components/PageBanner.vue";

const sessions = [];
const monitoring = [];
</script>

<template>
  <div class="index">
    <PageBanner
      titleProps="Dashboard"
      backgroundProps="#0092B8"
      iconProps="/page-icons/academics.png"
    />
    <div class="grid">
      <div class="left">
        <div class="sessions">
          <div class="sessions__head">
            <p class="sessions__title">Upcoming sessions</p>
            <NuxtLink to="/booking">View</NuxtLink>
          </div>
          <div class="sessions__items">
            <div class="empty" v-if="sessions.length === 0">
              <Icon name="lucide:file-text" class="empty-icon" />
              <p>No upcoming sessions.</p>
            </div>
            <div
              v-else
              class="sessions__by-date"
              v-for="(session, index) in sessions"
              :key="index"
            >
              <p class="sessions__date-date">{{ session.date }}</p>
              <div
                class="sessions__item"
                v-for="(item, itemIndex) in session.items"
                :key="itemIndex"
              >
                <NuxtLink to="/">
                  <div class="sessions__item-top">
                    <div class="sessions__item-person">
                      <img :src="item.img" alt="" class="sessions__item-pic" />
                      <p class="sessions__item-name">{{ item.name }}</p>
                    </div>
                    <p class="sessions__item-time">{{ item.time }}</p>
                  </div>
                  <h4 class="sessions__item-title">
                    {{ item.title }}
                  </h4>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
        <div class="monitoring">
          <div class="monitoring__head">
            <p class="monitoring__title">Monitoring</p>
          </div>
          <div class="monitoring__body">
            <div class="empty" v-if="monitoring.length === 0">
              <Icon name="lucide:file-text" class="empty-icon" />
              <p>No monitoring data available.</p>
            </div>
            <div v-else class="monitoring__item">
              <div class="monitoring__left">
                <div class="monitoring__icon">
                  <Icon name="lucide:arrow-left-right" />
                </div>
                <div>
                  <p class="monitoring__name">Azizbek Tursunov</p>
                  <p class="monitoring__number">**** 8430</p>
                </div>
              </div>
              <div class="monitoring__right">
                <p class="monitoring__price">+ 451 000 UZS</p>
                <p class="monitoring__date">Aug 15 2025, 16:02</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="right">
        <MyInfoCard />
      </div>
    </div>
  </div>
</template>

<style scoped>
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 40px 0;
  color: var(--light-grey);
}
.empty-icon {
  font-size: 36px;
}
.index {
  padding: 24px;
  background: var(--border);
  height: 100vh;
  overflow: auto;
}
.grid {
  display: grid;
  grid-template-columns: 1fr 384px;
  gap: 24px;
  margin-top: 24px;
}
.left {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}
.sections {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-top: 24px;
}
.sessions,
.monitoring {
  background: white;
  border-radius: 16px;
  padding: 24px;
  height: fit-content;
}
.sessions__head,
.monitoring__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}
.sessions__title,
.monitoring__title {
  font-weight: 500;
  font-size: 20px;
  line-height: 28px;
}
.sessions__head a,
.monitoring__head a {
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  color: var(--light-grey);
}
.sessions__by-date {
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.sessions__by-date:last-child {
  margin-bottom: 0;
}
.sessions__date-date {
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  position: relative;
}
.sessions__date-date::after {
  content: "";
  position: absolute;
  width: 90%;
  height: 1px;
  background: var(--border);
  top: 50%;
  right: 0;
  transform: translateY(-50%);
}
.sessions__item {
  border-radius: 12px;
  padding: 16px;
  transition: all 0.2s;
}
.sessions__item:hover {
  background: var(--border);
}
.sessions__item:hover .sessions__item-time {
  background: white;
}
.sessions__item-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.sessions__item-person {
  display: flex;
  align-items: center;
  gap: 8px;
}
.sessions__item-pic {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
}
.sessions__item-name {
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
}
.sessions__item-time {
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  background: var(--border);
  padding: 2px 4px;
  border-radius: 4px;
  transition: all 0.2s;
}
.sessions__item-title {
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  margin-top: 12px;
}
.monitoring__body {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.monitoring__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.monitoring__left {
  display: flex;
  align-items: center;
  gap: 12px;
}
.monitoring__right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.monitoring__icon {
  width: 48px;
  height: 48px;
  background: var(--light-blue);
  border: 1px solid #dbeafe;
  color: var(--blue);
  font-size: 20px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.monitoring__name {
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  margin-bottom: 6px;
}
.monitoring__number {
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: var(--light-grey);
}
.monitoring__price {
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  margin-bottom: 6px;
  color: var(--green);
}
.monitoring__date {
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: var(--light-grey);
  text-align: right;
}
</style>
