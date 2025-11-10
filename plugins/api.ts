export default defineNuxtPlugin(() => {
  const { logout, refresh, accessToken } = useAuth();

  $fetch.create({
    async onResponseError({ response }) {
      if (response.status === 401) {
        // Пробуем обновить токен перед логаутом
        const refreshed = await refresh();
        if (!refreshed) {
          logout();
        }
      }
    },
  });
});
