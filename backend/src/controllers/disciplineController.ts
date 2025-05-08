import { Request, Response } from "express";
import { Discipline } from "../types";
import disciplineModel from "../models/disciplineModel";
import z from "zod";

const disciplineSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  totalHours: z.number(),
  requiredRoomType: z.string().min(1, "Tipo de sala é obrigatório"),
});

const index = (req: Request, res: Response) => {
  try {
    const disciplines: Discipline[] = disciplineModel.getAllDisciplines();
    if (!disciplines) {
      return undefined;
    }
    res.status(200).json(disciplines);
    return;
  } catch (err) {
    res.status(500).json({ message: "Não foi possível buscar as discplinas" });
  }
};

const show = (req: Request, res: Response) => {
  try {
    const reqId = parseInt(req.params.id);
    const discipline = disciplineModel.getDisciplinebyId(reqId);
    if (!discipline) {
      res.status(404).json({ message: "Disciplina não encontrada" });
      return;
    }
    res.status(200).json(discipline);
    return;
  } catch (err) {
    res.status(500).json({ message: "Não foi possível buscar a disciplina" });
    return;
  }
};

const create = (req: Request, res: Response) => {
  try {
    const receivedParsed = disciplineSchema.parse(req.body);
    const { name, totalHours, requiredRoomType } = receivedParsed;
    const newDiscipline = disciplineModel.create(
      name,
      totalHours,
      requiredRoomType
    );

    if (!newDiscipline) {
      res.status(400).json({ message: "Todos os campos são obrigatórios" });
      return;
    }
    res.status(202).json(newDiscipline);
    return;
  } catch (err) {
    res.status(500).json({ message: "Erro ao criar disciplina" });
    return;
  }
};

const update = (req: Request, res: Response) => {
  try {
    const disciplineIndex = parseInt(req.params.id);
    const updatedData = disciplineSchema.parse(req.body);
    const { name, totalHours } = updatedData;
    const updatedDiscipline = disciplineModel.update(disciplineIndex, {
      name,
      totalHours,
    });
    if (!updatedDiscipline) {
      res.status(404).json({ message: "Disciplina não encontrada" });
      return;
    }
    res.status(200).json(updatedDiscipline);
    return;
  } catch (err) {
    res.status(500).json({ message: "Erro ao atualizar disciplina" });
    return;
  }
};

const deleteDiscipline = (req: Request, res: Response) => {
  try {
    const disciplineId = parseInt(req.params.id);
    const deleted = disciplineModel.delete(disciplineId);
    if (!deleted) {
      res.status(404).json({ message: "Disciplina não encontrada" });
      return;
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: "Erro ao deletar disciplina" });
    return;
  }
};

export default {
  index,
  show,
  create,
  update,
  delete: deleteDiscipline,
};
