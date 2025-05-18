import prisma from "./prisma";

const getAllTeachers = async () => {
  return await prisma.teacher.findMany();
};

const getTeacherById = async (id: number) => {
  return await prisma.teacher.findUnique({ where: { id } });
};

const createTeacher = async (userId: number, phone: string | null) => {
  return prisma.teacher.create({ data: { userId, phone } });
};

const updateTeacher = async (
  id: number,
  updates: Partial<{ phone: string }>
) => {
  return prisma.teacher.update({ where: { id }, data: updates });
};

const deleteTeacher = async (id: number) => {
  await prisma.teacher.delete({ where: { id } });
  return true;
};

export default {
  getAllTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
};
