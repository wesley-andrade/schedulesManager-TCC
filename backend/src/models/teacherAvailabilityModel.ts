import prisma from "./prisma";

const getAllTeacherAvailability = async () => {
  return await prisma.teacherAvailability.findMany();
};

const getTeacherAvailabilityById = async (id: number) => {
  return await prisma.teacherAvailability.findUnique({ where: { id } });
};

const createTeacherAvailability = async (
  teacherId: number,
  scheduleId: number,
  status: boolean
) => {
  return await prisma.teacherAvailability.create({
    data: { teacherId, scheduleId, status },
  });
};

const updateTeacherAvailability = async (
  id: number,
  updates: Partial<{ teacherId: number; scheduleId: number; status: boolean }>
) => {
  return prisma.teacherAvailability.update({ where: { id }, data: updates });
};

const deleteTeacherAvailability = async (id: number) => {
  await prisma.teacherAvailability.delete({ where: { id } });
  return true;
};

export default {
  getAllTeacherAvailability,
  getTeacherAvailabilityById,
  createTeacherAvailability,
  updateTeacherAvailability,
  deleteTeacherAvailability,
};
