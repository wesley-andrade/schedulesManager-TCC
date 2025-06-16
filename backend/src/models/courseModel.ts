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
  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      disciplines: true,
    },
  });

  if (!course) {
    throw new Error("Curso não encontrado");
  }

  if (course.disciplines.length > 0) {
    throw new Error(
      "Não é possível excluir este curso pois ele possui disciplinas vinculadas"
    );
  }

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
