import roomModel from "../models/roomModel";
import { Room } from "../types";
import { Request, Response } from "express";
import { z } from "zod";

const roomSchema = z.object({
  name: z.string().min(1, { message: "O nome da sala é obrigatório" }),
  seatsAmount: z
    .number({ required_error: "Uma capacidade total é obrigatória" })
    .positive({ message: "O número deve ser maior que 0" }),
  type: z.string().min(1, { message: "O tipo da sala é obrigatório" }),
});

const index = (req: Request, res: Response) => {
  try {
    const roomsList: Room[] = roomModel.getAllRooms();
    if (!roomsList) {
      res.status(404).json({ message: "Nenhuma sala foi encontrada" });
      return;
    }
    res.status(200).json(roomsList);
    return;
  } catch (err) {
    res.status(500).json({ message: "Não foi possível buscar as salas" });
    return;
  }
};

const show = (req: Request, res: Response) => {
  try {
    const reqId = parseInt(req.params.id);
    const room = roomModel.getRoomById(reqId);
    if (!room) {
      res.status(404).json({ message: "Sala não encontrada" });
      return;
    }
    res.status(200).json(room);
    return;
  } catch (err) {
    res.status(500).json({ message: "Não foi possível buscar a sala" });
    return;
  }
};

const create = (req: Request, res: Response) => {
  try {
    const receivedParsed = roomSchema.parse(req.body);
    const { name, seatsAmount, type } = receivedParsed;
    const newRoom = roomModel.create(name, seatsAmount, type);
    if (!newRoom) {
      res.status(400).json({ message: "Todos os campos são obrigatórios" });
      return;
    }
    res.status(201).json(newRoom);
    return;
  } catch (err) {
    res.status(500).json({ message: "Erro ao criar sala" });
    return;
  }
};

const update = (req: Request, res: Response) => {
  try {
    const roomId = parseInt(req.params.id);
    const receivedParsed = roomSchema.parse(req.body);
    const { name, seatsAmount, type } = receivedParsed;
    const updatedRoom = roomModel.update(roomId, {
      name,
      seatsAmount,
      type,
    });
    if (!updatedRoom) {
      res.status(404).json({ message: "Sala não encontrada" });
      return;
    }
    res.status(200).json(updatedRoom);
    return;
  } catch (err) {
    res.status(500).json({ message: "Erro ao atualizar sala" });
    return;
  }
};

const deleteRoom = (req: Request, res: Response) => {
  try {
    const roomId = parseInt(req.params.id);
    const deletedRoom = roomModel.delete(roomId);
    if (!deletedRoom) {
      res.status(404).json({ message: "Sala não encontrada" });
      return;
    }
    res.status(200).json(deletedRoom);
    return;
  } catch (err) {
    res.status(500).json({ message: "Erro ao deletar sala" });
    return;
  }
};

export default {
  index,
  show,
  create,
  update,
  delete: deleteRoom,
};
