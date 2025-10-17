export default defineNuxtPlugin(() => {
  const { logout } = useAuth();

  $fetch.create({
    onResponseError({ response }) {
      if (response.status === 401) {
        logout();
      }
    },
  });
});
