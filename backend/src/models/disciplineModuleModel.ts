import prisma from "./prisma";

const getAllDisciplinesModules = async () => {
  return await prisma.disciplineModule.findMany();
};

const getDisciplineModuleById = async (id: number) => {
  return await prisma.disciplineModule.findUnique({
    where: { id },
  });
};

const createDisciplineModule = async (
  disciplineId: number,
  moduleId: number,
  academicPeriodId: number
) => {
  return await prisma.disciplineModule.create({
    data: { disciplineId, moduleId, academicPeriodId },
  });
};

const deleteDisciplineModule = async (id: number) => {
  await prisma.disciplineModule.delete({ where: { id } });
  return true;
};

const findByDisciplineAndModule = async (
  disciplineId: number,
  moduleId: number
) => {
  return await prisma.disciplineModule.findFirst({
    where: {
      disciplineId,
      moduleId,
    },
  });
};

const findByDisciplineAndPeriod = async (
  disciplineId: number,
  academicPeriodId: number
) => {
  return await prisma.disciplineModule.findFirst({
    where: {
      disciplineId,
      academicPeriodId,
    },
  });
};

export default {
  getAllDisciplinesModules,
  getDisciplineModuleById,
  createDisciplineModule,
  deleteDisciplineModule,
  findByDisciplineAndModule,
  findByDisciplineAndPeriod,
};
