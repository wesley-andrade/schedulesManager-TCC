import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import teacherAvailabilityModel from "../models/teacherAvailabilityModel";
import teacherModel from "../models/teacherModel";
import scheduleModel from "../models/scheduleModel";

const availabilitySchema = z.object({
  teacherId: z.number({ message: "ID deve ser um número" }),
  scheduleId: z.number({ message: "ID deve ser um número" }),
  status: z.boolean(),
});

const index = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherAvailability =
      await teacherAvailabilityModel.getAllTeacherAvailability();

    res.status(200).json(teacherAvailability);
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

    const availability =
      await teacherAvailabilityModel.getTeacherAvailabilityById(id);

    if (!availability) {
      res.status(404).json({ error: "Disponibilidade não encontrada" });
      return;
    }

    res.status(200).json(availability);
    return;
  } catch (err) {
    next(err);
    return;
  }
};

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsedData = availabilitySchema.parse(req.body);
    const { teacherId, scheduleId, status } = parsedData;

    const teacherExist = await teacherModel.getTeacherById(teacherId);
    if (!teacherExist) {
      res.status(404).json({ message: "Professor não encontrado" });
      return;
    }

    const scheduleExist = await scheduleModel.getScheduleById(scheduleId);
    if (!scheduleExist) {
      res.status(404).json({ message: "Horário não encontrado" });
      return;
    }

    const newAvailability =
      await teacherAvailabilityModel.createTeacherAvailability(
        teacherId,
        scheduleId,
        status
      );

    res.status(201).json(newAvailability);
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

    const parsedData = availabilitySchema.partial().parse(req.body);
    const { teacherId, scheduleId, status } = parsedData;

    if (teacherId !== undefined) {
      const teacherExist = await teacherModel.getTeacherById(teacherId);
      if (!teacherExist) {
        res.status(404).json({ message: "Professor não encontrado" });
        return;
      }
    }

    if (scheduleId !== undefined) {
      const scheduleExist = await scheduleModel.getScheduleById(scheduleId);
      if (!scheduleExist) {
        res.status(404).json({ message: "Horário não encontrado" });
        return;
      }
    }

    const updated = await teacherAvailabilityModel.updateTeacherAvailability(
      id,
      {
        teacherId,
        scheduleId,
        status,
      }
    );

    res.status(200).json(updated);
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

    await teacherAvailabilityModel.deleteTeacherAvailability(id);

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
