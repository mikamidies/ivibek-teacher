interface Student {
  id: number;
  fullName: string;
  image: string;
  email: string;
}

interface Meeting {
  id: number;
  student: Student;
  timeFrom: string;
  timeTo: string;
  description: string;
  meetingLink: string | null;
}

interface MeetingsByDateResponse {
  date: string;
  meetings: Meeting[];
}

interface UpcomingMeeting {
  id: number;
  meetingWith: {
    id: number;
    fullName: string;
    email: string;
    image: string;
  };
  timeFrom: string;
  timeTo: string;
  description: string;
}

interface UpcomingMeetingsByDate {
  date: string;
  meetings: UpcomingMeeting[];
}

interface UpcomingMeetingsResponse {
  meetings: UpcomingMeetingsByDate[];
}

export const useMeetings = () => {
  const API_BASE = "https://api.ivybek.com";
  const { accessToken } = useAuth();

  const fetchMeetingsByDate = async (
    date: string
  ): Promise<MeetingsByDateResponse | null> => {
    try {
      const data = await $fetch<MeetingsByDateResponse>(
        `${API_BASE}/api/v1/mentor/meetings/by-date`,
        {
          headers: {
            Authorization: `Bearer ${accessToken.value}`,
          },
          params: {
            date,
          },
        }
      );

      return data;
    } catch (error: any) {
      console.error("Failed to fetch meetings by date:", error);
      return null;
    }
  };

  const assignMeetingLink = async (
    meetingId: number,
    meetingLink: string
  ): Promise<boolean> => {
    try {
      await $fetch(
        `${API_BASE}/api/v1/mentor/meetings/${meetingId}/assignLink`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken.value}`,
            "Content-Type": "application/json",
          },
          body: {
            link: meetingLink,
          },
        }
      );

      return true;
    } catch (error: any) {
      console.error("Failed to assign meeting link:", error);
      throw new Error(error.data?.message || "Failed to assign meeting link");
    }
  };

  const fetchUpcomingMeetings =
    async (): Promise<UpcomingMeetingsResponse | null> => {
      try {
        const data = await $fetch<UpcomingMeetingsResponse>(
          `${API_BASE}/api/v1/mentor/meetings/upcoming`,
          {
            headers: {
              Authorization: `Bearer ${accessToken.value}`,
            },
          }
        );

        return data;
      } catch (error: any) {
        console.error("Failed to fetch upcoming meetings:", error);
        return null;
      }
    };

  return {
    fetchMeetingsByDate,
    assignMeetingLink,
    fetchUpcomingMeetings,
  };
};

export type {
  Meeting,
  Student,
  MeetingsByDateResponse,
  UpcomingMeeting,
  UpcomingMeetingsByDate,
  UpcomingMeetingsResponse,
};
