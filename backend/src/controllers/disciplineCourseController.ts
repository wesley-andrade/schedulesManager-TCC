import { Request, Response } from "express";
import disciplineCourseModel from "../models/disciplineCourseModel";
import { z } from "zod";

const disciplineCourseSchema = z.object({
  id: z.number({ required_error: "O id deve ser um número" }),
  disciplineId: z.number({ required_error: "O id deve ser um número" }),
  courseId: z.number({ required_error: "O id deve ser um número" }),
});

const index = (req: Request, res: Response) => {
  try {
    const associations = disciplineCourseModel.getAllAssociations();
    res.status(200).json(associations);
    return;
  } catch (err) {
    res.status(500).json("Erro ao buscar associações");
    return;
  }
};

const create = (req: Request, res: Response) => {
  try {
    const parsedData = disciplineCourseSchema.parse(req.body);
    const { disciplineId, courseId } = parsedData;
    const newAssociation = disciplineCourseModel.createAssociation(
      disciplineId,
      courseId
    );
    res.status(201).json(newAssociation);
    if (!disciplineId || !courseId) {
      res
        .status(400)
        .json({ message: "O IDs do curso e disciplina são obrigatórios" });
      return;
    }
  } catch (err) {
    res.status(500).json({ message: "Erro ao criar associação" });
    return;
  }
};

const deleteAssociation = (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id);
    const deleted = disciplineCourseModel.deleteAssociation(id);

    if (!deleted) {
      res.status(400).json({ message: "Associação não encontrada" });
      return;
    }

    res.status(204).send();
    return;
  } catch (err) {
    res.status(500).json({ message: "Erro ao deletar associação" });
    return;
  }
};

export default {
  index,
  create,
  delete: deleteAssociation,
};
