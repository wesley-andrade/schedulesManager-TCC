import { NextFunction, Request, Response } from "express";
import classScheduleModel from "../models/classScheduleModel";
import { TimeSlot } from "../types";
import classScheduleService from "../services/classScheduleService";

const index = (req: Request, res: Response) => {
  const result = classScheduleModel.getAllClassSchedules();
  res.json(result);
};

const generateSchedules = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const academicPeriodId = parseInt(req.query.academicPeriodId as string);
    const result = await classScheduleService.generateSchedules(
      academicPeriodId
    );

    res.status(201).json(result);
    return;
  } catch (err) {
    next(err);
  }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    const result = await classScheduleService.updateClassSchedule(id, req.body);

    res.status(200).json(result);
    return;
  } catch (err) {
    return next(err);
  }
};

const deleteClassSchedule = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ message: "ID inválido" });
      return;
    }

    classScheduleModel.deleteClassSchedule(id);

    res.status(204).send();
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
  deleteClassSchedule,
};
