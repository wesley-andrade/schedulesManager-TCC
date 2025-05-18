import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import userModel from "../models/userModel";
import jwt from "jsonwebtoken";
import { z } from "zod";
import dotenv from "dotenv";
import { Role } from "@prisma/client";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

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
  role: z.nativeEnum(Role, {
    errorMap: () => ({
      message: "Função inválida, deve ser 'admin' ou 'standard'",
    }),
  }),
  phone: z
    .string()
    .regex(/^\(?\d{2}\)?[\s-]?\d{4,5}-?\d{4}$/, "Telefone inválido")
    .optional(),
});

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Senha deve ter pelo menos 8 caracteres"),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(8, "Senha atual é obrigatória"),
  newPassword: z
    .string()
    .min(8, "Nova senha deve ter pelo menos 8 caracteres")
    .regex(/[A-Z]/, "Deve conter pelo menos uma letra maiúscula")
    .regex(/[a-z]/, "Deve conter pelo menos uma letra minúscula")
    .regex(/[0-9]/, "Deve conter pelo menos um número")
    .regex(/[\W_]/, "Deve conter pelo menos um caractere especial"),
});

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsedData = registerSchema.parse(req.body);
    const { name, email, password, role, phone } = parsedData;

    const exist = await userModel.getUserByEmail(email);
    if (exist) {
      res.status(409).json({ message: "Email já cadastrado" });
      return;
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = await userModel.createUser(
      name,
      email,
      hashedPassword,
      role,
      phone
    );

    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({ userWithoutPassword });
    return;
  } catch (err) {
    next(err);
    return;
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsedData = loginSchema.parse(req.body);
    const { email, password } = parsedData;

    const user = await userModel.getUserByEmail(email);
    if (!user) {
      res.status(401).json({ message: "Credenciais inválidas" });
      return;
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Credenciais inválidas" });
      return;
    }

    const payload = { id: user.id, email: user.email, role: user.role };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "2h" });

    res.status(200).json({
      message: "Login realizado com sucesso",
      token,
    });
    return;
  } catch (err) {
    next(err);
    return;
  }
};

const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "Usuário não autenticado" });
      return;
    }

    const parsed = changePasswordSchema.parse(req.body);
    const { currentPassword, newPassword } = parsed;

    const user = await userModel.getUserById(userId);
    if (!user) {
      res.status(404).json({ message: "Usuário não encontrado" });
      return;
    }

    const isPasswordCorrect = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordCorrect) {
      res.status(401).json({ message: "Senha atual incorreta" });
      return;
    }

    const newHashedPassword = await bcrypt.hash(newPassword, 10);
    await userModel.updateUser(userId, { password: newHashedPassword });

    res.status(200).json({ message: "Senha alterada com sucesso" });
    return;
  } catch (err) {
    next(err);
    return;
  }
};

const profile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "Usuário não autenticado" });
      return;
    }

    const user = await userModel.getUserById(userId);
    if (!user) {
      res.status(404).json({ message: "Usuário não encontrado" });
      return;
    }

    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({ userWithoutPassword });
    return;
  } catch (err) {
    next(err);
    return;
  }
};

export default { register, login, changePassword, profile };
