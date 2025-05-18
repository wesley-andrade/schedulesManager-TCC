import { NextFunction, Request, Response } from "express";
import timeSlotModel from "../models/timeSlotModel";
import { z } from "zod";

export const timeSlotSchema = z
  .object({
    startTime: z
      .string()
      .regex(/^([0-1]\d|2[0-3]):([0-5]\d)$/, "Horário inválido"),
    endTime: z
      .string()
      .regex(/^([0-1]\d|2[0-3]):([0-5]\d)$/, "Horário inválido"),
  })
  .refine(
    (data) => {
      return data.endTime > data.startTime;
    },
    {
      message: "O horário final deve ser posterior ao horário inicial",
      path: ["endTime"],
    }
  );

const index = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const timeSlots = await timeSlotModel.getAllTimeSlots();

    res.status(200).json(timeSlots);
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

    const timeSlot = await timeSlotModel.getTimeSlotById(id);

    if (!timeSlot) {
      res.status(404).json({ error: "Horário não encontrado" });
      return;
    }

    res.status(200).json(timeSlot);
    return;
  } catch (err) {
    next(err);
    return;
  }
};

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsedData = timeSlotSchema.parse(req.body);
    const { startTime, endTime } = parsedData;

    const newTimeSlot = await timeSlotModel.createTimeSlot(startTime, endTime);

    res.status(201).json(newTimeSlot);
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

    const parsedData = timeSlotSchema.parse(req.body);
    const { startTime, endTime } = parsedData;

    const exist = await timeSlotModel.getTimeSlotById(id);
    if (!exist) {
      res.status(404).json({ error: "Horário não encontrado" });
      return;
    }

    const updatedTimeSlot = await timeSlotModel.updateTimeSlot(id, {
      startTime,
      endTime,
    });

    res.status(200).json(updatedTimeSlot);
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

    await timeSlotModel.deleteTimeSlot(id);

    res.status(204).send();
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
