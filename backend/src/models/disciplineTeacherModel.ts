import prisma from "./prisma";

const getAllDisciplineTeachers = async () => {
  return await prisma.disciplineTeacher.findMany();
};

const createDisciplineTeacher = async (
  disciplineId: number,
  teacherId: number
) => {
  return await prisma.disciplineTeacher.create({
    data: { disciplineId, teacherId },
  });
};

const deleteDisciplineTeacher = async (id: number) => {
  await prisma.disciplineTeacher.delete({ where: { id } });
  return true;
};

export default {
  getAllDisciplineTeachers,
  createDisciplineTeacher,
  deleteDisciplineTeacher,
};
