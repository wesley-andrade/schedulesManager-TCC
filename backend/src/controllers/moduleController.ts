import { Request, Response } from "express";
import moduleModel from "../models/moduleModel";
import { z } from "zod";
import { Module } from "../types";

const moduleSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  totalStudents: z.number().positive("Número de alunos deve ser positivo"),
});

const index = (req: Request, res: Response) => {
  try {
    const modules: Module[] = moduleModel.getAllModules();
    if (!modules) {
      return undefined;
    }
    res.status(200).json(modules);
    return;
  } catch (err) {
    res.status(500).json({ message: "Não foi possível buscar os módulos" });
  }
};

const show = (req: Request, res: Response) => {
  try {
    const reqId = parseInt(req.params.id);
    const module = moduleModel.getModuleById(reqId);
    if (!module) {
      res.status(404).json({ message: "Módulo não encontrado" });
      return;
    }
    res.status(200).json(module);
    return;
  } catch (err) {
    res.status(500).json({ message: "Não foi possível buscar o módulo" });
    return;
  }
};

const create = (req: Request, res: Response) => {
  try {
    const receivedParsed = moduleSchema.parse(req.body);
    const { name, totalStudents } = receivedParsed;
    const newModule = moduleModel.create(name, totalStudents);
    if (!newModule) {
      res.status(400).json({ message: "Todos os campos são obrigatórios" });
      return;
    }
    res.status(202).json(newModule);
    return;
  } catch (err) {
    res.status(500).json({ message: "Erro ao criar módulo" });
    return;
  }
};

const update = (req: Request, res: Response) => {
  try {
    const moduleIndex = parseInt(req.params.id);
    const receivedParsed = moduleSchema.parse(req.body);
    const { name, totalStudents } = receivedParsed;
    const updatedModule = moduleModel.update(moduleIndex, {
      name,
      totalStudents,
    });

    if (!updatedModule) {
      res.status(400).json({ message: "Todos os campos são obrigatórios" });
      return;
    }
    res.status(202).json(updatedModule);
    return;
  } catch (err) {
    res.status(500).json({ message: "Erro ao atualizar módulo" });
    return;
  }
};

const deleteModule = (req: Request, res: Response) => {
  try {
    const moduleIndex = parseInt(req.params.id);
    const deletedModule = moduleModel.delete(moduleIndex);

    if (!deletedModule) {
      res.status(404).json({ message: "Módulo não encontrado" });
      return;
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: "Erro ao deletar módulo" });
    return;
  }
};

export default {
  index,
  show,
  create,
  update,
  delete: deleteModule,
};
