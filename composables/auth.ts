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
  const userDataCookie = useCookie<User | null>("user_data", {
    maxAge: 60 * 60 * 24 * 7,
  });

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
    userDataCookie.value = null;
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
        userDataCookie.value = data.user;
      } else {
        await fetchUser();
      }

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.data?.message || "Wrong username or password",
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
        userDataCookie.value = data.user;
      } else {
        await fetchUser();
      }

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.data?.message || "Registration error",
      };
    }
  };

  const refresh = async (): Promise<boolean> => {
    if (refreshPromise) {
      return refreshPromise;
    }

    if (!refreshToken.value) {
      return false;
    }

    refreshPromise = (async () => {
      try {
        const data: AuthResponse = await $fetch(
          `${API_BASE}/api/v1/common/auth/refresh`,
          {
            method: "POST",
            body: { refreshToken: refreshToken.value },
          }
        );

        accessToken.value = data.accessToken;
        refreshToken.value = data.refreshToken;

        if (data.user) {
          user.value = data.user;
          userDataCookie.value = data.user;
        }

        return true;
      } catch (error) {
        logout();
        return false;
      } finally {
        refreshPromise = null;
      }
    })();

    return refreshPromise;
  };

  const fetchUser = async () => {
    if (isFetchingUser) {
      return;
    }

    if (!accessToken.value) {
      return;
    }

    if (isTokenExpired(accessToken.value)) {
      const refreshed = await refresh();
      if (!refreshed || !accessToken.value) {
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
      userDataCookie.value = data as User;
    } catch (error: any) {
      if (error.statusCode === 401 || error.status === 401) {
        const refreshed = await refresh();
        if (!refreshed) {
          logout();
        }
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
      return { success: false, error: "Unauthorized" };
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
        error: error.data?.message || "Profile update error",
      };
    }
  };

  const updateProfileImage = async (imageFile: File) => {
    if (!accessToken.value) {
      return { success: false, error: "Unauthorized" };
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

      const imagePath = uploadResponse.shouldUrl || uploadResponse.filePath;

      if (!imagePath) {
        throw new Error("Failed to get image path");
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
        error: error.message || "Photo upload error",
      };
    }
  };

  const updateAbout = async (about: string) => {
    if (!accessToken.value) {
      return { success: false, error: "Unauthorized" };
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
        error: error.data?.message || "About update error",
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
          error.data?.message || "Password reset error. Check the username",
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
