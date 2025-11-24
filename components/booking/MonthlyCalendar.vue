<script setup lang="ts">
import { ref, computed } from "vue";
import type { DayInfo } from "@/utils/calendar";
import {
  generateMonthDays,
  getPreviousMonth,
  getNextMonth,
  getToday,
  formatMonthYear,
  getDayName,
  isPastDay,
} from "@/utils/calendar";
import { message } from "ant-design-vue";

const emit = defineEmits<{
  (e: "dayClick", day: DayInfo): void;
}>();

const { assignTimeSlots, fetchTimeSlotsByDate } = useTimeSlots();
const { fetchMeetingsByDate, assignMeetingLink } = useMeetings();

const currentDate = ref<Date>(getToday());
const modalVisible = ref(false);
const selectedDay = ref<DayInfo | null>(null);
const selectedHours = ref<Set<number>>(new Set());
const loading = ref(false);
const assignedTimeSlots = ref<{ [date: string]: string[] }>({});
const meetings = ref<any[]>([]);
const meetingLinks = ref<{ [meetingId: number]: string }>({});
const sendingLinkId = ref<number | null>(null);

const availableHours = Array.from({ length: 13 }, (_, i) => i + 10);

const monthDays = computed(() => generateMonthDays(currentDate.value));
const monthYear = computed(() => formatMonthYear(currentDate.value));

const weekDays = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];

const goToPreviousMonth = () => {
  currentDate.value = getPreviousMonth(currentDate.value);
};

const goToNextMonth = () => {
  currentDate.value = getNextMonth(currentDate.value);
};

const goToToday = () => {
  currentDate.value = getToday();
};

const handleDayClick = async (day: DayInfo) => {
  if (isPastDay(day.dateString)) {
    return;
  }
  selectedDay.value = day;
  selectedHours.value.clear();
  modalVisible.value = true;

  const [slots, meetingsData] = await Promise.all([
    fetchTimeSlotsByDate(day.dateString),
    fetchMeetingsByDate(day.dateString),
  ]);

  assignedTimeSlots.value = slots;
  meetings.value = meetingsData?.meetings || [];

  emit("dayClick", day);
};

const closeModal = () => {
  modalVisible.value = false;
  selectedDay.value = null;
  selectedHours.value.clear();
  meetings.value = [];
  meetingLinks.value = {};
  sendingLinkId.value = null;
  loading.value = false;
};

const toggleHour = (hour: number) => {
  if (isHourDisabled(hour)) return;

  if (selectedHours.value.has(hour)) {
    selectedHours.value.delete(hour);
  } else {
    selectedHours.value.add(hour);
  }
};

const isHourSelected = (hour: number) => {
  return selectedHours.value.has(hour);
};

const isHourDisabled = (hour: number) => {
  if (!selectedDay.value) return false;
  const dateKey = selectedDay.value.dateString;
  const assignedHours = assignedTimeSlots.value[dateKey] || [];

  // Форматируем час с ведущим нулем если нужно (10 -> "10", 9 -> "09")
  const formattedHour = hour.toString().padStart(2, "0");

  // Check if hour is in assigned time slots
  const isAssigned = assignedHours.some((time: string) => {
    const timeHour = time.split(":")[0];
    return timeHour === formattedHour;
  });

  // Check if hour is within any meeting time range
  const isInMeeting = meetings.value.some((meeting: any) => {
    const fromHour = parseInt(meeting.timeFrom.split(":")[0]);
    const toHour = parseInt(meeting.timeTo.split(":")[0]);
    return hour >= fromHour && hour < toHour;
  });

  return isAssigned || isInMeeting;
};

const handleSubmit = async () => {
  if (selectedHours.value.size === 0) {
    message.warning("Please select at least one hour");
    return;
  }

  if (!selectedDay.value) return;

  loading.value = true;

  try {
    const hours = Array.from(selectedHours.value)
      .map((h) => Number(h))
      .sort((a, b) => a - b);
    await assignTimeSlots(selectedDay.value.dateString, hours);

    message.success(`Successfully assigned ${hours.length} time slots`);

    closeModal();
  } catch (error: any) {
    message.error(error.message || "Failed to save");
  } finally {
    loading.value = false;
  }
};

const handleSendMeetingLink = async (meetingId: number) => {
  const link = meetingLinks.value[meetingId];

  if (!link || !link.trim()) {
    message.warning("Please enter a meeting link");
    return;
  }

  sendingLinkId.value = meetingId;

  try {
    await assignMeetingLink(meetingId, link);
    message.success("Meeting link sent successfully");

    // Update the meeting in the list
    const meetingIndex = meetings.value.findIndex(
      (m: any) => m.id === meetingId
    );
    if (meetingIndex !== -1) {
      meetings.value[meetingIndex].meetingLink = link;
    }

    // Clear the input
    meetingLinks.value[meetingId] = "";
  } catch (error: any) {
    message.error(error.message || "Failed to send meeting link");
  } finally {
    sendingLinkId.value = null;
  }
};
</script>

