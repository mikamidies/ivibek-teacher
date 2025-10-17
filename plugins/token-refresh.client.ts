export default defineNuxtPlugin(() => {
  const { refresh, accessToken } = useAuth();

  if (accessToken.value) {
    setInterval(async () => {
      await refresh();
    }, 14 * 60 * 1000);
  }
});
