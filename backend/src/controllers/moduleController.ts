import { NextFunction, Request, Response } from "express";
import moduleModel from "../models/moduleModel";
import { z } from "zod";

const moduleSchema = z.object({
  name: z.string().min(1, { message: "Nome é obrigatório" }),
  totalStudents: z
    .number()
    .positive({ message: "Número de alunos deve ser positivo" }),
});

const index = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const modules = await moduleModel.getAllModules();

    res.status(200).json(modules);
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

    const module = await moduleModel.getModuleById(id);

    if (!module) {
      res.status(404).json({ message: "Módulo não encontrado" });
      return;
    }

    res.status(200).json(module);
    return;
  } catch (err) {
    next(err);
    return;
  }
};

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsedData = moduleSchema.parse(req.body);
    const { name, totalStudents } = parsedData;

    const newModule = await moduleModel.createModule(name, totalStudents);

    res.status(201).json(newModule);
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

    const parsedData = moduleSchema.partial().parse(req.body);
    const { name, totalStudents } = parsedData;

    const exist = await moduleModel.getModuleById(id);
    if (!exist) {
      res.status(404).json({ message: "Módulo não encontrado" });
      return;
    }

    const updatedModule = await moduleModel.updateModule(id, {
      name,
      totalStudents,
    });

    res.status(200).json(updatedModule);
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

    await moduleModel.deleteModule(id);

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
