import { Request, Response } from "express";
import { z } from "zod";
import { Course } from "../types";
import courseModel from "../models/courseModel";

const createCourseSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").regex(/^[a-zA-Z\s]+$/, "Nome deve conter apenas letras")
});

const index = (req: Request, res: Response) => {
  try {
    const courses: Course[] = courseModel.getAllCourses();
    res.status(200).json(courses);
    return;
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar cursos" });
    return;
  }
};

const show = (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const course = courseModel.getCourseById(id);

    if (!course) {
      res.status(404).json({ message: "Curso não encontrado" });
      return;
    }

    res.status(200).json(course);
    return;
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar curso" });
    return;
  }
};

const create = (req: Request, res: Response) => {
  try {
    const parsedData = createCourseSchema.parse(req.body);
    const { name } = parsedData;

    const newCourse = courseModel.createCourse(name);
    res.status(201).json(newCourse);
    return;
  } catch (error) {
    res.status(400).json({ message: "Erro ao criar curso" });
    return;
  }
};

const update = (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const parsedData = createCourseSchema.parse(req.body);
    const { name } = parsedData;

    const updatedCourse = courseModel.updateCourse(id, { name });

    if (!updatedCourse) {
      res.status(404).json({ message: "Curso não encontrado" });
      return;
    }

    res.status(200).json(updatedCourse);
    return;
  } catch (error) {
    res.status(400).json({ message: "Erro ao atualizar curso" });
    return;
  }
}

const deleteCourse = (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const deleted = courseModel.deleteCourse(id);

    if (!deleted) {
      res.status(404).json({ message: "Curso não encontrado" });
      return;
    }

    res.status(204).send();
    return;
  } catch (error) {
    res.status(500).json({ message: "Erro ao deletar curso" });
    return;
  }
};

export default {
  index,
  show,
  create,
  update,
  delete: deleteCourse,
}
