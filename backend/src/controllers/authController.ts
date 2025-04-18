import bcrypt from "bcrypt";
import { Request, Response } from "express";
import usersModel from "../models/usersModel";
import jwt from "jsonwebtoken";
import { z } from "zod";

const JWT_SECRET = process.env.JWT_SECRET || "chave_secreta_padrao";

const registerSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  password: z
    .string()
    .min(8, "Senha deve ter pelo menos 8 caracteres")
    .regex(/[A-Z]/, "Senha deve conter pelo menos uma letra maiúscula")
    .regex(/[a-z]/, "Senha deve conter pelo menos uma letra minúscula")
    .regex(/[0-9]/, "Senha deve conter pelo menos um número")
    .regex(/[\W_]/, "Senha deve conter pelo menos um caractere especial"),
  role: z.enum(["admin", "teacher"], {
    errorMap: () => ({
      message: "Função inválida, deve ser 'admin' ou 'teacher'",
    }),
  }),
});

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Senha deve ter pelo menos 8 caracteres"),
});

const register = (req: Request, res: Response) => {
  try {
    const parsedData = registerSchema.parse(req.body);
    const { name, email, password, role } = parsedData;

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = usersModel.createUser(name, email, hashedPassword, role);

    return res.status(201).json({ ...newUser, password: undefined });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ message: error.errors.map((e) => e.message) });
    }
    return res.status(500).json({ message: "Erro ao registrar usuário" });
  }
};

const login = (req: Request, res: Response) => {
  try {
    const parsedData = loginSchema.parse(req.body);
    const { email, password } = parsedData;

    const user = usersModel.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }

    const payload = { id: user.id, email: user.email, role: user.role };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

    return res.status(200).json({
      message: "Login realizado com sucesso",
      token,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ message: error.errors.map((e) => e.message) });
    }
    return res.status(500).json({ message: "Erro ao realizar login" });
  }
};

const profile = (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Usuário não autenticado" });
    }

    const user = usersModel.getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    return res.status(200).json({ ...user, password: undefined });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erro ao buscar perfil do usuário" });
  }
};

export default { register, login, profile };
