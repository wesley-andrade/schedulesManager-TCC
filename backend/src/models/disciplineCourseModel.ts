import prisma from "./prisma";

const getAllAssociations = async () => {
  return await prisma.disciplineCourse.findMany();
};

const getAssociationsbyCourseId = async (id: number) => {
  return await prisma.disciplineCourse.findMany({
    where: { courseId: id },
  });
};

const getAssociationsByDisciplineId = async (id: number) => {
  return await prisma.disciplineCourse.findMany({
    where: { disciplineId: id },
  });
};

const createAssociation = async (disciplineId: number, courseId: number) => {
  return await prisma.disciplineCourse.create({
    data: { disciplineId, courseId },
  });
};

const deleteAssociation = async (id: number) => {
  await prisma.disciplineCourse.delete({
    where: { id },
  });
  return true;
};

export default {
  getAllAssociations,
  getAssociationsbyCourseId,
  getAssociationsByDisciplineId,
  deleteAssociation,
  createAssociation,
};
