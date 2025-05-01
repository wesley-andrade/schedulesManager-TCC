import { Room } from "../types";
import { room } from "../data/mockData";

const getAllRooms = (): Room[] => {
  const rooms: Room[] = room.map((r) => r);
  return rooms;
};

const getRoomById = (id: number): Room | undefined => {
  const roomFound = room.find((d) => {
    d.id === id;
  });
  if (!roomFound) return undefined;
  return roomFound;
};

const create = (
  name: string,
  seatsAmount: number,
  type: string
): Room | undefined => {
  const newRoom: Room = {
    id: Math.floor(Math.random() * 9999),
    name,
    seatsAmount,
    type,
  };
  if (!newRoom) return undefined;
  room.push(newRoom);
  return newRoom;
};

const update = (
  id: number,
  updates: Partial<Omit<Room, "id">>
): Room | undefined => {
  const index = room.findIndex((r) => {
    r.id === id;
  });
  if (index === -1) return undefined;

  room[index] = { ...room[index], ...updates };
  return room[index];
};

const deleteRoom = (id: number): Room | undefined => {
  const index = room.findIndex((d) => {
    d.id === id;
  });
  if (index === -1) return undefined;
  const [deletedRoom] = room.splice(index, 1);
  return deletedRoom;
};

export default {
  getAllRooms,
  getRoomById,
  create,
  update,
  delete: deleteRoom,
};
