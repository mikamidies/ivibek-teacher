interface TimeSlotItem {
  hour: number;
  minute: number;
  second: number;
  nano: number;
}

interface AssignTimeSlotsRequest {
  date: string;
  times: TimeSlotItem[];
}

export const useTimeSlots = () => {
  const API_BASE = "https://api.ivybek.com";
  const { accessToken } = useAuth();

  const assignTimeSlots = async (
    date: string,
    hours: number[]
  ): Promise<boolean> => {
    try {
      const times: TimeSlotItem[] = hours.map((hour) => ({
        hour,
        minute: 0,
        second: 0,
        nano: 0,
      }));

      const requestBody: AssignTimeSlotsRequest = {
        date,
        times,
      };

      console.log("Отправка запроса на сервер:");
      console.log("URL:", `${API_BASE}/api/v1/mentor/timeslots/assign`);
      console.log("Body:", JSON.stringify(requestBody, null, 2));
      console.log("Token:", accessToken.value ? "Есть" : "Нет");

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

      console.log("Ответ сервера:", response);

      return true;
    } catch (error: any) {
      console.error("Полная ошибка:", error);
      console.error("Статус:", error?.status);
      console.error("Данные ошибки:", error?.data);
      console.error("Сообщение:", error?.message);

      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "Не удалось назначить временные слоты";
      throw new Error(errorMessage);
    }
  };

  return {
    assignTimeSlots,
  };
};
