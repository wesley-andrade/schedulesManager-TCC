import bcrypt from "bcrypt";
import { Request, Response } from "express";
import usersModel from "../models/usersModel";
import { z } from "zod";

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
  role: z.enum(["admin", "teacher"], {
    errorMap: () => ({ message: "Função inválida: 'admin' ou 'teacher'" }),
  }),
});

const index = (req: Request, res: Response) => {
  try {
    const users = usersModel.getAllUsers();
    return res.status(200).json({ users });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao buscar usuários" });
  }
};

const show = (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const user = usersModel.getUserById(Number(id));

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    return res.status(200).json({ ...user, password: undefined });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao buscar usuário" });
  }
};

const update = (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    const user = usersModel.getUserById(id);
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    const parsedData = updateUserSchema.parse(req.body);
    const { name, email, password, role } = parsedData;

    const hashedPassword = bcrypt.hashSync(password, 10);

    const updates = {
      name,
      email,
      password: hashedPassword,
      role,
    };

    const updatedUser = usersModel.updateUser(id, updates);
    return res.status(200).json({ ...updatedUser, password: undefined });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ message: error.errors.map((e) => e.message) });
    }
    return res.status(500).json({ message: "Erro ao atualizar usuário" });
  }
};

const deleteUser = (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const success = usersModel.deleteUser(parseInt(id));
    if (!success) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: "Erro ao deletar usuário" });
  }
};

export default {
  index,
  show,
  update,
  delete: deleteUser,
};
