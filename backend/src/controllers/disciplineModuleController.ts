import { Request, Response } from "express";
import { z } from "zod";
import disciplineModuleModel from "../models/disciplineModuleModel";

const disciplineModuleSchema = z.object({
  id: z.number({ required_error: "O id deve ser um número" }),
  disciplineId: z.number({ required_error: "O id deve ser um número" }),
  moduleId: z.number({ required_error: "O id deve ser um número" }),
  academicPeriodId: z.number({ required_error: "O id deve ser um número" }),
});

const index = (req: Request, res: Response) => {
  try {
    const disciplineModules = disciplineModuleModel.getAllDisciplinesModules();
    res.status(200).json(disciplineModules);
    return;
  } catch (err) {
    res.status(500).json("Erro ao buscar disciplinas");
    return;
  }
};
const show = (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const disciplineModule = disciplineModuleModel.getDisciplineModuleById(id);

    if (!disciplineModule) {
      res.status(404).json({ message: "Disciplina não encontrada" });
      return;
    }

    res.status(200).json(disciplineModule);
    return;
  } catch (err) {
    res.status(500).json("Erro ao buscar disciplina");
    return;
  }
};
const create = (req: Request, res: Response) => {
  try {
    const parsedData = disciplineModuleSchema.parse(req.body);
    const { disciplineId, moduleId, academicPeriodId } = parsedData;

    const newDisciplineModule = disciplineModuleModel.createDisciplineModule(
      disciplineId,
      moduleId,
      academicPeriodId
    );

    res.status(201).json(newDisciplineModule);
    return;
  } catch (err) {
    res.status(500).json("Erro ao criar disciplina");
    return;
  }
};

const deleteDisciplineModule = (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const deleted = disciplineModuleModel.deleteDisciplineModule(id);

    if (!deleted) {
      res.status(404).json({ message: "Disciplina não encontrada" });
      return;
    }

    res.status(204).send();
  } catch (err) {
    res.status(500).json("Erro ao deletar disciplina");
    return;
  }
};

export default {
  index,
  show,
  create,
  delete: deleteDisciplineModule,
};
