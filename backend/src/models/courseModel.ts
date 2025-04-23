import { Course } from "../types";
import { courses } from "../data/mockData";

const getAllCourses = (): Course[] => {
  return courses;
};

const getCourseById = (id: number): Course | undefined => {
  return courses.find((course) => course.id === id);
};

const createCourse = (name: string): Course => {
  const newCourse: Course = {
    id: Math.floor(Math.random() * 9999),
    name,
  };
  courses.push(newCourse);
  return newCourse;
};

const updateCourse = (
  id: number,
  updates: Partial<Omit<Course, "id">>
): Course | undefined => {
  const index = courses.findIndex((course) => course.id === id);
  if (index === -1) return undefined;

  courses[index] = { ...courses[index], ...updates };
  return courses[index];
};

const deleteCourse = (id: number): boolean => {
  const index = courses.findIndex((course) => course.id === id);
  if (index === -1) return false;

  courses.splice(index, 1);
  return true;
};

export default {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
};
