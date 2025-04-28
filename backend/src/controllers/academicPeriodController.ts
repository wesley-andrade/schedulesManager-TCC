import { Request, Response } from "express";
import { z } from "zod";
import academicPeriodModel from "../models/academicPeriodModel";

const academicPeriodSchema = z.object({
  id: z.number({ required_error: "O id deve ser um número" }).positive("O id deve ser positivo"),
  name: z.string().min(1, "Nome é obrigatório"),
  startDate: z
    .string({ required_error: "A data de início é obrigatória" })
    .date(),
  endDate: z
    .string({ required_error: "A data de término é obrigatória" })
    .date(),
});

const index = (req: Request, res: Response) => {
  try {
    const academicPeriods = academicPeriodModel.getAllAcademicPeriods();
    res.status(200).json(academicPeriods);
    return;
  } catch (err) {
    res.status(500).json("Erro ao buscar períodos acadêmicos");
    return;
  }
};

const show = (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const academicPeriod = academicPeriodModel.getAcademicPeriodById(id);
    if (!academicPeriod) {
      res.status(404).json({ message: "Período acadêmico não encontrado" });
      return;
    }
    res.status(200).json(academicPeriod);
    return;
  } catch (err) {
    res.status(500).json("Erro ao buscar período acadêmico");
    return;
  }
};

const create = (req: Request, res: Response) => {
  try {
    const parsedData = academicPeriodSchema.parse(req.body);
    const { name, startDate, endDate } = parsedData;

    const newAcademicPeriod = academicPeriodModel.createAcademicPeriod(
      name,
      startDate,
      endDate
    );

    res.status(201).json(newAcademicPeriod);
    return;
  } catch (err) {
    res.status(500).json("Erro ao criar período acadêmico");
    return;
  }
};

const update = (req: Request, res: Response) => {
  try {
    const index = parseInt(req.params.id);
    const parsedData = academicPeriodSchema.parse(req.body);

    const updatedAcademicPeriod = academicPeriodModel.updateAcademicPeriod(
      index,
      parsedData
    );

    if (!updatedAcademicPeriod) {
      res.status(404).json({ message: "Período acadêmico não encontrado" });
      return;
    }

    res.status(200).json(updatedAcademicPeriod);
    return;
  } catch (err) {
    res.status(500).json("Erro ao atualizar período acadêmico");
    return;
  }
};

const deleteAcademicPeriod = (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const deleted = academicPeriodModel.deleteAcademicPeriod(id);

    if (!deleted) {
      res.status(404).json({ message: "Período acadêmico não encontrado" });
      return;
    }

    res.status(204).send();
  } catch (err) {
    res.status(500).json("Erro ao deletar período acadêmico");
    return;
  }
};
export default {
  index,
  show,
  create,
  update,
  deleteAcademicPeriod,
};
