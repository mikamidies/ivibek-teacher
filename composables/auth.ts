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

      const imagePath = uploadResponse.filePath;

      if (!imagePath) {
        throw new Error("Не удалось получить путь к изображению");
      }

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
