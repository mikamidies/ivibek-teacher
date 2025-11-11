import { shouldRefreshToken, getTokenExpiryTime } from "~/utils/jwt";

export default defineNuxtPlugin(() => {
  const { refresh, accessToken, refreshToken } = useAuth();

  // Отслеживание активности пользователя
  let lastActivity = Date.now();
  const INACTIVITY_THRESHOLD = 30 * 60 * 1000; // 30 минут неактивности

  // События для отслеживания активности
  const activityEvents = [
    "mousedown",
    "mousemove",
    "keypress",
    "scroll",
    "touchstart",
    "click",
  ];

  const updateActivity = () => {
    lastActivity = Date.now();
  };

  // Добавляем слушатели событий
  activityEvents.forEach((event) => {
    window.addEventListener(event, updateActivity, { passive: true });
  });

  const checkAndRefreshToken = async () => {
    // Проверяем есть ли вообще токены
    if (!accessToken.value || !refreshToken.value) {
      return;
    }

    // Проверяем активность пользователя
    const isUserActive = Date.now() - lastActivity < INACTIVITY_THRESHOLD;
    if (!isUserActive) {
      console.log("😴 User inactive, skipping token refresh");
      return;
    }

    // Проверяем нужно ли обновлять токен (< 5 минут до истечения)
    if (shouldRefreshToken(accessToken.value)) {
      const timeLeft = getTokenExpiryTime(accessToken.value);
      console.log(
        `⏰ Token expires in ${Math.floor(
          timeLeft / 60
        )} minutes, refreshing...`
      );
      await refresh();
    }
  };

  // Проверяем каждые 2 минуты
  const intervalId = setInterval(checkAndRefreshToken, 2 * 60 * 1000);

  // Очистка при размонтировании
  if (import.meta.client) {
    window.addEventListener("beforeunload", () => {
      clearInterval(intervalId);
      activityEvents.forEach((event) => {
        window.removeEventListener(event, updateActivity);
      });
    });
  }
});
