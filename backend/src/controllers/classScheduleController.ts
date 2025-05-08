import { Request, Response } from "express";
import classScheduleModel from "../models/classScheduleModel";
import {
  disciplineTeacher,
  disciplines,
  teacherAvailability,
  availabilityExceptions,
  schedules,
  academicPeriods,
  rooms,
  classSchedules,
  disciplineModule,
  modules,
  timeSlots,
  classScheduleRooms,
} from "../data/mockData";

import {
  addDays,
  isBefore,
  isSameDay,
  parseISO,
  differenceInCalendarDays,
  startOfDay,
} from "date-fns";
import { TimeSlot } from "../types";

const index = (req: Request, res: Response) => {
  const result = classScheduleModel.getAllClassSchedules();
  res.json(result);
};

const generateSchedules = (req: Request, res: Response) => {
  try {
    const academicPeriodId = parseInt(req.query.academicPeriodId as string);

    const academicPeriod = academicPeriods.find(
      (ap) => ap.id === academicPeriodId
    );
    if (!academicPeriod) {
      res.status(400).json({ error: "Período letivo não encontrado" });
      return;
    }

    classScheduleModel.clearAllClassSchedules();

    const startDate = parseISO(academicPeriod.startDate);
    const endDate = parseISO(academicPeriod.endDate);

    for (const dt of disciplineTeacher) {
      const discipline = disciplines.find((d) => d.id === dt.disciplineId);
      if (!discipline) continue;

      const dm = disciplineModule.find(
        (dm) =>
          dm.disciplineId === dt.disciplineId &&
          dm.academicPeriodId === academicPeriodId
      );
      if (!dm) continue;

      const mod = modules.find((m) => m.id === dm.moduleId);
      if (!mod) continue;

      let remainingHours = discipline.totalHours;
      let currentDate = new Date(startDate);
      let lastScheduledDate: Date | null = null;

      while (isBefore(currentDate, endDate) && remainingHours > 0) {
        const dayOfWeek = capitalize(
          currentDate.toLocaleDateString("pt-BR", { weekday: "long" })
        );

        const availableSlots = teacherAvailability
          .filter((ta) => ta.teacherId === dt.teacherId && ta.status)
          .map((ta) => ({
            ...ta,
            schedule: schedules.find((s) => s.id === ta.scheduleId),
          }))
          .filter((item) => item.schedule?.dayOfWeek === dayOfWeek);

        for (const { id: availabilityId, schedule } of availableSlots) {
          if (remainingHours <= 0 || !schedule) continue;

          const timeSlot = timeSlots.find(
            (ts) => ts.id === schedule.timeSlotId
          );
          const duration = timeSlot ? calculateDuration(timeSlot) : 1;

          const isException = availabilityExceptions.some(
            (e) =>
              e.teacherAvailabilityId === availabilityId &&
              isSameDay(
                startOfDay(parseISO(e.exceptionDate)),
                startOfDay(currentDate)
              )
          );
          if (isException) continue;

          if (
            lastScheduledDate &&
            differenceInCalendarDays(currentDate, lastScheduledDate) <= 1
          ) {
            continue;
          }

          const teacherAlreadyScheduled = classSchedules.some(
            (cs) =>
              isSameDay(parseISO(cs.date), currentDate) &&
              cs.scheduleId === schedule.id &&
              cs.disciplineTeacherId !== dt.id &&
              disciplineTeacher.some(
                (dt2) =>
                  dt2.id === cs.disciplineTeacherId &&
                  dt2.teacherId === dt.teacherId
              )
          );
          if (teacherAlreadyScheduled) continue;

          const requiredType = discipline.requiredRoomType;
          const availableRoom = rooms.find(
            (room) =>
              room.type === requiredType &&
              room.seatsAmount >= mod.totalStudents &&
              !classScheduleRooms.some(
                (csr) =>
                  isSameDay(parseISO(csr.date), currentDate) &&
                  csr.scheduleId === schedule.id &&
                  csr.roomId === room.id
              )
          );
          if (!availableRoom) continue;

          const dateString = currentDate.toISOString().split("T")[0];
          const fullDateTime = new Date(
            `${dateString}T${timeSlot!.startTime}:00`
          );

          const newClassSchedule = classScheduleModel.createClassSchedule(
            schedule.id,
            dt.id,
            fullDateTime.toISOString()
          );

          classScheduleModel.createClassScheduleRoom(
            newClassSchedule.id,
            availableRoom.id,
            schedule.id,
            fullDateTime.toISOString()
          );

          lastScheduledDate = new Date(currentDate);
          remainingHours -= duration;
        }

        currentDate = addDays(currentDate, 1);
      }
    }

    res.status(201).json(classScheduleModel.getAllClassSchedules());
  } catch (error) {
    console.error("Erro ao gerar horários:", error);
    res.status(500).json({ error: "Erro ao gerar horários automaticamente" });
  }
};

