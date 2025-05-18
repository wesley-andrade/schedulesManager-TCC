import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import disciplineModuleModel from "../models/disciplineModuleModel";
import disciplineModel from "../models/disciplineModel";
import moduleModel from "../models/moduleModel";
import academicPeriodModel from "../models/academicPeriodModel";

const disciplineModuleSchema = z.object({
  disciplineId: z.number({ message: "ID deve ser um número" }),
  moduleId: z.number({ message: "ID deve ser um número" }),
  academicPeriodId: z.number({ message: "ID deve ser um número" }),
});

const index = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const disciplineModules =
      await disciplineModuleModel.getAllDisciplinesModules();

    res.status(200).json(disciplineModules);
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

    const disciplineModule =
      await disciplineModuleModel.getDisciplineModuleById(id);

    if (!disciplineModule) {
      res.status(404).json({ message: "Disciplina não encontrada" });
      return;
    }

    res.status(200).json(disciplineModule);
    return;
  } catch (err) {
    next(err);
    return;
  }
};
const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsedData = disciplineModuleSchema.parse(req.body);
    const { disciplineId, moduleId, academicPeriodId } = parsedData;

    const [disciplineExist, moduleExist, academicPeriodExist] =
      await Promise.all([
        disciplineModel.getDisciplineById(disciplineId),
        moduleModel.getModuleById(moduleId),
        academicPeriodModel.getAcademicPeriodById(academicPeriodId),
      ]);

    if (!disciplineExist) {
      res.status(404).json({ message: "Disciplina não encontrada" });
      return;
    }

    if (!moduleExist) {
      res.status(404).json({ message: "Módulo não encontrado" });
      return;
    }

    if (!academicPeriodExist) {
      res.status(404).json({ message: "Período acadêmico não encontrado" });
      return;
    }

    const existRelation = await disciplineModuleModel.findByDisciplineAndModule(
      disciplineId,
      moduleId
    );

    if (existRelation) {
      res
        .status(409)
        .json({ message: "Esta disciplina já esta associada a este módulo" });
      return;
    }

    const newDisciplineModule =
      await disciplineModuleModel.createDisciplineModule(
        disciplineId,
        moduleId,
        academicPeriodId
      );

    res.status(201).json(newDisciplineModule);
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

    await disciplineModuleModel.deleteDisciplineModule(id);

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
  remove,
};
