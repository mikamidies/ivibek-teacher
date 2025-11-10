export default defineNuxtPlugin(() => {
  const { refresh, accessToken, refreshToken } = useAuth();

  // Запускаем автообновление токенов каждые 14 минут
  if (accessToken.value || refreshToken.value) {
    setInterval(async () => {
      await refresh();
    }, 14 * 60 * 1000);
  }
});
