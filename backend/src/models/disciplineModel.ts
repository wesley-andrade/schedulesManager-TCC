import prisma from "./prisma";
import { RoomType } from "@prisma/client";

const getAllDisciplines = async () => {
  return await prisma.discipline.findMany();
};

const getDisciplineById = async (id: number) => {
  return await prisma.discipline.findUnique({
    where: { id },
  });
};

const findByName = async (name: string) => {
  return await prisma.discipline.findFirst({ where: { name } });
};

const createDiscipline = async (
  name: string,
  totalHours: number,
  requiredRoomType: RoomType
) => {
  return await prisma.discipline.create({
    data: { name, totalHours, requiredRoomType },
  });
};

const updateDiscipline = async (
  id: number,
  updates: Partial<{
    name: string;
    totalHours: number;
    requiredRoomType: RoomType;
  }>
) => {
  return await prisma.discipline.update({
    where: { id },
    data: updates,
  });
};

const deleteDiscipline = async (id: number) => {
  await prisma.discipline.delete({ where: { id } });
  return true;
};

export default {
  getAllDisciplines,
  getDisciplineById,
  findByName,
  createDiscipline,
  updateDiscipline,
  deleteDiscipline,
};
