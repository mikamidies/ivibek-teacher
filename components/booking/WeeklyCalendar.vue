<script setup lang="ts">
import { ref, computed, watch } from "vue";
import type { DayInfo, TimeSlot } from "@/utils/calendar";
import {
  generateWeekDays,
  generateTimeSlots,
  getPreviousWeek,
  getNextWeek,
  getToday,
  formatWeekRange,
  getDayName,
  getSlotKey,
  isPastDateTime,
} from "@/utils/calendar";

interface Props {
  mentorId?: number;
  availableSlots?: string[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "update:selectedSlots", slots: string[]): void;
  (e: "confirm", slots: string[]): void;
}>();

const currentDate = ref<Date>(getToday());
const selectedSlots = ref<Set<string>>(new Set());

const weekDays = computed(() => generateWeekDays(currentDate.value));
const timeSlots = computed(() => generateTimeSlots());
const weekRange = computed(() => formatWeekRange(currentDate.value));

const isSlotAvailable = (day: DayInfo, timeSlot: TimeSlot): boolean => {
  if (isPastDateTime(day.dateString, timeSlot.time)) {
    return false;
  }

  if (!props.availableSlots || props.availableSlots.length === 0) {
    return true;
  }

  const slotDateTime = `${day.dateString}T${timeSlot.time}`;
  return props.availableSlots.includes(slotDateTime);
};

const isSlotSelected = (day: DayInfo, timeSlot: TimeSlot): boolean => {
  const key = getSlotKey(day.dateString, timeSlot.time);
  return selectedSlots.value.has(key);
};

const toggleSlot = (day: DayInfo, timeSlot: TimeSlot) => {
  if (!isSlotAvailable(day, timeSlot)) {
    return;
  }

  const key = getSlotKey(day.dateString, timeSlot.time);

  if (selectedSlots.value.has(key)) {
    selectedSlots.value.delete(key);
  } else {
    selectedSlots.value.add(key);
  }

  emitSelectedSlots();
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

const emitSelectedSlots = () => {
  const slots = Array.from(selectedSlots.value);
  emit("update:selectedSlots", slots);
};

watch(currentDate, () => {
  selectedSlots.value.clear();
  emitSelectedSlots();
});

const confirmSelection = () => {
  const slots = Array.from(selectedSlots.value);
  emit("confirm", slots);
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
            :key="getSlotKey(day.dateString, timeSlot.time)"
            class="time-slot"
            :class="{
              'is-available': isSlotAvailable(day, timeSlot),
              'is-disabled': !isSlotAvailable(day, timeSlot),
              'is-selected': isSlotSelected(day, timeSlot),
              'is-today-column': day.isToday,
            }"
            :disabled="!isSlotAvailable(day, timeSlot)"
            @click="toggleSlot(day, timeSlot)"
          >
            {{ timeSlot.time }}
          </button>
        </div>
      </div>
    </div>

    <div class="calendar-footer" v-if="selectedSlots.size > 0">
      <div class="selected-info">
        Selected: {{ selectedSlots.size }} slot{{
          selectedSlots.size > 1 ? "s" : ""
        }}
      </div>
      <a-button type="primary" @click="confirmSelection" class="confirm-button">
        Continue to Payment
      </a-button>
    </div>
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

.calendar-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-top: 1px solid var(--border);
}

.selected-info {
  font-size: 14px;
  color: var(--dark);
  font-weight: 500;
}

.confirm-button {
  border-radius: 8px;
  padding: 8px 24px;
  height: auto;
  font-weight: 500;
}

@media (max-width: 768px) {
  .calendar-grid {
    overflow-x: scroll;
  }

  .calendar-days-header,
  .time-row {
    min-width: 700px;
  }
}
</style>
