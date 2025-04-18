import { teachers } from "../data/mockData";
import { Teacher } from "../types";

const getAllTeachers = (): Teacher[] => {
  return teachers;
};

const getTeacherById = (id: number): Teacher | undefined => {
  return teachers.find((teacher) => teacher.id === id);
};

const createTeacher = (userId: number, phone: string): Teacher => {
  const newTeacher: Teacher = {
    id: Math.floor(Math.random() * 9999),
    userId,
    phone,
  };

  teachers.push(newTeacher);
  return newTeacher;
};

const updateTeacher = (
  id: number,
  updates: Partial<Omit<Teacher, "id" | "userId">>
): Teacher | undefined => {
  const index = teachers.findIndex((teacher) => teacher.id === id);
  if (index === -1) return undefined;

  teachers[index] = { ...teachers[index], ...updates };
  return teachers[index];
};

const deleteTeacher = (id: number): boolean => {
  const index = teachers.findIndex((teacher) => teacher.id === id);
  if (index === -1) return false;

  teachers.splice(index, 1);
  return true;
};

export default {
  getAllTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
};
