export default defineNuxtPlugin(async () => {
  const { fetchUser, accessToken } = useAuth();

  if (accessToken.value) {
    await fetchUser();
  }
});
