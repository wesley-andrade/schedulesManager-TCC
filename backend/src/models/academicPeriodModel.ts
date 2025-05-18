import prisma from "./prisma";

const getAllAcademicPeriods = async () => {
  return await prisma.academicPeriod.findMany();
};

const getAcademicPeriodById = async (id: number) => {
  return await prisma.academicPeriod.findUnique({
    where: { id },
  });
};

const findByName = async (name: string) => {
  return prisma.academicPeriod.findFirst({ where: { name } });
};

const createAcademicPeriod = async (
  name: string,
  startDate: string,
  endDate: string
) => {
  return await prisma.academicPeriod.create({
    data: {
      name,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    },
  });
};

const updateAcademicPeriod = async (
  id: number,
  updates: { name?: string; startDate?: string; endDate?: string }
) => {
  return await prisma.academicPeriod.update({
    where: { id },
    data: {
      name: updates.name,
      startDate: updates.startDate ? new Date(updates.startDate) : undefined,
      endDate: updates.endDate ? new Date(updates.endDate) : undefined,
    },
  });
};

const deleteAcademicPeriod = async (id: number) => {
  await prisma.academicPeriod.delete({
    where: { id },
  });
  return true;
};

export default {
  getAllAcademicPeriods,
  getAcademicPeriodById,
  findByName,
  createAcademicPeriod,
  updateAcademicPeriod,
  deleteAcademicPeriod,
};
