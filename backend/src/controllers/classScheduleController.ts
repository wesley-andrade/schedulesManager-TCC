import { NextFunction, Request, Response } from "express";
import classScheduleModel from "../models/classScheduleModel";
import classScheduleService from "../services/classScheduleService";
import prisma from "../models/prisma";

const index = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.query.teacherId
      ? parseInt(req.query.teacherId as string)
      : undefined;
    let teacherId: number | undefined;

    if (userId) {
      const teacher = await prisma.teacher.findUnique({
        where: { userId },
        select: { id: true },
      });
      teacherId = teacher?.id;
    }

    const result = await classScheduleModel.getAllClassSchedules(teacherId);

    res.status(200).json(result);
    return;
  } catch (err) {
    next(err);
    return;
  }
};

const generateSchedules = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const academicPeriodId = parseInt(req.query.academicPeriodId as string);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=relatorio_horarios.pdf"
    );
    await classScheduleService.generateSchedulesPDF(academicPeriodId, res);
    return;
  } catch (err) {
    next(err);
    return;
  }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    const result = await classScheduleService.updateClassSchedule(id, req.body);

    res.status(200).json(result);
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

    await classScheduleModel.deleteClassSchedule(id);

    res.status(204).end();
    return;
  } catch (err) {
    next(err);
    return;
  }
};

export default {
  index,
  generateSchedules,
  update,
  remove,
};
