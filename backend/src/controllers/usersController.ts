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
    .regex(/[\W_]/, "Deve conter pelo menos um caractere especial")
    .optional(),
  role: z.nativeEnum(Role, {
    errorMap: () => ({ message: "Função inválida: 'admin' ou 'standard'" }),
  }),
  phone: z
    .string()
    .regex(/^\(?\d{2}\)?[\s-]?\d{4,5}-?\d{4}$/, "Telefone inválido")
    .optional(),
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
    const { name, email, password, role, phone } = parsedData;

    const updates: Partial<typeof parsedData> = {
      name: name ?? user.name,
      email: email ?? user.email,
      role: role ?? user.role,
      phone: phone ?? (user.teacher?.phone || undefined),
    };

    if (password) {
      updates.password = bcrypt.hashSync(password, 10);
    }

    const updatedUser = await userModel.updateUser(id, updates);
    const { password: _, teacher, ...userWithoutPassword } = updatedUser;

    res.status(200).json({
      ...userWithoutPassword,
      phone: teacher?.phone || null,
    });
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

    if (req.user?.id === id) {
      res
        .status(400)
        .json({ message: "Não é possível excluir seu próprio usuário" });
      return;
    }

    try {
      await userModel.deleteUser(id);
      res.status(204).end();
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Usuário não encontrado") {
          res.status(404).json({ message: error.message });
          return;
        }
        if (error.message.includes("Restrição de chave estrangeira")) {
          res.status(400).json({
            message:
              "Não é possível excluir este usuário pois ele possui registros vinculados no sistema",
          });
          return;
        }
      }
      throw error;
    }
  } catch (err) {
    next(err);
  }
};

export default {
  index,
  show,
  update,
  remove,
};
