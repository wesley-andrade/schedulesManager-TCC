import prisma from "../models/prisma";
import holidayService from "./holidayService";
import {
  parseISO,
  isBefore,
  addDays,
  isSameDay,
  format,
  differenceInCalendarDays,
} from "date-fns";
import { TimeSlot } from "../types";

async function generateSchedules(academicPeriodId: number) {
  const academicPeriod = await prisma.academicPeriod.findUnique({
    where: { id: academicPeriodId },
  });
  if (!academicPeriod) {
    throw new Error("Período letivo não encontrado");
  }

  const startDate = parseISO(academicPeriod.startDate.toISOString());
  const endDate = parseISO(academicPeriod.endDate.toISOString());
  const holidays = await holidayService.getHolidays(startDate, endDate);

  const disciplineModules = await prisma.disciplineModule.findMany({
    where: { academicPeriodId },
    select: { disciplineId: true },
  });
  const disciplineIds = disciplineModules.map((dm) => dm.disciplineId);

  const disciplineTeachers = await prisma.disciplineTeacher.findMany({
    where: { disciplineId: { in: disciplineIds } },
    include: { teacher: true, discipline: true },
  });

  const disciplineTeacherIds = disciplineTeachers.map((dt) => dt.id);

  await prisma.classScheduleRoom.deleteMany({
    where: {
      classSchedule: { disciplineTeacherId: { in: disciplineTeacherIds } },
    },
  });

  await prisma.classSchedule.deleteMany({
    where: { disciplineTeacherId: { in: disciplineTeacherIds } },
  });

  for (const dt of disciplineTeachers) {
    const discipline = dt.discipline;

    const dm = await prisma.disciplineModule.findFirst({
      where: { disciplineId: dt.disciplineId, academicPeriodId },
    });
    if (!dm) continue;

    const mod = await prisma.module.findUnique({ where: { id: dm.moduleId } });
    if (!mod) continue;

    let remainingHours = discipline.totalHours;
    let currentDate = new Date(startDate);
    currentDate.setHours(0, 0, 0, 0);
    let lastScheduledDate: Date | null = null;

    while (isBefore(currentDate, endDate) && remainingHours > 0) {
      const isHoliday = holidays.find((h) =>
        isSameDay(parseISO(h.date), currentDate)
      );
      if (isHoliday) {
        currentDate = addDays(currentDate, 1);
        continue;
      }

      const dayOfWeek = capitalize(
        currentDate.toLocaleDateString("pt-BR", { weekday: "long" })
      );

      const availableAvailabilities = await prisma.teacherAvailability.findMany(
        {
          where: {
            teacherId: dt.teacherId,
            status: true,
            schedule: { dayOfWeek },
          },
          include: {
            schedule: { include: { timeSlot: true } },
          },
          orderBy: {
            schedule: { timeSlot: { startTime: "asc" } },
          },
        }
      );

      for (const availability of availableAvailabilities) {
        const schedule = availability.schedule;
        if (!schedule) continue;

        const timeSlot = await prisma.timeSlot.findUnique({
          where: { id: schedule.timeSlotId },
        });
        const duration = timeSlot ? calculateDuration(timeSlot) : 1;

        if (
          lastScheduledDate &&
          differenceInCalendarDays(currentDate, lastScheduledDate) <= 1
        ) {
          continue;
        }

        const fullDateTime = parseISO(
          `${format(currentDate, "yyyy-MM-dd")}T${timeSlot!.startTime}:00`
        );

        const teacherConflict = await prisma.classSchedule.findFirst({
          where: {
            date: fullDateTime,
            scheduleId: schedule.id,
            disciplineTeacherId: dt.id,
          },
        });
        if (teacherConflict) continue;

        const room = await prisma.room.findFirst({
          where: {
            type: discipline.requiredRoomType,
            seatsAmount: { gte: mod.totalStudents },
            usages: {
              none: {
                date: fullDateTime,
                scheduleId: schedule.id,
              },
            },
          },
        });
        if (!room) continue;

        const newSchedule = await prisma.classSchedule.create({
          data: {
            scheduleId: schedule.id,
            disciplineTeacherId: dt.id,
            date: fullDateTime,
          },
        });

        await prisma.classScheduleRoom.create({
          data: {
            classScheduleId: newSchedule.id,
            roomId: room.id,
            scheduleId: schedule.id,
            date: fullDateTime,
          },
        });

        lastScheduledDate = new Date(currentDate);
        remainingHours -= duration;
      }

      currentDate = addDays(currentDate, 1);
    }
  }

  return { message: "Aulas geradas com sucesso!" };
}

async function updateClassSchedule(
  id: number,
  data: { scheduleId: number; date: string }
) {
  const { scheduleId, date } = data;
  const dateObj = parseISO(date);

  const classSchedule = await prisma.classSchedule.findUnique({
    where: { id },
    include: {
      disciplineTeacher: {
        include: {
          teacher: true,
          discipline: true,
        },
      },
    },
  });

  if (!classSchedule) {
    throw new Error("Aula não encontrada");
  }

  const discipline = classSchedule.disciplineTeacher.discipline;
  const teacherId = classSchedule.disciplineTeacher.teacherId;

  const holiday = await holidayService.getHolidays(dateObj, dateObj);
  if (holiday.length > 0) {
    throw new Error("Data em feriado");
  }

  const disciplineModule = await prisma.disciplineModule.findFirst({
    where: { disciplineId: discipline.id },
  });

  const module = disciplineModule
    ? await prisma.module.findUnique({
        where: { id: disciplineModule.moduleId },
      })
    : null;

  const conflict = await prisma.classSchedule.findFirst({
    where: {
      id: { not: id },
      scheduleId,
      date: dateObj,
      disciplineTeacher: { teacherId },
    },
  });

  if (conflict) {
    throw new Error("Conflito de horário com outro agendamento do professor");
  }

  const availableRoom = await prisma.room.findFirst({
    where: {
      type: discipline.requiredRoomType,
      seatsAmount: {
        gte: module?.totalStudents ?? 0,
      },
      usages: {
        none: {
          date: dateObj,
          scheduleId,
        },
      },
    },
  });

  if (!availableRoom) {
    throw new Error("Nenhuma sala disponível compatível");
  }

  const updatedSchedule = await prisma.classSchedule.update({
    where: { id },
    data: { scheduleId, date: dateObj },
  });

  const existingRoom = await prisma.classScheduleRoom.findFirst({
    where: { classScheduleId: id },
  });

  if (existingRoom) {
    await prisma.classScheduleRoom.update({
      where: { id: existingRoom.id },
      data: {
        roomId: availableRoom.id,
        scheduleId,
        date: dateObj,
      },
    });
  } else {
    await prisma.classScheduleRoom.create({
      data: {
        classScheduleId: id,
        roomId: availableRoom.id,
        scheduleId,
        date: dateObj,
      },
    });
  }

  return updatedSchedule;
}

function calculateDuration(timeSlot: TimeSlot): number {
  const [startH, startM] = timeSlot.startTime.split(":").map(Number);
  const [endH, endM] = timeSlot.endTime.split(":").map(Number);
  return endH - startH + (endM - startM) / 60;
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export default {
  generateSchedules,
  updateClassSchedule,
};
