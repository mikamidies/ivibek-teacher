let isRefreshing = false;

export default defineNuxtPlugin(() => {
  const { logout, refresh } = useAuth();

  $fetch.create({
    async onResponseError({ response }) {
      if (response.status === 401) {
        if (isRefreshing) {
          return;
        }

        try {
          isRefreshing = true;
          const refreshed = await refresh();

          if (!refreshed) {
            logout();
          } else {
            console.log("Token refreshed after 401");
          }
        } catch (error) {
          logout();
        } finally {
          isRefreshing = false;
        }
      }
    },
  });
});
