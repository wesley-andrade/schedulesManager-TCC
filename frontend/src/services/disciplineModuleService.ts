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
    try {
      const response = await api.get("/discipline-modules");
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Sessão expirada. Por favor, faça login novamente.");
      }

      throw new Error(
        error.response?.data?.message ||
          `Erro ao buscar disciplinas da turma (${
            error.response?.status || "sem status"
          }): ${error.message}`
      );
    }
  },

  async createDisciplineModule(
    disciplineId: number,
    moduleId: number,
    academicPeriodId: number
  ): Promise<DisciplineModule> {
    try {
      const response = await api.post("/discipline-modules", {
        disciplineId,
        moduleId,
        academicPeriodId,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Erro ao associar disciplina à turma"
      );
    }
  },

  async deleteDisciplineModule(id: number): Promise<void> {
    try {
      await api.delete(`/discipline-modules/${id}`);
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Erro ao remover disciplina da turma"
      );
    }
  },
}; 