<template>
  <div class="monthly-calendar">
    <div class="calendar-header">
      <div class="calendar-nav">
        <a-button type="text" @click="goToPreviousMonth" class="nav-button">
          <Icon name="lucide:chevron-left" />
        </a-button>

        <span class="month-year">{{ monthYear }}</span>

        <a-button type="text" @click="goToNextMonth" class="nav-button">
          <Icon name="lucide:chevron-right" />
        </a-button>
      </div>

      <!-- <a-button @click="goToToday" class="today-button"> Today </a-button> -->
    </div>

    <div class="calendar-grid">
      <div class="weekdays-header">
        <div v-for="day in weekDays" :key="day" class="weekday-label">
          {{ day }}
        </div>
      </div>

      <div class="days-grid">
        <button
          v-for="day in monthDays"
          :key="day.dateString"
          class="day-cell"
          :class="{
            'is-today': day.isToday,
            'is-other-month': !day.isCurrentMonth,
            'is-past': isPastDay(day.dateString),
          }"
          :disabled="isPastDay(day.dateString)"
          @click="handleDayClick(day)"
        >
          {{ day.dayNumber }}
        </button>
      </div>
    </div>

    <a-modal
      v-model:visible="modalVisible"
      :title="`Select time: ${selectedDay?.dayNumber} ${selectedDay?.monthName}`"
      @cancel="closeModal"
      width="600px"
      :footer="null"
    >
      <div v-if="selectedDay" class="modal-content">
        <div class="day-info">
          <p><strong>Date:</strong> {{ selectedDay.dateString }}</p>
          <p>
            <strong>Day of the week:</strong>
            {{ getDayName(selectedDay.dayOfWeek) }}
          </p>
        </div>

        <div v-if="meetings.length > 0" class="meetings-section">
          <h4>Booked Meetings:</h4>
          <div class="meetings-list">
            <div
              v-for="meeting in meetings"
              :key="meeting.id"
              class="meeting-card"
            >
              <div class="meeting-student">
                <div class="student__left">
                  <img
                    :src="meeting.student.image || '/images/person.jfif'"
                    :alt="meeting.student.fullName"
                    class="student-avatar"
                  />
                  <div class="student-info">
                    <p class="student-name">{{ meeting.student.fullName }}</p>
                    <p class="student-email">{{ meeting.student.email }}</p>
                  </div>
                </div>
                <p class="meeting-time">
                  <Icon name="lucide:clock" class="time-icon" />
                  {{ meeting.timeFrom.substring(0, 5) }} -
                  {{ meeting.timeTo.substring(0, 5) }}
                </p>
              </div>
              <div v-if="!meeting.meetingLink" class="meeting__form">
                <a-input
                  v-model:value="meetingLinks[meeting.id]"
                  placeholder="Enter meeting link"
                  :disabled="sendingLinkId === meeting.id"
                />
                <button
                  @click="handleSendMeetingLink(meeting.id)"
                  :disabled="sendingLinkId === meeting.id"
                >
                  <span v-if="sendingLinkId === meeting.id">Sending...</span>
                  <span v-else>Send</span>
                </button>
              </div>
              <a
                v-else
                :href="meeting.meetingLink"
                target="_blank"
                class="meeting-link"
              >
                {{ meeting.meetingLink }}
              </a>
            </div>
          </div>
        </div>

        <div class="time-selection">
          <h4>Select available time:</h4>
          <div class="time-slots-grid">
            <button
              v-for="hour in availableHours"
              :key="hour"
              class="time-slot-button"
              :class="{
                selected: isHourSelected(hour),
                disabled: isHourDisabled(hour),
              }"
              :disabled="isHourDisabled(hour)"
              @click="toggleHour(hour)"
            >
              {{ hour }}:00
            </button>
          </div>
        </div>

        <div class="selected-info" v-if="selectedHours.size > 0">
          <Icon name="lucide:info" class="info-icon" />
          Selected: {{ selectedHours.size }} hour{{
            selectedHours.size > 1 ? "s" : ""
          }}
        </div>

        <div class="modal-actions">
          <a-button @click="closeModal" :disabled="loading"> Cancel </a-button>
          <a-button
            type="primary"
            @click="handleSubmit"
            :loading="loading"
            :disabled="selectedHours.size === 0"
          >
            Save
          </a-button>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<style scoped>
.monthly-calendar {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 24px;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.calendar-nav {
  display: flex;
  align-items: center;
  gap: 16px;
}

.nav-button {
  width: 36px;
  height: 36px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s;
}

.nav-button:hover {
  background: var(--border);
}

.month-year {
  font-size: 18px;
  font-weight: 600;
  color: var(--dark);
  min-width: 200px;
  text-align: center;
}

.today-button {
  border-radius: 8px;
  padding: 6px 16px;
  font-weight: 500;
}

.calendar-grid {
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
}

.weekdays-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background: var(--light-blue);
  border-bottom: 1px solid var(--border);
}

