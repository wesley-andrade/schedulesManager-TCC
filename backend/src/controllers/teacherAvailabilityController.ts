import { Request, Response } from "express";
import { z } from "zod";
import teacherAvailabilityModel from "../models/teacherAvailabilityModel";

const availabilitySchema = z.object({
  teacherId: z.number(),
  scheduleId: z.number(),
  status: z.boolean(),
});

const index = (req: Request, res: Response) => {
  try {
    const teacherAvailability =
      teacherAvailabilityModel.getAllTeacherAvailability();
    res.status(200).json(teacherAvailability);
    return;
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao buscar disponibilidade de professores" });
    return;
  }
};

const show = (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const availability =
      teacherAvailabilityModel.getTeacherAvailabilityById(id);
    if (!availability) {
      res.status(404).json({ error: "Disponibilidade não encontrada" });
      return;
    }
    res.status(200).json(availability);
    return;
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar disponibilidade" });
    return;
  }
};

const create = (req: Request, res: Response) => {
  try {
    const parsedData = availabilitySchema.parse(req.body);
    const { teacherId, scheduleId, status } = parsedData;

    const newAvailability = teacherAvailabilityModel.createTeacherAvailability(
      teacherId,
      scheduleId,
      status
    );

    res.status(201).json(newAvailability);
    return;
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors.map((e) => e.message) });
      return;
    }
    res.status(500).json({ error: "Erro ao cadastrar disponibilidade" });
    return;
  }
};

const update = (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const parsedData = availabilitySchema.partial().parse(req.body);
    const { teacherId, scheduleId, status } = parsedData;

    const updated = teacherAvailabilityModel.updateTeacherAvailability(id, {
      teacherId,
      scheduleId,
      status,
    });
    if (!updated) {
      res.status(404).json({ error: "Disponibilidade não encontrada" });
      return;
    }

    res.status(200).json(updated);
    return;
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors.map((e) => e.message) });
      return;
    }
    res.status(500).json({ error: "Erro ao atualizar disponibilidade" });
    return;
  }
};

const deleteAvailability = (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const deleted = teacherAvailabilityModel.deleteTeacherAvailability(id);
    if (!deleted) {
      res.status(404).json({ error: "Disponibilidade não encontrada" });
      return;
    }

    res.status(204).send();
    return;
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar disponibilidade" });
    return;
  }
};

export default {
  index,
  show,
  create,
  update,
  delete: deleteAvailability,
};
