import { NextFunction, Request, Response } from "express";
import disciplineCourseModel from "../models/disciplineCourseModel";
import { z } from "zod";

const disciplineCourseSchema = z.object({
  disciplineId: z.number({ message: "ID deve ser um número" }),
  courseId: z.number({ message: "ID deve ser um número" }),
});

const index = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const associations = await disciplineCourseModel.getAllAssociations();

    res.status(200).json(associations);
    return;
  } catch (err) {
    next(err);
    return;
  }
};

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsedData = disciplineCourseSchema.parse(req.body);
    const { disciplineId, courseId } = parsedData;

    const newAssociation = await disciplineCourseModel.createAssociation(
      disciplineId,
      courseId
    );

    res.status(201).json(newAssociation);
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

    await disciplineCourseModel.deleteAssociation(id);

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
