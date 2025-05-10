import { teacherAvailability } from "../data/mockData";
import { TeacherAvailability } from "../types";

const getAllTeacherAvailability = (): TeacherAvailability[] => {
  return [...teacherAvailability];
};

const getTeacherAvailabilityById = (
  id: number
): TeacherAvailability | undefined => {
  return teacherAvailability.find((availability) => availability.id === id);
};

const createTeacherAvailability = (
  teacherId: number,
  scheduleId: number,
  status: boolean
): TeacherAvailability => {
  const newAvailability: TeacherAvailability = {
    id: Math.floor(Math.random() * 9999),
    teacherId,
    scheduleId,
    status,
  };
  teacherAvailability.push(newAvailability);
  return newAvailability;
};

const updateTeacherAvailability = (
  id: number,
  updates: Partial<Omit<TeacherAvailability, "id">>
): TeacherAvailability | undefined => {
  const index = teacherAvailability.findIndex(
    (availability) => availability.id === id
  );
  if (index === -1) return undefined;

  teacherAvailability[index] = {
    ...teacherAvailability[index],
    ...updates,
  };

  return teacherAvailability[index];
};

const deleteTeacherAvailability = (id: number): boolean => {
  const index = teacherAvailability.findIndex(
    (availability) => availability.id === id
  );
  if (index === -1) return false;

  teacherAvailability.splice(index, 1);
  return true;
};

export default {
  getAllTeacherAvailability,
  getTeacherAvailabilityById,
  createTeacherAvailability,
  updateTeacherAvailability,
  deleteTeacherAvailability,
};