const update = (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { scheduleId, date } = req.body;

    const classSchedule = classScheduleModel.getClassScheduleById(id);
    if (!classSchedule) {
      res.status(404).json({ error: "Aula não encontrada" });
      return;
    }

    const dt = disciplineTeacher.find(
      (dt) => dt.id === classSchedule.disciplineTeacherId
    );
    if (!dt) {
      res.status(404).json({ error: "Disciplina do professor não encontrada" });
      return;
    }

    const discipline = disciplines.find((d) => d.id === dt.disciplineId);
    if (!discipline) {
      res.status(404).json({ error: "Disciplina não encontrada" });
      return;
    }

    const schedule = schedules.find((s) => s.id === scheduleId);
    if (!schedule) {
      res.status(400).json({ error: "Horário inválido" });
      return;
    }

    const dateObj = parseISO(date);
    const modInfo = disciplineModule.find(
      (dm) => dm.disciplineId === discipline.id
    );
    const module = modules.find((m) => m.id === modInfo?.moduleId);

    const conflict = classSchedules.some(
      (cs) =>
        cs.id !== id &&
        cs.scheduleId === scheduleId &&
        isSameDay(parseISO(cs.date), dateObj) &&
        disciplineTeacher.find(
          (dt2) =>
            dt2.id === cs.disciplineTeacherId && dt2.teacherId === dt.teacherId
        )
    );
    if (conflict) {
      res.status(400).json({
        error: "Conflito de horário com outro agendamento do professor",
      });
      return;
    }

    const availableRoom = rooms.find(
      (room) =>
        room.type === discipline.requiredRoomType &&
        room.seatsAmount >= (module?.totalStudents ?? 0) &&
        !classScheduleRooms.some(
          (csr) =>
            csr.scheduleId === scheduleId &&
            isSameDay(parseISO(csr.date), dateObj) &&
            csr.roomId === room.id
        )
    );
    if (!availableRoom) {
      res.status(400).json({ error: "Nenhuma sala disponível compatível" });
      return;
    }

    const updated = classScheduleModel.updateClassSchedule(
      id,
      scheduleId,
      date
    );
    classScheduleModel.createClassScheduleRoom(
      id,
      availableRoom.id,
      scheduleId,
      date
    );

    res.status(200).json(updated);
    return;
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar aula" });
    return;
  }
};

const deleteClassSchedule = (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const deleted = classScheduleModel.deleteClassSchedule(id);
  if (!deleted) {
    res.status(404).json({ error: "Aula não encontrada" });
    return;
  }

  res.status(204).send();
  return;
};

function calculateDuration(timeSlot: TimeSlot): number {
  const [startH, startM] = timeSlot.startTime.split(":").map(Number);
  const [endH, endM] = timeSlot.endTime.split(":").map(Number);
  return endH - startH + (endM - startM) / 60;
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export default {
  index,
  generateSchedules,
  update,
  deleteClassSchedule,
};
