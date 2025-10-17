export default defineNuxtRouteMiddleware((to) => {
  const { accessToken } = useAuth();

  const publicPages = ["/auth/login", "/auth/register", "/auth/forgot"];

  if (publicPages.includes(to.path)) {
    return;
  }

  if (!accessToken.value) {
    return navigateTo("/auth/login");
  }
});
