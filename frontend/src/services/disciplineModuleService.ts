import { api } from "./api";
import { Discipline } from "./disciplineService";
import { AcademicPeriod } from "./academicPeriodService";
import { Module } from "./moduleService";

export interface DisciplineModule {
  id: number;
  disciplineId: number;
  moduleId: number;
  academicPeriodId: number;
  discipline?: Discipline;
  module?: Module;
  academicPeriod?: AcademicPeriod;
}

export const disciplineModuleService = {
  async getAllDisciplineModules(): Promise<DisciplineModule[]> {
    const { data } = await api.get<DisciplineModule[]>("/discipline-modules");
    return data;
  },

  async createDisciplineModule(
    disciplineId: number,
    moduleId: number,
    academicPeriodId: number,
  ): Promise<DisciplineModule> {
    const { data } = await api.post<DisciplineModule>(
      "/discipline-modules",
      { disciplineId, moduleId, academicPeriodId },
    );
    return data;
  },

  async deleteDisciplineModule(id: number): Promise<void> {
    await api.delete(`/discipline-modules/${id}`);
  },
};
