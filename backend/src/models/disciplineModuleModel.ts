import { DiscplineModule } from "../types";
import { disciplineModule } from "../data/mockData";

const getAllDisciplinesModules = (): DiscplineModule[] => {
  return disciplineModule;
};

const getDisciplineModuleById = (id: number): DiscplineModule | undefined => {
  return disciplineModule.find((dm) => dm.id === id);
};

const createDisciplineModule = (
  disciplineId: number,
  moduleId: number,
  academicPeriodId: number
): DiscplineModule => {
  const newDisciplineModule: DiscplineModule = {
    id: Math.floor(Math.random() * 9999),
    disciplineId,
    moduleId,
    academicPeriodId,
  };
  disciplineModule.push(newDisciplineModule);
  return newDisciplineModule;
};

const deleteDisciplineModule = (id: number): boolean => {
  const index = disciplineModule.findIndex((dm) => dm.id === id);
  if (index === -1) return false;

  disciplineModule.splice(index, 1);
  return true;
};

export default {
  getAllDisciplinesModules,
  getDisciplineModuleById,
  createDisciplineModule,
  deleteDisciplineModule,
};
