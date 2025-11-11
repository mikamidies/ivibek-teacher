interface EssayOrder {
  id: number;
  mentorId: number;
  deadlineId: number;
  essayType: "PERSONAL" | "SUPPLEMENTAL";
  wordLimitId: number;
  title: string;
  body: string;
  price?: number;
  status?: string;
  createdAt?: string;
}

interface SendFeedbackPayload {
  feedback: string;
}

export const useEssay = () => {
  const { accessToken } = useAuth();
  const API_BASE = "https://api.ivybek.com";

  const fetchEssays = async (page = 0, size = 10) => {
    if (!accessToken.value) {
      return { success: false, error: "Unauthorized" };
    }

    try {
      const data = await $fetch(`${API_BASE}/api/v1/mentor/essay-orders`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken.value}`,
        },
        params: {
          page,
          size,
        },
      });

      return { success: true, data };
    } catch (error: any) {
      return {
        success: false,
        error: error.data?.message || "Error loading essays",
      };
    }
  };

  const fetchEssayById = async (id: number) => {
    if (!accessToken.value) {
      return { success: false, error: "Unauthorized" };
    }
    try {
      const data = await $fetch(
        `${API_BASE}/api/v1/mentor/essay-orders/${id}/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken.value}`,
          },
        }
      );
      return { success: true, data };
    } catch (error: any) {
      return {
        success: false,
        error: error.data?.message || "Error fetching essay",
      };
    }
  };

  const sendFeedback = async (id: number, payload: SendFeedbackPayload) => {
    if (!accessToken.value) {
      return { success: false, error: "Unauthorized" };
    }

    try {
      const data = await $fetch(
        `${API_BASE}/api/v1/mentor/essay-orders/${id}/send-feedback`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken.value}`,
            "Content-Type": "application/json",
          },
          body: payload,
        }
      );

      return { success: true, data };
    } catch (error: any) {
      return {
        success: false,
        error: error.data?.message || "Error sending feedback",
      };
    }
  };

  return {
    fetchEssays,
    fetchEssayById,
    sendFeedback,
  };
};
