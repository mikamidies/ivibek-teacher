<script setup>
import MyInfoCard from "@/components/cards/MyInfoCard.vue";
import MonthlyCalendar from "@/components/booking/MonthlyCalendar.vue";

const handleDayClick = (day) => {
  console.log("Выбран день:", day);
};

const { fetchUpcomingMeetings } = useMeetings();
const upcomingMeetings = ref([]);

const loadUpcomingMeetings = async () => {
  const data = await fetchUpcomingMeetings();
  if (data && data.meetings) {
    upcomingMeetings.value = data.meetings;
  }
};

onMounted(() => {
  loadUpcomingMeetings();
});
</script>

<template>
  <div class="booking-page">
    <PageBanner
      titleProps="Booking"
      backgroundProps="#0092B8"
      iconProps="/page-icons/booking.png"
    />
    <div class="booking__grid">
      <div class="booking-left">
        <div class="sessions">
          <div class="sessions__head">
            <p class="sessions__title">Upcoming sessions</p>
          </div>
          <div class="sessions__items">
            <div class="empty" v-if="upcomingMeetings.length === 0">
              <Icon name="lucide:file-text" class="empty-icon" />
              <p>No upcoming sessions.</p>
            </div>
            <div
              v-else
              class="sessions__by-date"
              v-for="(session, index) in upcomingMeetings"
              :key="index"
            >
              <p class="sessions__date-date">{{ session.date }}</p>
              <div
                class="sessions__item"
                v-for="meeting in session.meetings"
                :key="meeting.id"
              >
                <div class="sessions__item-top">
                  <div class="sessions__item-person">
                    <img
                      :src="meeting.meetingWith.image || '/images/person.jfif'"
                      alt=""
                      class="sessions__item-pic"
                    />
                    <p class="sessions__item-name">
                      {{ meeting.meetingWith.fullName }}
                    </p>
                  </div>
                  <p class="sessions__item-time">
                    {{ meeting.timeFrom.substring(0, 5) }} -
                    {{ meeting.timeTo.substring(0, 5) }}
                  </p>
                </div>
                <h4 class="sessions__item-title">
                  {{ meeting.description }}
                </h4>
              </div>
            </div>
          </div>
        </div>
        <div class="booking__calendar">
          <p class="sessions__title">Calendar</p>
          <MonthlyCalendar @day-click="handleDayClick" />
        </div>
      </div>
      <MyInfoCard />
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
.booking-page {
  padding: 24px 24px 120px 24px;
  background: var(--border);
  height: 100vh;
  overflow: auto;
}
.booking__grid {
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
.booking__calendar {
  background: white;
  border-radius: 16px;
  padding: 24px;
  height: fit-content;
}
.booking__calendar {
  margin-top: 24px;
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
</style>
