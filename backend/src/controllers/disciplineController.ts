import { NextFunction, Request, Response } from "express";
import disciplineModel from "../models/disciplineModel";
import z from "zod";
import { RoomType } from "@prisma/client";

const disciplineSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  totalHours: z.number(),
  requiredRoomType: z.nativeEnum(RoomType, {
    errorMap: () => ({ message: "Tipo de sala inválida" }),
  }),
});

const index = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const disciplines = await disciplineModel.getAllDisciplines();

    res.status(200).json(disciplines);
    return;
  } catch (err) {
    next(err);
  }
};

const show = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ message: "ID inválido" });
      return;
    }

    const discipline = await disciplineModel.getDisciplineById(id);

    if (!discipline) {
      res.status(404).json({ message: "Disciplina não encontrada" });
      return;
    }

    res.status(200).json(discipline);
    return;
  } catch (err) {
    next(err);
    return;
  }
};

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsedData = disciplineSchema.parse(req.body);
    const { name, totalHours, requiredRoomType } = parsedData;

    const exist = await disciplineModel.findByName(name);
    if (exist) {
      res
        .status(409)
        .json({ message: "Já existe uma disciplina com esse nome" });
      return;
    }

    const newDiscipline = await disciplineModel.createDiscipline(
      name,
      totalHours,
      requiredRoomType
    );

    res.status(201).json(newDiscipline);
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

    const parsedData = disciplineSchema.partial().parse(req.body);
    const { name, totalHours, requiredRoomType } = parsedData;

    const exist = await disciplineModel.getDisciplineById(id);
    if (!exist) {
      res.status(404).json({ message: "Disciplina não encontrada" });
      return;
    }

    if (name) {
      const existName = await disciplineModel.findByName(name);
      if (existName && existName.id !== id) {
        res
          .status(409)
          .json({ message: "Já existe um disciplina com esse nome" });
        return;
      }
    }

    const updatedDiscipline = await disciplineModel.updateDiscipline(id, {
      name,
      totalHours,
      requiredRoomType,
    });

    res.status(200).json(updatedDiscipline);
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

    await disciplineModel.deleteDiscipline(id);

    res.status(204).send();
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
