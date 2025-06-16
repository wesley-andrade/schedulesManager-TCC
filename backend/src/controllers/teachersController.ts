import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import teachersModel from "../models/teacherModel";
import userModel from "../models/userModel";

const createTeacherSchema = z.object({
  userId: z.number({ message: "ID deve ser um número" }),
  phone: z
    .string()
    .regex(/^\(?\d{2}\)?[\s-]?\d{4,5}-?\d{4}$/, "Telefone inválido")
    .optional(),
});

const index = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teachers = await teachersModel.getAllTeachers();

    res.status(200).json(teachers);
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

    const teacher = await teachersModel.getTeacherById(id);

    if (!teacher) {
      res.status(404).json({ error: "Professor não encontrado" });
      return;
    }

    res.status(200).json(teacher);
    return;
  } catch (err) {
    next(err);
    return;
  }
};

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsedData = createTeacherSchema.parse(req.body);
    const { userId, phone } = parsedData;

    const userExist = await userModel.getUserById(userId);
    if (!userExist) {
      res.status(404).json({ message: "Usuário não encontrado" });
      return;
    }

    const newTeacher = await teachersModel.createTeacher(userId, phone || null);

    res.status(201).json(newTeacher);
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

    const parsedData = createTeacherSchema.partial().parse(req.body);
    const { phone } = parsedData;

    const exist = await teachersModel.getTeacherById(id);
    if (!exist) {
      res.status(404).json({ error: "Professor não encontrado" });
      return;
    }

    const updated = await teachersModel.updateTeacher(id, { phone });

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

    await teachersModel.deleteTeacher(id);

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
