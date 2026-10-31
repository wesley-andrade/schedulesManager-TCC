import { Role } from "@prisma/client";
import prisma from "./prisma";
import { NotFoundError } from "../errors/AppError";

const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    include: {
      teacher: true,
    },
  });

  return users.map(({ password, ...rest }) => ({
    ...rest,
    phone: rest.teacher?.phone || null,
  }));
};

const getUserById = async (id: number) => {
  return await prisma.user.findUnique({
    where: { id },
    include: {
      teacher: true,
    },
  });
};

const getUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({ where: { email } });
};

const createUser = async (
  name: string,
  email: string,
  password: string,
  role: Role,
  phone?: string,
) => {
  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password,
      role,
      teacher:
        role === "standard"
          ? {
              create: {
                phone: phone || "",
              },
            }
          : undefined,
    },
    include: {
      teacher: true,
    },
  });

  return newUser;
};

const updateUser = async (
  id: number,
  updates: Partial<{
    name: string;
    email: string;
    password: string;
    role: Role;
    phone?: string;
  }>,
) => {
  const { phone, ...userUpdates } = updates;

  return await prisma.user.update({
    where: { id },
    data: {
      ...userUpdates,
      ...(phone !== undefined && {
        teacher: {
          update: {
            phone,
          },
        },
      }),
    },
    include: { teacher: true },
  });
};

const deleteUser = async (id: number) => {
  const user = await prisma.user.findUnique({
    where: { id },
    include: { teacher: true },
  });

  if (!user) {
    throw new NotFoundError("Usuário não encontrado");
  }

  await prisma.$transaction(async (tx) => {
    if (user.teacher) {
      await tx.teacher.delete({ where: { userId: id } });
    }

    await tx.user.delete({ where: { id } });
  });

  return true;
};

export default {
  getAllUsers,
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser,
};