.weekday-label {
  padding: 12px;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  color: var(--dark);
}

.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background: var(--border);
}

.day-cell {
  aspect-ratio: 1;
  background: white;
  border: none;
  padding: 12px;
  font-size: 14px;
  font-weight: 500;
  color: var(--dark);
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.day-cell:hover {
  background: var(--light-blue);
  color: var(--blue);
  font-weight: 600;
}

.day-cell.is-today {
  border: 2px solid var(--blue);
  color: var(--blue);
  font-weight: 700;
}

.day-cell.is-today:hover {
  background: var(--blue);
  opacity: 0.9;
}

.day-cell.is-other-month {
  color: var(--light-grey);
  background: #fafafa;
}

.day-cell.is-other-month:hover {
  background: var(--border);
  color: var(--text-grey);
}

.day-cell.is-past {
  color: #d9d9d9;
  background: #fafafa;
  cursor: not-allowed;
}

.day-cell.is-past:hover {
  background: #fafafa;
  color: #d9d9d9;
  font-weight: 500;
}

.modal-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.day-info {
  padding: 16px;
  background: var(--border);
  border-radius: 8px;
}

.day-info p {
  margin-bottom: 8px;
  font-size: 14px;
  line-height: 20px;
}

.day-info p:last-child {
  margin-bottom: 0;
}

.day-info strong {
  color: var(--dark);
}

.time-selection h4 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: var(--dark);
}

.time-slots-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.time-slot-button {
  padding: 12px;
  border: 2px solid var(--border);
  background: white;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--dark);
  cursor: pointer;
  transition: all 0.2s;
}

.time-slot-button:hover {
  border-color: var(--blue);
  color: var(--blue);
  background: var(--light-blue);
}

.time-slot-button.selected {
  background: var(--blue);
  border-color: var(--blue);
  color: white;
  font-weight: 600;
}

.time-slot-button.disabled {
  background: #fafafa;
  border-color: var(--border);
  color: #d9d9d9;
  cursor: not-allowed;
}

.time-slot-button.disabled:hover {
  background: #fafafa;
  border-color: var(--border);
  color: #d9d9d9;
}

.selected-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: var(--light-blue);
  border-radius: 8px;
  color: var(--blue);
  font-size: 14px;
  font-weight: 500;
}

.info-icon {
  font-size: 18px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid var(--border);
}

.meetings-section {
  margin-bottom: 24px;
}

.meetings-section h4 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: var(--dark);
}

.meetings-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.meeting-card {
  padding: 16px;
  background: white;
  border: 1px solid var(--border);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: all 0.2s;
}

.meeting-card:hover {
  border-color: var(--blue);
  box-shadow: 0 2px 8px rgba(43, 127, 255, 0.1);
}

.meeting-student {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.student-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--border);
}

.student-info {
  flex: 1;
}

.student-name {
  font-size: 15px;
  line-height: 100%;
  font-weight: 600;
  color: var(--dark);
  margin-bottom: 4px;
}

.student-email {
  font-size: 13px;
  color: var(--text-grey);
  margin: 0;
}

.meeting-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.meeting-time {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  background: var(--border);
  padding: 4px 8px;
  border-radius: 6px;
}

.time-icon {
  font-size: 16px;
}

.meeting-description {
  font-size: 14px;
  color: var(--text-grey);
  line-height: 1.5;
  margin: 0;
  display: none;
}

.meeting-link {
  display: inline-flex;
  align-items: center;
  color: var(--blue);
  font-size: 13px;
  font-weight: 500;
  text-decoration: underline;
  transition: all 0.2s;
  width: fit-content;
}

.link-icon {
  font-size: 14px;
}
.student__left {
  display: flex;
  align-items: center;
  gap: 8px;
}
.meeting__form {
  display: grid;
  grid-template-columns: auto 100px;
  align-items: center;
  gap: 8px;
}
.meeting__form button {
  padding: 8px 12px;
  background: var(--blue);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  height: 100%;
  font-size: 13px;
  font-weight: 500;
}
.meeting__form button:hover:not(:disabled) {
  opacity: 0.9;
}
.meeting__form button:disabled {
  background: #d9d9d9;
  cursor: not-allowed;
}
@media (max-width: 768px) {
  .month-year {
    min-width: 150px;
    font-size: 16px;
  }

  .day-cell {
    padding: 8px;
    font-size: 13px;
  }

  .weekday-label {
    padding: 8px;
    font-size: 12px;
  }

  .time-slots-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }

  .time-slot-button {
    padding: 10px;
    font-size: 13px;
  }
}
</style>
