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
  const [startYear, startMonth, startDay] = startDate.split("-").map(Number);
  const [endYear, endMonth, endDay] = endDate.split("-").map(Number);

  const adjustedStartDate = new Date(startYear, startMonth - 1, startDay);
  const adjustedEndDate = new Date(endYear, endMonth - 1, endDay);

  return await prisma.academicPeriod.create({
    data: {
      name,
      startDate: adjustedStartDate,
      endDate: adjustedEndDate,
    },
  });
};

const updateAcademicPeriod = async (
  id: number,
  updates: { name?: string; startDate?: string; endDate?: string }
) => {
  const data: any = { name: updates.name };

  if (updates.startDate) {
    const [year, month, day] = updates.startDate.split("-").map(Number);
    data.startDate = new Date(year, month - 1, day);
  }

  if (updates.endDate) {
    const [year, month, day] = updates.endDate.split("-").map(Number);
    data.endDate = new Date(year, month - 1, day);
  }

  return await prisma.academicPeriod.update({
    where: { id },
    data,
  });
};

const deleteAcademicPeriod = async (id: number) => {
  const period = await prisma.academicPeriod.findUnique({
    where: { id },
    include: {
      modules: true,
    },
  });

  if (!period) {
    throw new Error("Período acadêmico não encontrado");
  }

  if (period.modules.length > 0) {
    throw new Error(
      "Não é possível excluir este período acadêmico pois ele possui módulos vinculados"
    );
  }

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
