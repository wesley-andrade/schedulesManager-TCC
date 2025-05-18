import prisma from "./prisma";

const getAllCourses = async () => {
  return await prisma.course.findMany();
};

const getCourseById = async (id: number) => {
  return await prisma.course.findUnique({
    where: { id },
  });
};

const findByName = async (name: string) => {
  return await prisma.course.findFirst({
    where: { name },
  });
};

const createCourse = async (name: string) => {
  return await prisma.course.create({
    data: { name },
  });
};

const updateCourse = async (id: number, updates: { name: string }) => {
  return await prisma.course.update({
    where: { id },
    data: updates,
  });
};

const deleteCourse = async (id: number) => {
  await prisma.course.delete({
    where: { id },
  });
  return true;
};

export default {
  getAllCourses,
  getCourseById,
  findByName,
  createCourse,
  updateCourse,
  deleteCourse,
};
