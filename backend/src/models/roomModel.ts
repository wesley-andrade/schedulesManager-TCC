import { Room } from "../types";
import { rooms } from "../data/mockData";

const getAllRooms = (): Room[] => {
  const room: Room[] = rooms.map((r) => r);
  return room;
};

const getRoomById = (id: number): Room | undefined => {
  const roomFound = rooms.find((d) => {
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
  rooms.push(newRoom);
  return newRoom;
};

const update = (
  id: number,
  updates: Partial<Omit<Room, "id">>
): Room | undefined => {
  const index = rooms.findIndex((r) => {
    r.id === id;
  });
  if (index === -1) return undefined;

  rooms[index] = { ...rooms[index], ...updates };
  return rooms[index];
};

const deleteRoom = (id: number): Room | undefined => {
  const index = rooms.findIndex((d) => {
    d.id === id;
  });
  if (index === -1) return undefined;
  const [deletedRoom] = rooms.splice(index, 1);
  return deletedRoom;
};

export default {
  getAllRooms,
  getRoomById,
  create,
  update,
  delete: deleteRoom,
};
