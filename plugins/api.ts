// Флаг для защиты от множественных одновременных refresh при 401
let isRefreshing = false;

export default defineNuxtPlugin(() => {
  const { logout, refresh } = useAuth();

  $fetch.create({
    async onResponseError({ response }) {
      if (response.status === 401) {
        console.log("🔒 401 Error - refreshing token...");

        // Если уже идёт процесс обновления, просто логаут
        if (isRefreshing) {
          console.log("⏳ Refresh already in progress");
          return;
        }

        try {
          isRefreshing = true;
          const refreshed = await refresh();

          if (!refreshed) {
            console.log("❌ Failed to refresh token, logging out");
            logout();
          } else {
            console.log("✅ Token refreshed after 401");
          }
        } catch (error) {
          console.error("❌ Error during token refresh:", error);
          logout();
        } finally {
          isRefreshing = false;
        }
      }
    },
  });
});
