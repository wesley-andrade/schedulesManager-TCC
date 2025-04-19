import { Request, Response } from "express";
import timeSlotsModel from "../models/timeSlotsModel";
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

const index = (req: Request, res: Response) => {
  try {
    const timeSlots = timeSlotsModel.getAllTimeSlots();
    res.status(200).json(timeSlots);
    return;
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar horários" });
    return;
  }
};

const show = (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const timeSlot = timeSlotsModel.getTimeSlotById(id);

    if (!timeSlot) {
      res.status(404).json({ error: "Horário não encontrado" });
      return;
    }

    res.status(200).json(timeSlot);
    return;
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar horário" });
    return;
  }
};

const create = (req: Request, res: Response) => {
  try {
    const parsedData = timeSlotSchema.parse(req.body);
    const { startTime, endTime } = parsedData;

    const newTimeSlot = timeSlotsModel.createTimeSlot(startTime, endTime);
    res.status(201).json(newTimeSlot);
    return;
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors.map((e) => e.message) });
      return;
    }
    res.status(500).json({ error: "Erro ao criar horário" });
    return;
  }
};

const update = (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const parsedData = timeSlotSchema.parse(req.body);
    const { startTime, endTime } = parsedData;

    const updatedTimeSlot = timeSlotsModel.updateTimeSlot(id, {
      startTime,
      endTime,
    });

    if (!updatedTimeSlot) {
      res.status(404).json({ error: "Horário não encontrado" });
      return;
    }

    res.status(200).json(updatedTimeSlot);
    return;
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar horário" });
    return;
  }
};

const deleteTimeSlot = (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const success = timeSlotsModel.deleteTimeSlot(id);

    if (!success) {
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
  delete: deleteTimeSlot,
};
