import { timeSlots } from "../data/mockData";
import { TimeSlot } from "../types";

const getAllTimeSlots = (): TimeSlot[] => {
  return timeSlots;
};

const getTimeSlotById = (id: number): TimeSlot | undefined => {
  return timeSlots.find((timeSlot) => timeSlot.id === id);
};

const createTimeSlot = (startTime: string, endTime: string): TimeSlot => {
  const newTimeSlot: TimeSlot = {
    id: Math.floor(Math.random() * 9999),
    startTime,
    endTime,
  };

  timeSlots.push(newTimeSlot);
  return newTimeSlot;
};

const updateTimeSlot = (
  id: number,
  updates: Partial<Omit<TimeSlot, "id">>
): TimeSlot | undefined => {
  const index = timeSlots.findIndex((timeSlot) => timeSlot.id === id);
  if (index === -1) return undefined;

  timeSlots[index] = { ...timeSlots[index], ...updates };
  return timeSlots[index];
};

const deleteTimeSlot = (id: number): boolean => {
  const index = timeSlots.findIndex((timeSlot) => timeSlot.id === id);
  if (index === -1) return false;

  timeSlots.splice(index, 1);
  return true;
};

export default {
  getAllTimeSlots,
  getTimeSlotById,
  createTimeSlot,
  updateTimeSlot,
  deleteTimeSlot,
};
