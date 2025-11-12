interface Student {
  id: number;
  fullName: string;
  image: string | null;
  email: string;
  university?: {
    id: number;
    name: string;
  } | null;
  faculty?: {
    id: number;
    name: string;
  } | null;
  dateOfBirth?: string | null;
  gender?: string | null;
  country?: {
    id: number;
    name: string;
  } | null;
  timezone?: string | null;
  phone?: string | null;
}

interface PaginatedResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

interface AssignmentPayload {
  studentId: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
}

interface Assignment {
  id: number;
  title: string;
  description: string;
  status: "ASSIGNED" | "COMPLETED" | "PENDING";
  startDate: string;
  endDate: string;
}

interface AssignmentDetail {
  id: number;
  title: string;
  description: string;
  status: "ASSIGNED" | "PENDING_REVIEW" | "GRADED";
  startDate: string;
  endDate: string;
  grade?: {
    id: number;
    grade: number;
    createdAt: string;
  } | null;
  submission?: {
    id: number;
    submissionUrl: string;
    createdAt: string;
  } | null;
}

interface AssignmentsResponse {
  content: Assignment[];
  totalPages: number;
  totalElements: number;
  first: boolean;
  last: boolean;
  size: number;
  number: number;
  numberOfElements: number;
  empty: boolean;
}

export const useStudents = () => {
  const API_BASE = "https://api.ivybek.com";

  const fetchStudents = async (search?: string): Promise<Student[]> => {
    try {
      const token = useCookie("access_token");

      let url = `${API_BASE}/api/v1/mentor/students`;

      if (search && search.trim() !== "") {
        url += `?search=${encodeURIComponent(search.trim())}`;
      }

      const data = await $fetch<PaginatedResponse<Student>>(url, {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });

      const students = data?.content || [];

      return students;
    } catch (error) {
      console.error("Failed to fetch students:", error);
      return [];
    }
  };

  const fetchStudentById = async (id: number) => {
    try {
      const token = useCookie("access_token");

      const data = await $fetch(`${API_BASE}/api/v1/mentor/students/${id}`, {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });

      return data;
    } catch (error) {
      console.error("Failed to fetch student:", error);
      return null;
    }
  };

  const assignTask = async (payload: AssignmentPayload) => {
    try {
      const token = useCookie("access_token");

      const data = await $fetch(`${API_BASE}/api/v1/mentor/assignments`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token.value}`,
          "Content-Type": "application/json",
        },
        body: payload,
      });

      return data;
    } catch (error) {
      console.error("Failed to assign task:", error);
      throw error;
    }
  };

  const fetchStudentAssignments = async (
    studentId: number
  ): Promise<Assignment[]> => {
    try {
      const token = useCookie("access_token");

      const data = await $fetch<AssignmentsResponse>(
        `${API_BASE}/api/v1/mentor/students/${studentId}/assignments`,
        {
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
        }
      );

      return data?.content || [];
    } catch (error) {
      console.error("Failed to fetch student assignments:", error);
      return [];
    }
  };

  const fetchAssignmentById = async (
    assignmentId: number
  ): Promise<AssignmentDetail | null> => {
    try {
      const token = useCookie("access_token");

      const data = await $fetch<AssignmentDetail>(
        `${API_BASE}/api/v1/mentor/assignments/${assignmentId}`,
        {
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
        }
      );

      return data;
    } catch (error) {
      console.error("Failed to fetch assignment:", error);
      return null;
    }
  };

  const gradeAssignment = async (assignmentId: number, grade: number) => {
    try {
      const token = useCookie("access_token");

      const data = await $fetch(
        `${API_BASE}/api/v1/mentor/assignments/${assignmentId}/grade`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token.value}`,
            "Content-Type": "application/json",
          },
          body: {
            grade: grade,
          },
        }
      );

      return data;
    } catch (error) {
      console.error("Failed to grade assignment:", error);
      throw error;
    }
  };

  return {
    fetchStudents,
    fetchStudentById,
    assignTask,
    fetchStudentAssignments,
    fetchAssignmentById,
    gradeAssignment,
  };
};
