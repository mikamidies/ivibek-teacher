interface University {
  id: number;
  name: string;
}

interface Faculty {
  id: number;
  name: string;
}

interface SidebarInfo {
  id: number;
  fullName: string;
  email: string;
  image: string;
  university: University;
  faculty: Faculty;
}

interface SidebarData {
  info: SidebarInfo;
  activeSessionsCount: number;
  sentEssaysCount: number;
}

export const useSidebar = () => {
  const API_BASE = "https://api.ivybek.com";
  const { accessToken } = useAuth();

  const fetchSidebarData = async (): Promise<SidebarData | null> => {
    try {
      const data = await $fetch<SidebarData>(
        `${API_BASE}/api/v1/mentor/sidebar`,
        {
          headers: {
            Authorization: `Bearer ${accessToken.value}`,
          },
        }
      );

      return data;
    } catch (error: any) {
      console.error("Failed to fetch sidebar data:", error);
      return null;
    }
  };

  return {
    fetchSidebarData,
  };
};
