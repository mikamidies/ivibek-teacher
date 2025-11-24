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

const { assignTimeSlots } = useTimeSlots();

const currentDate = ref<Date>(getToday());
const modalVisible = ref(false);
const selectedDay = ref<DayInfo | null>(null);
const selectedHours = ref<Set<number>>(new Set());
const loading = ref(false);

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

const handleDayClick = (day: DayInfo) => {
  if (isPastDay(day.dateString)) {
    return;
  }
  selectedDay.value = day;
  selectedHours.value.clear();
  modalVisible.value = true;
  emit("dayClick", day);
};

const closeModal = () => {
  modalVisible.value = false;
  selectedDay.value = null;
  selectedHours.value.clear();
  loading.value = false;
};

const toggleHour = (hour: number) => {
  if (selectedHours.value.has(hour)) {
    selectedHours.value.delete(hour);
  } else {
    selectedHours.value.add(hour);
  }
};

const isHourSelected = (hour: number) => {
  return selectedHours.value.has(hour);
};

const handleSubmit = async () => {
  if (selectedHours.value.size === 0) {
    message.warning("Выберите хотя бы один час");
    return;
  }

  if (!selectedDay.value) return;

  loading.value = true;

  try {
    const hours = Array.from(selectedHours.value).sort((a, b) => a - b);
    await assignTimeSlots(selectedDay.value.dateString, hours);

    message.success(`Успешно назначено ${hours.length} временных слотов`);
    closeModal();
  } catch (error: any) {
    message.error(error.message || "Ошибка при сохранении");
  } finally {
    loading.value = false;
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

      <a-button @click="goToToday" class="today-button"> Today </a-button>
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
      :title="`Выберите время: ${selectedDay?.dayNumber} ${selectedDay?.monthName}`"
      @cancel="closeModal"
      width="600px"
      :footer="null"
    >
      <div v-if="selectedDay" class="modal-content">
        <div class="day-info">
          <p><strong>Дата:</strong> {{ selectedDay.dateString }}</p>
          <p>
            <strong>День недели:</strong>
            {{ getDayName(selectedDay.dayOfWeek) }}
          </p>
        </div>

        <div class="time-selection">
          <h4>Выберите свободное время:</h4>
          <div class="time-slots-grid">
            <button
              v-for="hour in availableHours"
              :key="hour"
              class="time-slot-button"
              :class="{ selected: isHourSelected(hour) }"
              @click="toggleHour(hour)"
            >
              {{ hour }}:00
            </button>
          </div>
        </div>

        <div class="selected-info" v-if="selectedHours.size > 0">
          <Icon name="lucide:info" class="info-icon" />
          Выбрано: {{ selectedHours.size }} часов
        </div>

        <div class="modal-actions">
          <a-button @click="closeModal" :disabled="loading"> Отмена </a-button>
          <a-button
            type="primary"
            @click="handleSubmit"
            :loading="loading"
            :disabled="selectedHours.size === 0"
          >
            Сохранить
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
