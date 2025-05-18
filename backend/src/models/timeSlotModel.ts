import prisma from "./prisma";

const getAllTimeSlots = async () => {
  return await prisma.timeSlot.findMany();
};

const getTimeSlotById = async (id: number) => {
  return await prisma.timeSlot.findUnique({ where: { id } });
};

const createTimeSlot = async (startTime: string, endTime: string) => {
  return await prisma.timeSlot.create({ data: { startTime, endTime } });
};

const updateTimeSlot = async (
  id: number,
  updates: Partial<{ startTime: string; endTime: string }>
) => {
  return await prisma.timeSlot.update({ where: { id }, data: updates });
};

const deleteTimeSlot = async (id: number) => {
  await prisma.timeSlot.delete({ where: { id } });
  return true;
};

export default {
  getAllTimeSlots,
  getTimeSlotById,
  createTimeSlot,
  updateTimeSlot,
  deleteTimeSlot,
};
