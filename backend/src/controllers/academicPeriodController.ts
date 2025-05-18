import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import academicPeriodModel from "../models/academicPeriodModel";

const academicPeriodSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Data de início inválida",
  }),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Data de término inválida",
  }),
});

const index = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const periods = await academicPeriodModel.getAllAcademicPeriods();

    res.status(200).json(periods);
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

    const period = await academicPeriodModel.getAcademicPeriodById(id);

    if (!period) {
      res.status(404).json({ message: "Período acadêmico não encontrado" });
      return;
    }

    res.status(200).json(period);
    return;
  } catch (err) {
    next(err);
    return;
  }
};

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsedData = academicPeriodSchema.parse(req.body);
    const { name, startDate, endDate } = parsedData;

    const exist = await academicPeriodModel.findByName(name);
    if (exist) {
      res
        .status(400)
        .json({ message: "Já existe um período acadêmico com esse nome" });
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start >= end) {
      res.status(400).json({
        message: "Data de início deve ser anterior à data de término",
      });
      return;
    }

    const newPeriod = await academicPeriodModel.createAcademicPeriod(
      name,
      startDate,
      endDate
    );

    res.status(201).json(newPeriod);
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

    const parsedData = academicPeriodSchema.partial().parse(req.body);

    const currentPeriod = await academicPeriodModel.getAcademicPeriodById(id);
    if (!currentPeriod) {
      res.status(404).json({ message: "Período acadêmico não encontrado" });
      return;
    }

    if (parsedData.startDate || parsedData.endDate) {
      const start = parsedData.startDate
        ? new Date(parsedData.startDate)
        : new Date(currentPeriod.startDate);
      const end = parsedData.endDate
        ? new Date(parsedData.endDate)
        : new Date(currentPeriod.endDate);

      if (end <= start) {
        res.status(400).json({
          message: "Data de término deve ser posterior à data de início",
        });
        return;
      }
    }

    const updated = await academicPeriodModel.updateAcademicPeriod(
      id,
      parsedData
    );

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

    await academicPeriodModel.deleteAcademicPeriod(id);

    res.status(204).send();
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
