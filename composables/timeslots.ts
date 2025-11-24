interface AssignTimeSlotsRequest {
  date: string;
  times: string[];
}

interface TimeSlotsByDateResponse {
  date: string;
  times: string[];
}

interface TimeSlotsByDate {
  [date: string]: string[];
}

export const useTimeSlots = () => {
  const API_BASE = "https://api.ivybek.com";
  const { accessToken } = useAuth();

  const fetchTimeSlotsByDate = async (
    date: string
  ): Promise<TimeSlotsByDate> => {
    try {
      const data = await $fetch<TimeSlotsByDateResponse>(
        `${API_BASE}/api/v1/mentor/timeslots/by-date`,
        {
          headers: {
            Authorization: `Bearer ${accessToken.value}`,
          },
          params: {
            date,
          },
        }
      );

      // Преобразуем ответ { date: "2025-11-25", times: ["11:00:00"] }
      // в формат { "2025-11-25": ["11:00:00"] }
      if (data && data.date && data.times) {
        return { [data.date]: data.times };
      }

      return {};
    } catch (error: any) {
      console.error("Failed to fetch timeslots by date:", error);
      return {};
    }
  };

  const assignTimeSlots = async (
    date: string,
    hours: number[]
  ): Promise<boolean> => {
    try {
      const times: string[] = hours.map((hour) => `${hour}:00`);

      const requestBody: AssignTimeSlotsRequest = {
        date,
        times,
      };

      const response = await $fetch(
        `${API_BASE}/api/v1/mentor/timeslots/assign`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken.value}`,
            "Content-Type": "application/json",
          },
          body: requestBody,
        }
      );

      return true;
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || error?.message || "Failed to assign time slots";
      throw new Error(errorMessage);
    }
  };

  return {
    assignTimeSlots,
    fetchTimeSlotsByDate,
  };
};
