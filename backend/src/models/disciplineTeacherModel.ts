import { disciplineTeacher } from "../data/mockData";
import { DisciplineTeacher } from "../types";

const getAllDisciplineTeachers = (): DisciplineTeacher[] => {
  return disciplineTeacher;
};

const createDisciplineTeacher = (
  disciplineId: number,
  teacherId: number
): DisciplineTeacher => {
  const newDisciplineTeacher: DisciplineTeacher = {
    id: Math.floor(Math.random() * 9999),
    disciplineId,
    teacherId,
  };

  disciplineTeacher.push(newDisciplineTeacher);
  return newDisciplineTeacher;
};

const deleteDisciplineTeacher = (id: number): boolean => {
  const index = disciplineTeacher.findIndex(
    (disciplineTeacher) => disciplineTeacher.id === id
  );
  if (index === -1) return false;

  disciplineTeacher.splice(index, 1);
  return true;
};

export default {
  getAllDisciplineTeachers,
  createDisciplineTeacher,
  deleteDisciplineTeacher,
};
