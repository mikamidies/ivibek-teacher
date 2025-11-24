export interface DayInfo {
  date: Date;
  dateString: string;
  dayNumber: number;
  dayOfWeek: number;
  monthName: string;
  isToday: boolean;
  isCurrentMonth: boolean;
}

export interface TimeSlot {
  time: string;
  hour: number;
}

export const getWeekStart = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

export const getWeekEnd = (date: Date): Date => {
  const start = getWeekStart(date);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return end;
};

export const generateWeekDays = (currentDate: Date): DayInfo[] => {
  const weekStart = getWeekStart(currentDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const currentMonth = currentDate.getMonth();

  const days: DayInfo[] = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);

    const dayInfo: DayInfo = {
      date: date,
      dateString: formatDateToString(date),
      dayNumber: date.getDate(),
      dayOfWeek: i, // 0 = ПН, 6 = ВС
      monthName: getMonthName(date.getMonth()),
      isToday: date.getTime() === today.getTime(),
      isCurrentMonth: date.getMonth() === currentMonth,
    };

    days.push(dayInfo);
  }

  return days;
};

export const generateTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = [];

  for (let hour = 10; hour <= 22; hour++) {
    slots.push({
      time: `${hour}:00`,
      hour: hour,
    });
  }

  return slots;
};

export const getPreviousWeek = (currentDate: Date): Date => {
  const newDate = new Date(currentDate);
  newDate.setDate(newDate.getDate() - 7);
  return newDate;
};

export const getNextWeek = (currentDate: Date): Date => {
  const newDate = new Date(currentDate);
  newDate.setDate(newDate.getDate() + 7);
  return newDate;
};

export const getToday = (): Date => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

export const formatDateToString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getMonthName = (monthIndex: number): string => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return months[monthIndex];
};

export const getDayName = (dayOfWeek: number): string => {
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  return days[dayOfWeek];
};

export const formatWeekRange = (currentDate: Date): string => {
  const weekStart = getWeekStart(currentDate);
  const weekEnd = getWeekEnd(currentDate);

  const startMonth = getMonthNameShort(weekStart.getMonth());
  const endMonth = getMonthNameShort(weekEnd.getMonth());
  const startDay = weekStart.getDate();
  const endDay = weekEnd.getDate();

  if (weekStart.getMonth() === weekEnd.getMonth()) {
    return `${startMonth} ${startDay} - ${endDay}`;
  } else {
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}`;
  }
};

export const getMonthNameShort = (monthIndex: number): string => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return months[monthIndex];
};

export const isPastDateTime = (
  dateString: string,
  timeString: string
): boolean => {
  const now = new Date();
  const [year, month, day] = dateString.split("-").map(Number);
  const [hour] = timeString.split(":").map(Number);

  const slotDate = new Date(year, month - 1, day, hour, 0, 0);

  return slotDate < now;
};

export const isPastDay = (dateString: string): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [year, month, day] = dateString.split("-").map(Number);
  const checkDate = new Date(year, month - 1, day);
  checkDate.setHours(0, 0, 0, 0);

  return checkDate < today;
};

export const getSlotKey = (dateString: string, timeString: string): string => {
  return `${dateString}_${timeString}`;
};

export const getMonthStart = (date: Date): Date => {
  const d = new Date(date);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
};

export const getMonthEnd = (date: Date): Date => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + 1);
  d.setDate(0);
  d.setHours(23, 59, 59, 999);
  return d;
};

export const generateMonthDays = (currentDate: Date): DayInfo[] => {
  const monthStart = getMonthStart(currentDate);
  const monthEnd = getMonthEnd(currentDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const currentMonth = currentDate.getMonth();
  const days: DayInfo[] = [];

  let firstDayOfWeek = monthStart.getDay();
  firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(monthStart);
    date.setDate(date.getDate() - (i + 1));

    days.push({
      date: date,
      dateString: formatDateToString(date),
      dayNumber: date.getDate(),
      dayOfWeek: firstDayOfWeek - i - 1,
      monthName: getMonthName(date.getMonth()),
      isToday: date.getTime() === today.getTime(),
      isCurrentMonth: false,
    });
  }

  for (let day = 1; day <= monthEnd.getDate(); day++) {
    const date = new Date(currentDate.getFullYear(), currentMonth, day);

    days.push({
      date: date,
      dateString: formatDateToString(date),
      dayNumber: day,
      dayOfWeek: (firstDayOfWeek + day - 1) % 7,
      monthName: getMonthName(currentMonth),
      isToday: date.getTime() === today.getTime(),
      isCurrentMonth: true,
    });
  }

  const remainingDays = 7 - (days.length % 7);
  if (remainingDays < 7) {
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(monthEnd);
      date.setDate(date.getDate() + i);

      days.push({
        date: date,
        dateString: formatDateToString(date),
        dayNumber: date.getDate(),
        dayOfWeek: days.length % 7,
        monthName: getMonthName(date.getMonth()),
        isToday: date.getTime() === today.getTime(),
        isCurrentMonth: false,
      });
    }
  }

  return days;
};

export const getPreviousMonth = (currentDate: Date): Date => {
  const newDate = new Date(currentDate);
  newDate.setMonth(newDate.getMonth() - 1);
  return newDate;
};

export const getNextMonth = (currentDate: Date): Date => {
  const newDate = new Date(currentDate);
  newDate.setMonth(newDate.getMonth() + 1);
  return newDate;
};

export const formatMonthYear = (date: Date): string => {
  const monthName = getMonthName(date.getMonth());
  const year = date.getFullYear();
  return `${monthName} ${year}`;
};
