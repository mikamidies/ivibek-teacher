import { isTokenExpired } from "~/utils/jwt";

interface Country {
  id: number;
  name: string;
}

interface Faculty {
  id: number;
  name: string;
}

interface University {
  id: number;
  name: string;
}

interface UserInfo {
  id: number;
  fullName: string;
  gender: string;
  email: string;
  dateOfBirth: string;
  country: Country;
  faculty: Faculty | null;
  university: University | null;
  timezone?: string | null;
}

interface Pricing {
  meetingHourPrice: number | null;
}

interface User {
  id: number;
  username: string;
  image: string | null;
  info: UserInfo;
  about: string | null;
  pricing: Pricing;
  joinedAt: string;
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user?: User;
}

let refreshPromise: Promise<boolean> | null = null;
let isFetchingUser = false;

export const useAuth = () => {
  // Сохраняем данные пользователя в cookie для персистентности
  const userDataCookie = useCookie<User | null>("user_data", {
    maxAge: 60 * 60 * 24 * 7,
  });

  // Инициализируем user из cookie если есть
  const user = useState<User | null>(
    "user",
    () => userDataCookie.value || null
  );

  const accessToken = useCookie("access_token", {
    maxAge: 60 * 60 * 24 * 7,
  });
  const refreshToken = useCookie("refresh_token", {
    maxAge: 60 * 60 * 24 * 30,
  });

  const API_BASE = "https://api.ivybek.com";

  const logout = () => {
    accessToken.value = null;
    refreshToken.value = null;
    user.value = null;
    userDataCookie.value = null; // Очищаем cookie
    refreshPromise = null;

    if (import.meta.client) {
      navigateTo("/auth/login");
    }
  };

  const login = async (
    username: string,
    password: string,
    remember: boolean = false
  ) => {
    try {
      const data: AuthResponse = await $fetch(
        `${API_BASE}/api/v1/mentor/auth/login`,
        {
          method: "POST",
          body: { username, password },
        }
      );

      accessToken.value = data.accessToken;
      refreshToken.value = data.refreshToken;

      if (data.user) {
        user.value = data.user;
        userDataCookie.value = data.user; // Сохраняем в cookie
      } else {
        await fetchUser();
      }

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.data?.message || "Неверный логин или пароль",
      };
    }
  };

  const register = async (formData: {
    username: string;
    password: string;
    passwordConfirm: string;
    fullName?: string;
    gender?: "MALE" | "FEMALE";
    dateOfBirth?: string;
    email?: string;
    countryId?: number;
    meetingHourPrice?: number | null;
    universityId?: number | null;
    majorId?: number | null;
  }) => {
    try {
      const data: AuthResponse = await $fetch(
        `${API_BASE}/api/v1/mentor/auth/register`,
        {
          method: "POST",
          body: formData,
        }
      );

      accessToken.value = data.accessToken;
      refreshToken.value = data.refreshToken;

      if (data.user) {
        user.value = data.user;
        userDataCookie.value = data.user; // Сохраняем в cookie
      } else {
        await fetchUser();
      }

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.data?.message || "Ошибка регистрации",
      };
    }
  };

  const refresh = async (): Promise<boolean> => {
    // Защита от множественных одновременных вызовов refresh
    if (refreshPromise) {
      console.log("🔄 Refresh already in progress, waiting...");
      return refreshPromise;
    }

    if (!refreshToken.value) {
      console.log("❌ No refresh token available");
      return false;
    }

    console.log("🔄 Refreshing tokens...");

    refreshPromise = (async () => {
      try {
        const data: AuthResponse = await $fetch(
          `${API_BASE}/api/v1/mentor/auth/refresh`,
          {
            method: "POST",
            body: { refreshToken: refreshToken.value },
          }
        );

        accessToken.value = data.accessToken;
        refreshToken.value = data.refreshToken;

        // Если API вернул данные пользователя - используем их
        if (data.user) {
          user.value = data.user;
          userDataCookie.value = data.user; // Сохраняем в cookie
          console.log("✅ User data received in refresh response");
          console.log("🖼️ User image from refresh:", data.user.image);
        }

        console.log("✅ Tokens refreshed successfully");
        return true;
      } catch (error) {
        console.error("❌ Error refreshing tokens:", error);
        logout();
        return false;
      } finally {
        refreshPromise = null;
      }
    })();

    return refreshPromise;
  };

  const fetchUser = async () => {
    // Защита от множественных одновременных вызовов
    if (isFetchingUser) {
      console.log("⏳ fetchUser already in progress, skipping...");
      return;
    }

    console.log("📥 Fetching user profile...");

    if (!accessToken.value) {
      console.log("❌ No access token available for fetchUser");
      return;
    }

    // Проверяем истёк ли токен ПЕРЕД запросом
    if (isTokenExpired(accessToken.value)) {
      console.log("⏰ Access token expired, refreshing before fetch...");
      const refreshed = await refresh();
      if (!refreshed || !accessToken.value) {
        console.log("❌ Failed to refresh token in fetchUser");
        return;
      }
    }

    isFetchingUser = true;

    try {
      const data = await $fetch(`${API_BASE}/api/v1/mentor/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken.value}`,
        },
      });

      user.value = data as User;
      userDataCookie.value = data as User; // Сохраняем в cookie
      console.log("✅ User profile loaded:", user.value?.info?.fullName);
      console.log("🖼️ User image RAW:", user.value?.image);
      console.log("🖼️ Full user object:", JSON.stringify(user.value, null, 2));
    } catch (error: any) {
      console.error("❌ Failed to fetch user:", error);

      // Только если это 401, пытаемся обновить токен ОДИН РАЗ
      if (error.statusCode === 401 || error.status === 401) {
        console.log("🔒 Got 401 in fetchUser, attempting token refresh...");
        const refreshed = await refresh();
        if (!refreshed) {
          console.log("❌ Token refresh failed, logging out");
          logout();
        }
        // НЕ повторяем запрос здесь - refresh уже установил user.value если API вернул данные
      }
    } finally {
      isFetchingUser = false;
    }
  };

  const updateProfile = async (profileData: {
    fullName?: string;
    countryId?: number;
    email?: string;
    dateOfBirth?: string;
    gender?: "MALE" | "FEMALE";
    timezone?: string;
    meetingHourPrice?: number | null;
    universityId?: number | null;
    majorId?: number | null;
  }) => {
    if (!accessToken.value) {
      return { success: false, error: "Не авторизован" };
    }

    try {
      await $fetch(`${API_BASE}/api/v1/mentor/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken.value}`,
          "Content-Type": "application/json",
        },
        body: profileData,
      });

      await fetchUser();

      return { success: true };
    } catch (error: any) {
      console.error("Composable error:", error);
      return {
        success: false,
        error: error.data?.message || "Ошибка обновления профиля",
      };
    }
  };

  const updateProfileImage = async (imageFile: File) => {
    if (!accessToken.value) {
      return { success: false, error: "Не авторизован" };
    }

    try {
      const formData = new FormData();
      formData.append("file", imageFile);

      const response = await fetch(`${API_BASE}/api/v1/common/files/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const uploadResponse = await response.json();
      console.log("📤 Upload response:", uploadResponse);

      // API возвращает shouldUrl с полным путём к изображению
      const imagePath = uploadResponse.shouldUrl || uploadResponse.filePath;
      console.log("📁 Image path from response:", imagePath);

      if (!imagePath) {
        throw new Error("Не удалось получить путь к изображению");
      }

      console.log("🔄 Updating profile with image path:", imagePath);

      await $fetch(`${API_BASE}/api/v1/mentor/profile/updateImage`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken.value}`,
          "Content-Type": "application/json",
        },
        body: {
          image: imagePath,
        },
      });

      await fetchUser();

      return { success: true };
    } catch (error: any) {
      console.error("Image upload error:", error);
      return {
        success: false,
        error: error.message || "Ошибка загрузки фото",
      };
    }
  };

  const updateAbout = async (about: string) => {
    if (!accessToken.value) {
      return { success: false, error: "Не авторизован" };
    }

    try {
      await $fetch(`${API_BASE}/api/v1/mentor/profile/updateAbout`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken.value}`,
          "Content-Type": "application/json",
        },
        body: { about },
      });

      await fetchUser();

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.data?.message || "Ошибка обновления описания",
      };
    }
  };

  const resetPassword = async (
    username: string,
    newPassword: string,
    confirmPassword: string
  ) => {
    try {
      await $fetch(`${API_BASE}/api/v1/mentor/auth/reset-password`, {
        method: "POST",
        body: { username, newPassword, confirmPassword },
      });

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error:
          error.data?.message ||
          "Ошибка сброса пароля. Проверьте имя пользователя",
      };
    }
  };

  return {
    user,
    accessToken,
    refreshToken,
    login,
    register,
    refresh,
    fetchUser,
    updateProfile,
    updateProfileImage,
    updateAbout,
    resetPassword,
    logout,
  };
};
