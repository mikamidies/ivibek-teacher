interface Country {
  id: number;
  name: string;
}

interface UserInfo {
  fullName: string;
  gender: string;
  email: string;
  dateOfBirth: string;
  country: Country;
  timezone: string | null;
  about: string | null;
}

interface User {
  id: number;
  username: string;
  info: UserInfo;
  joinedAt: string;
  meetingHourPrice: number | null;
  universityId: number | null;
  majorId: number | null;
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user?: User;
}

export const useAuth = () => {
  const user = useState<User | null>("user", () => null);
  const accessToken = useCookie("access_token", {
    maxAge: 60 * 15,
  });
  const refreshToken = useCookie("refresh_token", {
    maxAge: 60 * 60 * 24 * 30,
  });

  const API_BASE = "https://api.ivybek.com";

  const logout = () => {
    accessToken.value = null;
    refreshToken.value = null;
    user.value = null;

    if (import.meta.client) {
      window.location.href = "/auth/login";
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

  const refresh = async () => {
    if (!refreshToken.value) return false;

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

      if (data.user) {
        user.value = data.user;
      }

      return true;
    } catch {
      logout();
      return false;
    }
  };

  const fetchUser = async () => {
    if (!accessToken.value) {
      await refresh();
      if (!accessToken.value) return;
    }

    try {
      const data = await $fetch(`${API_BASE}/api/v1/mentor/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken.value}`,
        },
      });

      user.value = data as User;
    } catch (error) {
      console.error("Failed to fetch user:", error);
      const refreshed = await refresh();
      if (!refreshed) {
        logout();
      }
    }
  };

  const updateProfile = async (profileData: {
    fullName?: string;
    countryId?: number;
    email?: string;
    dateOfBirth?: string;
    gender?: "MALE" | "FEMALE";
    about?: string;
    meetingHourPrice?: number | null;
    universityId?: number | null;
    majorId?: number | null;
  }) => {
    if (!accessToken.value) {
      return { success: false, error: "Не авторизован" };
    }

    const currentData = {
      fullName: user.value?.info?.fullName || "",
      email: user.value?.info?.email || "",
      dateOfBirth: user.value?.info?.dateOfBirth || undefined,
      gender: user.value?.info?.gender || "MALE",
      countryId: user.value?.info?.country?.id || 1,
      about: user.value?.info?.about || "",
    };

    const mergedData = { ...currentData, ...profileData };

    try {
      const data = await $fetch(`${API_BASE}/api/v1/mentor/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken.value}`,
        },
        body: mergedData,
      });

      await fetchUser();

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.data?.message || "Ошибка обновления профиля",
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
    login,
    register,
    refresh,
    fetchUser,
    updateProfile,
    resetPassword,
    logout,
  };
};
