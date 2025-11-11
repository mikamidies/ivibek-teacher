import { isTokenExpired } from "~/utils/jwt";

export default defineNuxtRouteMiddleware(async (to) => {
  const { accessToken, refresh } = useAuth();

  const publicPages = ["/auth/login", "/auth/register", "/auth/forgot"];

  if (publicPages.includes(to.path)) {
    return;
  }

  // Проверяем наличие токена
  if (!accessToken.value) {
    return navigateTo("/auth/login");
  }

  // Проверяем истёк ли токен
  if (isTokenExpired(accessToken.value)) {
    console.log("🔒 Token expired in middleware, attempting refresh...");

    // Пытаемся обновить токен
    const refreshed = await refresh();

    if (!refreshed) {
      console.log("❌ Failed to refresh token in middleware");
      return navigateTo("/auth/login");
    }

    console.log("✅ Token refreshed successfully in middleware");
  }
});
