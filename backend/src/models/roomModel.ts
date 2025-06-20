import prisma from "./prisma";
import { RoomType } from "@prisma/client";

const getAllRooms = async () => {
  return await prisma.room.findMany();
};

const getRoomById = async (id: number) => {
  return await prisma.room.findUnique({ where: { id } });
};

const createRoom = async (
  name: string,
  seatsAmount: number,
  type: RoomType
) => {
  return await prisma.room.create({ data: { name, seatsAmount, type } });
};

const updateRoom = async (
  id: number,
  updates: Partial<{ name: string; seatsAmount: number; type: RoomType }>
) => {
  return await prisma.room.update({ where: { id }, data: updates });
};

const deleteRoom = async (id: number) => {
  const room = await prisma.room.findUnique({
    where: { id },
    include: {
      usages: true,
    },
  });

  if (!room) {
    throw new Error("Sala não encontrada");
  }

  if (room.usages.length > 0) {
    throw new Error(
      "Não é possível excluir esta sala pois ela possui agendamentos vinculados"
    );
  }

  await prisma.room.delete({
    where: { id },
  });

  return true;
};

export default {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
};
