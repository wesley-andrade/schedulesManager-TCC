import prisma from "./prisma";

const getAllSchedules = async () => {
  return await prisma.schedule.findMany({
    include: { timeSlot: true },
  });
};

const getScheduleById = async (id: number) => {
  return await prisma.schedule.findUnique({ where: { id } });
};

const findScheduleByDayAndTimeSlot = async (
  dayOfWeek: string,
  timeSlotId: number
) => {
  return await prisma.schedule.findFirst({
    where: {
      dayOfWeek,
      timeSlotId,
    },
  });
};

const createSchedule = async (dayOfWeek: string, timeSlotId: number) => {
  const existingSchedule = await findScheduleByDayAndTimeSlot(
    dayOfWeek,
    timeSlotId
  );

  if (existingSchedule) {
    throw new Error("Já existe um horário cadastrado para este dia e período");
  }

  return await prisma.schedule.create({ data: { dayOfWeek, timeSlotId } });
};

const updateSchedule = async (
  id: number,
  updates: Partial<{ dayOfWeek: string; timeSlotId: number }>
) => {
  return await prisma.schedule.update({ where: { id }, data: updates });
};

const deleteSchedule = async (id: number) => {
  const schedule = await prisma.schedule.findUnique({
    where: { id },
    include: {
      availabilities: true,
      classScheduleRooms: true,
      ClassSchedule: true,
    },
  });

  if (!schedule) {
    throw new Error("Horário não encontrado");
  }

  if (
    schedule.availabilities.length > 0 ||
    schedule.classScheduleRooms.length > 0 ||
    schedule.ClassSchedule.length > 0
  ) {
    throw new Error(
      "Não é possível excluir este horário pois ele possui registros vinculados no sistema"
    );
  }

  await prisma.schedule.delete({
    where: { id },
  });

  return true;
};

export default {
  getAllSchedules,
  getScheduleById,
  createSchedule,
  updateSchedule,
  deleteSchedule,
};
