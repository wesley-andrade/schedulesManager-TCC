import { RoomType } from "@prisma/client";
import roomModel from "../models/roomModel";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

const roomSchema = z.object({
  name: z.string().min(1, { message: "O nome da sala é obrigatório" }),
  seatsAmount: z
    .number({ required_error: "Uma capacidade total é obrigatória" })
    .positive({ message: "O número deve ser maior que 0" }),
  type: z.nativeEnum(RoomType, {
    errorMap: () => ({ message: "Tipo de sala invalida" }),
  }),
});

const index = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rooms = await roomModel.getAllRooms();

    res.status(200).json(rooms);
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

    const room = await roomModel.getRoomById(id);

    if (!room) {
      res.status(404).json({ message: "Sala não encontrada" });
      return;
    }

    res.status(200).json(room);
    return;
  } catch (err) {
    next(err);
    return;
  }
};

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsedData = roomSchema.parse(req.body);
    const { name, seatsAmount, type } = parsedData;

    const newRoom = await roomModel.createRoom(name, seatsAmount, type);

    res.status(201).json(newRoom);
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

    const parsedData = roomSchema.partial().parse(req.body);
    const { name, seatsAmount, type } = parsedData;

    const exist = await roomModel.getRoomById(id);
    if (!exist) {
      res.status(404).json({ message: "Sala não encontrada" });
      return;
    }

    const updatedRoom = await roomModel.updateRoom(id, {
      name,
      seatsAmount,
      type,
    });

    res.status(200).json(updatedRoom);
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

    await roomModel.deleteRoom(id);

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
