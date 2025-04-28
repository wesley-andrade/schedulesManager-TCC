import { Discipline } from "../types";
import { disciplines } from "../data/mockData";

const getAllDisciplines = (): Discipline[] => {
  return disciplines;
};

const getDisciplinebyId = (id: number): Discipline[] | undefined => {
  if (!id) return undefined;
  const discipline = disciplines.filter((dc) => {
    dc.id === id;
  });

  return discipline;
};

const create = (name: string, totalHours: number) => {
  const newDiscipline: Discipline = {
    id: Math.floor(Math.random() * 9999),
    name,
    totalHours,
  };

  if (!newDiscipline) {
    return undefined;
  }

  disciplines.push(newDiscipline);
  return newDiscipline;
};

const update = (
  id: number,
  updates: Partial<Omit<Discipline, "id">>
): Discipline | undefined => {
  const index = disciplines.findIndex((d) => d.id === id);
  if (index === -1) return undefined;

  disciplines[index] = { ...disciplines[index], ...updates };
  return disciplines[index];
};

const deleteDiscipline = (id: number): boolean => {
  const index = disciplines.findIndex((d) => d.id === id);
  if (index === -1) return false;
  disciplines.splice(index, 1);
  return true;
};

export default {
  getAllDisciplines,
  getDisciplinebyId,
  create,
  update,
  delete: deleteDiscipline,
};
