import { schedules } from "../data/mockData";
import { Schedule, TimeSlot } from "../types";
import timeSlotsModel from "./timeSlotsModel";

const getAllSchedules = (): (Omit<Schedule, "timeSlotId"> & {
  timeSlot?: TimeSlot;
})[] => {
  const timeSlots = timeSlotsModel.getAllTimeSlots();

  return schedules.map(({ timeSlotId, ...schedule }) => ({
    ...schedule,
    timeSlot: timeSlots.find((timeSlot) => timeSlot.id === timeSlotId),
  }));
};

const getScheduleById = (
  id: number
): (Omit<Schedule, "timeSlotId"> & { timeSlot?: TimeSlot }) | undefined => {
  const schedule = schedules.find((schedule) => schedule.id === id);
  if (!schedule) return undefined;

  const { timeSlotId, ...rest } = schedule;
  const timeSlot = timeSlotsModel.getTimeSlotById(timeSlotId);

  return { ...rest, timeSlot };
};

const createSchedule = (dayOfWeek: string, timeSlotId: number): Schedule => {
  const newSchedule: Schedule = {
    id: Math.floor(Math.random() * 9999),
    dayOfWeek,
    timeSlotId,
  };

  schedules.push(newSchedule);
  return newSchedule;
};

const updateSchedule = (
  id: number,
  updates: Partial<Omit<Schedule, "id">>
): Schedule | undefined => {
  const index = schedules.findIndex((schedule) => schedule.id === id);
  if (index === -1) return undefined;

  schedules[index] = { ...schedules[index], ...updates };
  return schedules[index];
};

const deleteSchedule = (id: number): boolean => {
  const index = schedules.findIndex((schedule) => schedule.id === id);
  if (index === -1) return false;

  schedules.splice(index, 1);
  return true;
};

export default {
  getAllSchedules,
  getScheduleById,
  createSchedule,
  updateSchedule,
  deleteSchedule,
};
