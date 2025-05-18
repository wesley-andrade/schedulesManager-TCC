import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import disciplineTeacherModel from "../models/disciplineTeacherModel";
import teacherModel from "../models/teacherModel";
import disciplineModel from "../models/disciplineModel";

const disciplineTeacherSchema = z.object({
  teacherId: z.number({
    message: "ID deve ser um número",
  }),
  disciplineId: z.number({
    message: "ID deve ser um número",
  }),
});

const index = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const disciplineTeachers =
      await disciplineTeacherModel.getAllDisciplineTeachers();

    res.status(200).json(disciplineTeachers);
    return;
  } catch (err) {
    next(err);
    return;
  }
};

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsedData = disciplineTeacherSchema.parse(req.body);
    const { teacherId, disciplineId } = parsedData;

    const [teacherExist, disciplineExist] = await Promise.all([
      teacherModel.getTeacherById(teacherId),
      disciplineModel.getDisciplineById(disciplineId),
    ]);

    if (!teacherExist) {
      res.status(404).json({ message: "Professor não encontrado" });
      return;
    }

    if (!disciplineExist) {
      res.status(404).json({ message: "Disciplina não encontrada" });
    }

    const newDisciplineTeacher =
      await disciplineTeacherModel.createDisciplineTeacher(
        disciplineId,
        teacherId
      );

    res.status(201).json(newDisciplineTeacher);
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

    await disciplineTeacherModel.deleteDisciplineTeacher(id);

    res.status(204).send();
    return;
  } catch (err) {
    next(err);
    return;
  }
};

export default {
  index,
  create,
  remove,
};
