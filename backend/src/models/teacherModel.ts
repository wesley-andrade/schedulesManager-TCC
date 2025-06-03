import prisma from "./prisma";

const getAllTeachers = async () => {
  const teachers = await prisma.teacher.findMany({ include: { user: true } });
  return teachers.map((teacher) => {
    if (teacher.user) {
      const { password, ...userWithoutPassword } = teacher.user;
      return { ...teacher, user: userWithoutPassword };
    }

    return teacher;
  });
};

const getTeacherById = async (id: number) => {
  const teacher = await prisma.teacher.findUnique({
    where: { id },
    include: { user: true },
  });
  if (teacher && teacher.user) {
    const { password, ...userWithoutPassword } = teacher.user;
    return { ...teacher, user: userWithoutPassword };
  }

  return teacher;
};

const createTeacher = async (userId: number, phone: string | null) => {
  return prisma.teacher.create({ data: { userId, phone } });
};

const updateTeacher = async (
  id: number,
  updates: Partial<{ phone: string }>
) => {
  return prisma.teacher.update({ where: { id }, data: updates });
};

const deleteTeacher = async (id: number) => {
  await prisma.teacher.delete({ where: { id } });
  return true;
};

export default {
  getAllTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
};
