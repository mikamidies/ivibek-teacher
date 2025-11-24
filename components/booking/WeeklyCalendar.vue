<script setup lang="ts">
import { ref, computed } from "vue";
import type { DayInfo, TimeSlot } from "@/utils/calendar";
import {
  generateWeekDays,
  generateTimeSlots,
  getPreviousWeek,
  getNextWeek,
  getToday,
  formatWeekRange,
  getDayName,
  isPastDay,
} from "@/utils/calendar";
import { message } from "ant-design-vue";

const { assignTimeSlots, fetchTimeSlotsByDate } = useTimeSlots();

const currentDate = ref<Date>(getToday());
const modalVisible = ref(false);
const selectedDay = ref<DayInfo | null>(null);
const selectedHours = ref<Set<number>>(new Set());
const loading = ref(false);
const assignedTimeSlots = ref<{ [date: string]: string[] }>({});

const availableHours = Array.from({ length: 13 }, (_, i) => i + 10);

const weekDays = computed(() => generateWeekDays(currentDate.value));
const timeSlots = computed(() => generateTimeSlots());
const weekRange = computed(() => formatWeekRange(currentDate.value));

const handleSlotClick = async (day: DayInfo) => {
  if (isPastDay(day.dateString)) {
    return;
  }
  selectedDay.value = day;
  selectedHours.value.clear();
  modalVisible.value = true;

  assignedTimeSlots.value = await fetchTimeSlotsByDate(day.dateString);
};

const goToPreviousWeek = () => {
  currentDate.value = getPreviousWeek(currentDate.value);
};

const goToNextWeek = () => {
  currentDate.value = getNextWeek(currentDate.value);
};

const goToToday = () => {
  currentDate.value = getToday();
};

const closeModal = () => {
  modalVisible.value = false;
  selectedDay.value = null;
  selectedHours.value.clear();
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

  return assignedHours.some((time: string) => {
    // Извлекаем час из формата "11:00:00" или "11:00"
    const timeHour = time.split(":")[0];
    return timeHour === formattedHour;
  });
};

const handleSubmit = async () => {
  if (selectedHours.value.size === 0) {
    message.warning("Please select at least one hour");
    return;
  }

  if (!selectedDay.value) return;

  loading.value = true;

  try {
    const hours = Array.from(selectedHours.value).sort((a, b) => a - b);
    await assignTimeSlots(selectedDay.value.dateString, hours);

    message.success(`Successfully assigned ${hours.length} time slots`);

    closeModal();
  } catch (error: any) {
    message.error(error.message || "Failed to save");
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="weekly-calendar">
    <div class="calendar-header">
      <div class="calendar-nav">
        <a-button type="text" @click="goToPreviousWeek" class="nav-button">
          <Icon name="lucide:arrow-left" />
        </a-button>

        <span class="week-range">{{ weekRange }}</span>

        <a-button type="text" @click="goToNextWeek" class="nav-button">
          <Icon name="lucide:arrow-right" />
        </a-button>
      </div>

      <a-button @click="goToToday" class="today-button"> Today </a-button>
    </div>

    <div class="calendar-grid">
      <div class="calendar-days-header">
        <div
          v-for="day in weekDays"
          :key="day.dateString"
          class="day-header"
          :class="{ 'is-today': day.isToday }"
        >
          <div class="day-name">{{ getDayName(day.dayOfWeek) }}</div>
          <div class="day-number">{{ day.dayNumber }}</div>
        </div>
      </div>

      <div class="calendar-body">
        <div
          v-for="timeSlot in timeSlots"
          :key="timeSlot.time"
          class="time-row"
        >
          <button
            v-for="day in weekDays"
            :key="`${day.dateString}-${timeSlot.time}`"
            class="time-slot"
            :class="{
              'is-available': !isPastDay(day.dateString),
              'is-disabled': isPastDay(day.dateString),
              'is-today-column': day.isToday,
            }"
            :disabled="isPastDay(day.dateString)"
            @click="handleSlotClick(day)"
          >
            {{ timeSlot.time }}
          </button>
        </div>
      </div>
    </div>

    <!-- Модалка для выбора часов -->
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

        <div class="selected-info-modal" v-if="selectedHours.size > 0">
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
.weekly-calendar {
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
  width: 32px;
  height: 32px;
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

.week-range {
  font-size: 16px;
  font-weight: 500;
  color: var(--dark);
  min-width: 120px;
  text-align: center;
}

.today-button {
  border-radius: 8px;
  padding: 6px 16px;
  font-weight: 500;
}

.calendar-grid {
  overflow-x: auto;
}

.calendar-days-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background: var(--border);
  border: 1px solid var(--border);
  border-radius: 12px 12px 0 0;
  overflow: hidden;
}

.time-column-header {
  background: white;
  padding: 12px;
}

.day-header {
  background: white;
  padding: 8px 0;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.day-header.is-today {
  background: var(--light-blue);
}

.day-name {
  font-size: 14px;
  font-weight: 500;
  text-transform: capitalize;
}

.day-number {
  font-size: 12px;
  font-weight: 500;
  color: var(--light-grey);
}

.day-header.is-today .day-number {
  color: var(--blue);
}

.calendar-body {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border);
  border-top: none;
  border-radius: 0 0 12px 12px;
  overflow: hidden;
}

.time-row {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background: var(--border);
  border-bottom: 1px solid var(--border);
}

.time-row:last-child {
  border-bottom: none;
}

.time-label {
  background: white;
  padding: 12px;
  font-size: 14px;
  color: var(--light-grey);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
}

.time-slot {
  background: white;
  border: none;
  padding: 12px 8px;
  font-size: 13px;
  color: var(--light-grey);
  cursor: not-allowed;
  transition: all 0.2s;
  position: relative;
  min-height: 48px;
}

.time-slot.is-available {
  cursor: pointer;
  color: var(--dark);
  font-weight: 500;
}

.time-slot.is-available:hover {
  background: var(--light-blue);
  color: var(--blue);
}

.time-slot.is-selected {
  background: var(--blue);
  color: white;
  font-weight: 600;
}

.time-slot.is-disabled {
  color: #d9d9d9;
  background: #fafafa;
}

.time-slot.is-today-column {
  border-left: 2px solid var(--blue);
  border-right: 2px solid var(--blue);
}

/* Модальное окно */
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

.selected-info-modal {
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

@media (max-width: 768px) {
  .calendar-grid {
    overflow-x: scroll;
  }

  .calendar-days-header,
  .time-row {
    min-width: 700px;
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
