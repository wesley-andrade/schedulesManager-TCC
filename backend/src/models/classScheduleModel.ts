import { classSchedules, classScheduleRooms } from "../data/mockData";
import { ClassSchedule, ClassScheduleRoom } from "../types";

const getAllClassSchedules = (): ClassSchedule[] => {
  return classSchedules;
};

const getClassScheduleById = (id: number): ClassSchedule | undefined => {
  return classSchedules.find((cs) => cs.id === id);
};

const createClassSchedule = (
  scheduleId: number,
  disciplineTeacherId: number,
  date: string
): ClassSchedule => {
  const newClassSchedule: ClassSchedule = {
    id: classSchedules.length + 1,
    scheduleId,
    disciplineTeacherId,
    date,
  };

  classSchedules.push(newClassSchedule);
  return newClassSchedule;
};

const updateClassSchedule = (
  id: number,
  newScheduleId: number,
  newDate: string
): ClassSchedule | undefined => {
  const csIndex = classSchedules.findIndex((cs) => cs.id === id);
  if (csIndex === -1) return undefined;

  classSchedules[csIndex].scheduleId = newScheduleId;
  classSchedules[csIndex].date = newDate;

  const roomEntry = classScheduleRooms.find(
    (csr) => csr.classScheduleId === id
  );
  if (roomEntry) {
    roomEntry.scheduleId = newScheduleId;
    roomEntry.date = newDate;
  }

  return classSchedules[csIndex];
};

const deleteClassSchedule = (id: number): boolean => {
  const index = classSchedules.findIndex((cs) => cs.id === id);
  if (index === -1) return false;
  classSchedules.splice(index, 1);

  const roomIndex = classScheduleRooms.findIndex(
    (r) => r.classScheduleId === id
  );
  if (roomIndex !== -1) classScheduleRooms.splice(roomIndex, 1);

  return true;
};

const createClassScheduleRoom = (
  classScheduleId: number,
  roomId: number,
  scheduleId: number,
  date: string
): ClassScheduleRoom => {
  const newEntry: ClassScheduleRoom = {
    id: Math.floor(Math.random() * 9999),
    classScheduleId,
    roomId,
    scheduleId,
    date,
  };

  classScheduleRooms.push(newEntry);
  return newEntry;
};

const clearAllClassSchedules = (): void => {
  classSchedules.length = 0;
  classScheduleRooms.length = 0;
};

export default {
  getAllClassSchedules,
  getClassScheduleById,
  createClassSchedule,
  updateClassSchedule,
  deleteClassSchedule,
  createClassScheduleRoom,
  clearAllClassSchedules,
};
