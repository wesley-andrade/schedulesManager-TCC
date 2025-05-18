import { Role } from "@prisma/client";
import prisma from "./prisma";

const getAllUsers = async () => {
  const users = await prisma.user.findMany();
  return users.map(({ password, ...rest }) => rest);
};

const getUserById = async (id: number) => {
  return await prisma.user.findUnique({ where: { id } });
};

const getUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({ where: { email } });
};

const createUser = async (
  name: string,
  email: string,
  password: string,
  role: Role,
  phone?: string
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
  }>
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
  await prisma.user.delete({ where: { id } });
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
