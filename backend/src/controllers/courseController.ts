import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import courseModel from "../models/courseModel";

const createCourseSchema = z.object({
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .regex(/^[\p{L}\s'-]+$/u, "Nome inválido"),
});

const index = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const courses = await courseModel.getAllCourses();

    res.status(200).json(courses);
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

    const course = await courseModel.getCourseById(id);

    if (!course) {
      res.status(404).json({ message: "Curso não encontrado" });
      return;
    }

    res.status(200).json(course);
    return;
  } catch (err) {
    next(err);
    return;
  }
};

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsedData = createCourseSchema.parse(req.body);
    const { name } = parsedData;

    const exist = await courseModel.findByName(name);
    if (exist) {
      res.status(400).json({ message: "Já existe um curso com esse nome" });
      return;
    }

    const newCourse = await courseModel.createCourse(name);

    res.status(201).json(newCourse);
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

    const parsedData = createCourseSchema.parse(req.body);
    const { name } = parsedData;

    const exist = await courseModel.getCourseById(id);
    if (!exist) {
      res.status(404).json({ message: "Curso não encontrado" });
      return;
    }

    const updatedCourse = await courseModel.updateCourse(id, { name });

    res.status(200).json(updatedCourse);
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

    await courseModel.deleteCourse(id);

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
