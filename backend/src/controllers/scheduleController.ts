import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import schedulesModel from "../models/scheduleModel";
import timeSlotModel from "../models/timeSlotModel";

const scheduleSchema = z.object({
  dayOfWeek: z.enum([
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
  ]),
  timeSlotId: z.number({ message: "ID deve ser um número" }),
});

const index = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const schedules = await schedulesModel.getAllSchedules();

    res.status(200).json(schedules);
    return;
  } catch (err) {
    next(err);
    return;
  }
};

const show = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ message: "ID inválido" });
      return;
    }

    const schedule = await schedulesModel.getScheduleById(id);

    if (!schedule) {
      res.status(404).json({ error: "Horário não encontrado" });
      return;
    }

    res.status(200).json(schedule);
    return;
  } catch (err) {
    next(err);
    return;
  }
};

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsedData = scheduleSchema.parse(req.body);
    const { dayOfWeek, timeSlotId } = parsedData;

    const timeSlotExists = await timeSlotModel.getTimeSlotById(timeSlotId);
    if (!timeSlotExists) {
      res.status(404).json({ error: "Time slot não encontrado" });
      return;
    }

    const newSchedule = await schedulesModel.createSchedule(
      dayOfWeek,
      timeSlotExists.id
    );
    res.status(201).json(newSchedule);
    return;
  } catch (err) {
    next(err);
    return;
  }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ message: "ID inválido" });
      return;
    }

    const parsedData = scheduleSchema.partial().parse(req.body);
    const { dayOfWeek, timeSlotId } = parsedData;

    const exist = await schedulesModel.getScheduleById(id);
    if (!exist) {
      res.status(404).json({ error: "Horário não encontrado" });
      return;
    }

    if (timeSlotId && !timeSlotModel.getTimeSlotById(timeSlotId)) {
      res.status(404).json({ error: "Time slot não encontrado" });
      return;
    }

    const updatedSchedule = await schedulesModel.updateSchedule(id, {
      dayOfWeek: dayOfWeek ?? exist.dayOfWeek,
      timeSlotId: timeSlotId ?? exist.timeSlotId,
    });

    res.status(200).json(updatedSchedule);
    return;
  } catch (err) {
    next(err);
    return;
  }
};

const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ message: "ID inválido" });
      return;
    }

    await schedulesModel.deleteSchedule(id);

    res.status(204).end();
    return;
  } catch (err) {
    next(err);
    return;
  }
};

export default {
  index,
  show,
  create,
  update,
  remove,
};
