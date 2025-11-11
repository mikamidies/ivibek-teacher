import { isTokenExpired } from "~/utils/jwt";

export default defineNuxtRouteMiddleware(async (to) => {
  const { accessToken, refresh } = useAuth();

  const publicPages = ["/auth/login", "/auth/register", "/auth/forgot"];

  if (publicPages.includes(to.path)) {
    return;
  }

  if (!accessToken.value) {
    return navigateTo("/auth/login");
  }

  if (isTokenExpired(accessToken.value)) {
    const refreshed = await refresh();

    if (!refreshed) {
      return navigateTo("/auth/login");
    }
  }
});
