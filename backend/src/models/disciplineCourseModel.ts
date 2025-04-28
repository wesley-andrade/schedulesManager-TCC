import { DisciplineCourse } from "../types";
import { disciplineCourse } from "../data/mockData";

const getAllAssociations = (): DisciplineCourse[] => {
  return disciplineCourse;
};

const getAssociationsbyCourseId = (courseId: number): DisciplineCourse[] => {
  return disciplineCourse.filter((dc) => dc.courseId === courseId);
};

const getAssociationsByDisciplineId = (
  disciplineId: number
): DisciplineCourse[] => {
  return disciplineCourse.filter((dc) => dc.disciplineId === disciplineId);
};

const createAssociation = (
  disciplineId: number,
  courseId: number
): DisciplineCourse => {
  const newAssociation: DisciplineCourse = {
    id: Math.floor(Math.random() * 9999),
    disciplineId,
    courseId,
  };
  disciplineCourse.push(newAssociation);

  return newAssociation;
};

const deleteAssociation = (associationId: number) => {
  const index = disciplineCourse.findIndex((dc) => {
    dc.id === associationId;
  });
  if (index === -1) return false;

  disciplineCourse.splice(index, 1);
  return true;
};

export default {
  getAllAssociations,
  getAssociationsbyCourseId,
  getAssociationsByDisciplineId,
  deleteAssociation,
  createAssociation,
};
