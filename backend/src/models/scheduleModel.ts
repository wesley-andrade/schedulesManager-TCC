import prisma from "./prisma";

const getAllSchedules = async () => {
  return await prisma.schedule.findMany({
    include: { timeSlot: true }
  });
};

const getScheduleById = async (id: number) => {
  return await prisma.schedule.findUnique({ where: { id } });
};

const createSchedule = async (dayOfWeek: string, timeSlotId: number) => {
  return await prisma.schedule.create({ data: { dayOfWeek, timeSlotId } });
};

const updateSchedule = async (
  id: number,
  updates: Partial<{ dayOfWeek: string; timeSlotId: number }>
) => {
  return await prisma.schedule.update({ where: { id }, data: updates });
};

const deleteSchedule = async (id: number) => {
  await prisma.schedule.delete({ where: { id } });
  return true;
};

export default {
  getAllSchedules,
  getScheduleById,
  createSchedule,
  updateSchedule,
  deleteSchedule,
};
