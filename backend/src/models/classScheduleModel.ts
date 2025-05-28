import prisma from "./prisma";

const getAllClassSchedules = async (teacherId?: number) => {
  return await prisma.classSchedule.findMany({
    where: teacherId
      ? {
          disciplineTeacher: {
            teacherId: teacherId,
          },
        }
      : undefined,
    include: {
      schedule: {
        include: {
          timeSlot: true,
        },
      },
      disciplineTeacher: {
        include: {
          teacher: {
            include: {
              user: true
            }
          },
          discipline: true,
        },
      },
      rooms: {
        include: {
          room: true,
        },
      },
    },
  });
};

const getClassScheduleById = async (id: number) => {
  return await prisma.classSchedule.findUnique({
    where: { id },
    include: {
      schedule: true,
      disciplineTeacher: true,
      rooms: true,
    },
  });
};

const createClassSchedule = async (
  scheduleId: number,
  disciplineTeacherId: number,
  date: string
) => {
  return await prisma.classSchedule.create({
    data: { scheduleId, disciplineTeacherId, date: new Date(date) },
  });
};

const updateClassSchedule = async (
  id: number,
  scheduleId: number,
  date: string
) => {
  const updated = await prisma.classSchedule.update({
    where: { id },
    data: {
      scheduleId: scheduleId,
      date: new Date(date),
      rooms: {
        updateMany: {
          where: { classScheduleId: id },
          data: { scheduleId: scheduleId, date: new Date(date) },
        },
      },
    },
  });

  return updated;
};

const deleteClassSchedule = async (id: number) => {
  await prisma.classScheduleRoom.deleteMany({ where: { classScheduleId: id } });
  await prisma.classSchedule.delete({ where: { id } });

  return true;
};

const getAllClassScheduleRooms = async () => {
  return await prisma.classScheduleRoom.findMany({
    include: {
      room: true,
      classSchedule: {
        include: {
          schedule: true,
          disciplineTeacher: {
            include: {
              teacher: true,
              discipline: true,
            },
          },
        },
      },
    },
  });
};

const createClassScheduleRoom = async (
  classScheduleId: number,
  roomId: number,
  scheduleId: number,
  date: string
) => {
  return await prisma.classScheduleRoom.create({
    data: { classScheduleId, roomId, scheduleId, date: new Date(date) },
  });
};

const clearAllClassSchedules = async () => {
  await prisma.classScheduleRoom.deleteMany();
  await prisma.classSchedule.deleteMany();
};

export default {
  getAllClassSchedules,
  getClassScheduleById,
  createClassSchedule,
  updateClassSchedule,
  deleteClassSchedule,
  getAllClassScheduleRooms,
  createClassScheduleRoom,
  clearAllClassSchedules,
};
