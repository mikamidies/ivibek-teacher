interface ChoiceItem {
  id: number;
  name: string;
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

export const useCommon = () => {
  const API_BASE = "https://api.ivybek.com";

  const fetchCountries = async (): Promise<ChoiceItem[]> => {
    try {
      const data = await $fetch<PaginatedResponse<ChoiceItem>>(
        `${API_BASE}/api/v1/common/country/choice-list?search=`
      );

      const countries = data?.content || [];

      return countries;
    } catch (error) {
      console.error("Failed to fetch countries:", error);
      return [];
    }
  };

  const fetchUniversities = async (): Promise<ChoiceItem[]> => {
    try {
      const data = await $fetch<PaginatedResponse<ChoiceItem>>(
        `${API_BASE}/api/v1/common/university/choice-list?search=`
      );

      const universities = data?.content || [];

      return universities;
    } catch (error) {
      console.error("Failed to fetch universities:", error);
      return [];
    }
  };

  const fetchFaculties = async (): Promise<ChoiceItem[]> => {
    try {
      const data = await $fetch<PaginatedResponse<ChoiceItem>>(
        `${API_BASE}/api/v1/common/faculty/choice-list?search=`
      );

      const faculties = data?.content || [];

      return faculties;
    } catch (error) {
      console.error("Failed to fetch faculties:", error);
      return [];
    }
  };

  return {
    fetchCountries,
    fetchUniversities,
    fetchFaculties,
  };
};
