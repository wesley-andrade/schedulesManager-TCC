import { Request, Response } from "express";
import { z } from "zod";
import disciplineTeacherModel from "../models/disciplineTeacherModel";

const disciplineTeacherSchema = z.object({
  teacherId: z
    .number()
    .int()
    .positive("ID do professor deve ser um número positivo"),
  disciplineId: z
    .number()
    .int()
    .positive("ID da disciplina deve ser um número positivo"),
});

const index = (req: Request, res: Response) => {
  try {
    const disciplineTeachers =
      disciplineTeacherModel.getAllDisciplineTeachers();
    res.status(200).json(disciplineTeachers);
    return;
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar professores e disciplinas" });
    return;
  }
};

const create = (req: Request, res: Response) => {
  try {
    const parsedData = disciplineTeacherSchema.parse(req.body);
    const { teacherId, disciplineId } = parsedData;

    const newDisciplineTeacher = disciplineTeacherModel.createDisciplineTeacher(
      disciplineId,
      teacherId
    );

    res.status(201).json(newDisciplineTeacher);
    return;
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
      return;
    }
    res.status(500).json({ error: "Erro ao criar professor e disciplina" });
    return;
  }
};

const deleteDisciplineTeacher = (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const deleted = disciplineTeacherModel.deleteDisciplineTeacher(id);

    if (!deleted) {
      res.status(404).json({ error: "Professor e disciplina não encontrados" });
      return;
    }

    res.status(204).send();
    return;
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar professor e disciplina" });
    return;
  }
};

export default {
  index,
  create,
  deleteDisciplineTeacher,
};
