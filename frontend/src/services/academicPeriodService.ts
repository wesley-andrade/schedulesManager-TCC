import { api } from "./api";

export interface AcademicPeriod {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
}

export const academicPeriodService = {
  async getAllAcademicPeriods(): Promise<AcademicPeriod[]> {
    const { data } = await api.get<AcademicPeriod[]>("/academic-periods");
    return data;
  },

  async createPeriod(
    periodData: Omit<AcademicPeriod, "id">,
  ): Promise<AcademicPeriod> {
    const { data } = await api.post<AcademicPeriod>(
      "/academic-periods",
      periodData,
    );
    return data;
  },

  async updatePeriod(
    id: number,
    periodData: Partial<AcademicPeriod>,
  ): Promise<AcademicPeriod> {
    const { data } = await api.put<AcademicPeriod>(
      `/academic-periods/${id}`,
      periodData,
    );
    return data;
  },

  async deletePeriod(id: number): Promise<void> {
    await api.delete(`/academic-periods/${id}`);
  },
};
