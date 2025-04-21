import { Request, Response } from "express";
import { z } from "zod";
import schedulesModel from "../models/schedulesModel";

const scheduleSchema = z.object({
  dayOfWeek: z.enum([
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
  ]),
  timeSlotId: z.number(),
});

const index = (req: Request, res: Response) => {
  try {
    const schedules = schedulesModel.getAllSchedules();
    res.status(200).json(schedules);
    return;
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar horários" });
    return;
  }
};

const show = (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const schedule = schedulesModel.getScheduleById(id);

    if (!schedule) {
      res.status(404).json({ error: "Horário não encontrado" });
      return;
    }

    res.status(200).json(schedule);
    return;
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar horário" });
    return;
  }
};

const create = (req: Request, res: Response) => {
  try {
    const parsedData = scheduleSchema.parse(req.body);
    const { dayOfWeek, timeSlotId } = parsedData;

    const newSchedule = schedulesModel.createSchedule(dayOfWeek, timeSlotId);
    res.status(201).json(newSchedule);
    return;
  } catch (error) {
    res.status(400).json({ error: "Erro ao criar horário" });
    return;
  }
};

const update = (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    const parsedData = scheduleSchema.partial().parse(req.body);
    const { dayOfWeek, timeSlotId } = parsedData;

    const existingSchedule = schedulesModel.getScheduleById(id);
    if (!existingSchedule) {
      res.status(404).json({ error: "Horário não encontrado" });
      return;
    }

    const updatedSchedule = schedulesModel.updateSchedule(id, {
      dayOfWeek: dayOfWeek ?? existingSchedule.dayOfWeek,
      timeSlotId: timeSlotId ?? existingSchedule.timeSlot?.id,
    });

    if (!updatedSchedule) {
      res.status(404).json({ error: "Horário não encontrado" });
      return;
    }

    res.status(200).json(updatedSchedule);
    return;
  } catch (error) {
    res.status(400).json({ error: "Erro ao atualizar horário" });
    return;
  }
};

const deleteSchedule = (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const deleted = schedulesModel.deleteSchedule(id);

    if (!deleted) {
      res.status(404).json({ error: "Horário não encontrado" });
      return;
    }

    res.status(204).send();
    return;
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar horário" });
    return;
  }
};

export default {
  index,
  show,
  create,
  update,
  delete: deleteSchedule,
};
