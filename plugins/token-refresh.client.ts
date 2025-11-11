import { shouldRefreshToken, getTokenExpiryTime } from "~/utils/jwt";

export default defineNuxtPlugin(() => {
  const { refresh, accessToken, refreshToken } = useAuth();

  let lastActivity = Date.now();
  const INACTIVITY_THRESHOLD = 30 * 60 * 1000;
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

  activityEvents.forEach((event) => {
    window.addEventListener(event, updateActivity, { passive: true });
  });

  const checkAndRefreshToken = async () => {
    if (!accessToken.value || !refreshToken.value) {
      return;
    }

    const isUserActive = Date.now() - lastActivity < INACTIVITY_THRESHOLD;
    if (!isUserActive) {
      return;
    }

    if (shouldRefreshToken(accessToken.value)) {
      const timeLeft = getTokenExpiryTime(accessToken.value);
      console.log(
        `Token expires in ${Math.floor(timeLeft / 60)} minutes, refreshing...`
      );
      await refresh();
    }
  };

  const intervalId = setInterval(checkAndRefreshToken, 2 * 60 * 1000);

  if (import.meta.client) {
    window.addEventListener("beforeunload", () => {
      clearInterval(intervalId);
      activityEvents.forEach((event) => {
        window.removeEventListener(event, updateActivity);
      });
    });
  }
});
