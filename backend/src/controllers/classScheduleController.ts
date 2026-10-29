import { NextFunction, Request, Response } from "express";
import classScheduleModel from "../models/classScheduleModel";
import classScheduleService from "../services/classScheduleService";
import prisma from "../models/prisma";

const index = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let teacherId: number | undefined;

    if (req.user?.role !== "admin") {
      const teacher = await prisma.teacher.findUnique({
        where: { userId: req.user!.id },
        select: { id: true },
      });

      if (!teacher) {
        res.status(200).json([]);
        return;
      }

      teacherId = teacher.id;
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
  next: NextFunction,
) => {
  try {
    const academicPeriodId = parseInt(req.query.academicPeriodId as string);
    if (isNaN(academicPeriodId)) {
      res.status(400).json({ message: "Período acadêmico inválido" });
      return;
    }

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
    if (isNaN(id)) {
      res.status(400).json({ message: "ID inválido" });
      return;
    }

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
