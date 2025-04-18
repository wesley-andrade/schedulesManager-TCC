import { Request, Response } from "express";
import { z } from "zod";
import teachersModel from "../models/teachersModel";

const createTeacherSchema = z.object({
  userId: z.number(),
  phone: z.string().length(11, "Número de telefone inválido"),
});

const index = (req: Request, res: Response) => {
  try {
    const teachers = teachersModel.getAllTeachers();
    res.status(200).json(teachers);
    return;
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar professores" });
    return;
  }
};

const show = (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const teacher = teachersModel.getTeacherById(id);
    if (!teacher) {
      res.status(404).json({ error: "Professor não encontrado" });
      return;
    }
    res.status(200).json(teacher);
    return;
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar professor" });
    return;
  }
};

const create = (req: Request, res: Response) => {
  try {
    const parsedData = createTeacherSchema.parse(req.body);
    const { userId, phone } = parsedData;

    const newTeacher = teachersModel.createTeacher(userId, phone);
    if (!newTeacher) {
      res
        .status(404)
        .json({ error: "Usuário não encontrado para vincular como professor" });
      return;
    }

    res.status(201).json(newTeacher);
    return;
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors.map((e) => e.message) });
      return;
    }
    res.status(500).json({ error: "Erro ao cadastrar professor" });
    return;
  }
};

const update = (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { phone } = req.body;

    const updated = teachersModel.updateTeacher(id, { phone });
    if (!updated) {
      res.status(404).json({ error: "Professor não encontrado" });
      return;
    }

    res.status(200).json(updated);
    return;
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar professor" });
    return;
  }
};

const deleteTeacher = (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const sucess = teachersModel.deleteTeacher(id);

    if (!sucess) {
      res.status(404).json({ error: "Professor não encontrado" });
      return;
    }

    res.status(204).send();
    return;
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar professor" });
    return;
  }
};

export default {
  index,
  show,
  create,
  update,
  delete: deleteTeacher,
};
