import prisma from "./prisma";

const getAllTimeSlots = async () => {
  return await prisma.timeSlot.findMany();
};

const getTimeSlotById = async (id: number) => {
  return await prisma.timeSlot.findUnique({ where: { id } });
};

const findTimeSlotByTimes = async (startTime: string, endTime: string) => {
  return await prisma.timeSlot.findFirst({
    where: {
      startTime,
      endTime,
    },
  });
};

const createTimeSlot = async (startTime: string, endTime: string) => {
  const existingTimeSlot = await findTimeSlotByTimes(startTime, endTime);

  if (existingTimeSlot) {
    return existingTimeSlot;
  }

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
  findTimeSlotByTimes,
};
