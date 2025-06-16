import prisma from "./prisma";

const getAllModules = async () => {
  return await prisma.module.findMany();
};

const getModuleById = async (id: number) => {
  return await prisma.module.findUnique({
    where: { id },
  });
};

const createModule = async (name: string, totalStudents: number) => {
  return await prisma.module.create({
    data: { name, totalStudents },
  });
};

const updateModule = async (
  id: number,
  updates: { name?: string; totalStudents?: number }
) => {
  return await prisma.module.update({
    where: { id },
    data: updates,
  });
};

const deleteModule = async (id: number) => {
  const module = await prisma.module.findUnique({
    where: { id },
    include: {
      disciplineModules: true,
    },
  });

  if (!module) {
    throw new Error("Módulo não encontrado");
  }

  if (module.disciplineModules.length > 0) {
    throw new Error(
      "Não é possível excluir este módulo pois ele possui disciplinas vinculadas"
    );
  }

  await prisma.module.delete({
    where: { id },
  });

  return true;
};

export default {
  getAllModules,
  getModuleById,
  createModule,
  updateModule,
  deleteModule,
};
