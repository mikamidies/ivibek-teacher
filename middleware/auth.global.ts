export default defineNuxtRouteMiddleware(async (to) => {
  const { accessToken, refreshToken, refresh } = useAuth();

  const publicPages = ["/auth/login", "/auth/register", "/auth/forgot"];

  if (publicPages.includes(to.path)) {
    return;
  }

  // Если нет access токена, но есть refresh - пробуем обновить
  if (!accessToken.value && refreshToken.value) {
    await refresh();
  }

  // Если все еще нет токена - редирект на логин
  if (!accessToken.value) {
    return navigateTo("/auth/login");
  }
});
