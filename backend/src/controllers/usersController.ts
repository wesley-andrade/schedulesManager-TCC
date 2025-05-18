import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import userModel from "../models/userModel";
import { z } from "zod";
import { Role } from "@prisma/client";

const updateUserSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  password: z
    .string()
    .min(8, "Senha deve ter pelo menos 8 caracteres")
    .regex(/[A-Z]/, "Deve conter pelo menos uma letra maiúscula")
    .regex(/[a-z]/, "Deve conter pelo menos uma letra minúscula")
    .regex(/[0-9]/, "Deve conter pelo menos um número")
    .regex(/[\W_]/, "Deve conter pelo menos um caractere especial"),
  role: z.nativeEnum(Role, {
    errorMap: () => ({ message: "Função inválida: 'admin' ou 'teacher'" }),
  }),
});

const index = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userModel.getAllUsers();

    res.status(200).json({ users });
    return;
  } catch (err) {
    next(err);
    return;
  }
};

const show = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ message: "ID inválido" });
      return;
    }

    const user = await userModel.getUserById(Number(id));

    if (!user) {
      res.status(404).json({ message: "Usuário não encontrado" });
      return;
    }

    res.status(200).json({ ...user, password: undefined });
    return;
  } catch (err) {
    next(err);
    return;
  }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ message: "ID inválido" });
      return;
    }

    const user = await userModel.getUserById(id);
    if (!user) {
      res.status(404).json({ message: "Usuário não encontrado" });
      return;
    }

    const parsedData = updateUserSchema.partial().parse(req.body);
    const { name, email, password, role } = parsedData;

    const updates: Partial<typeof parsedData> = {
      name: name ?? user.name,
      email: email ?? user.email,
      role: role ?? user.role,
    };

    if (password) {
      updates.password = bcrypt.hashSync(password, 10);
    }

    const updatedUser = await userModel.updateUser(id, updates);

    res.status(200).json({ ...updatedUser, password: undefined });
    return;
  } catch (err) {
    next(err);
    return;
  }
};

const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ message: "ID inválido" });
      return;
    }

    await userModel.deleteUser(id);

    res.status(204).send();
    return;
  } catch (err) {
    next(err);
    return;
  }
};

export default {
  index,
  show,
  update,
  remove,
};
