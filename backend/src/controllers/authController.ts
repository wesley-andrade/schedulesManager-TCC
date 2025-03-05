import bcrypt from "bcrypt";
import { Request, Response } from "express";
import usersModel from "../models/usersModel";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "chave_secreta_padrao";

const register = (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res
        .status(400)
        .json({ message: "Todos os campos são obrigatórios" });
    }

    const newUser = usersModel.createUser(name, email, password, role);
    return res.status(201).json({ ...newUser, password: undefined });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao registrar usuário" });
  }
};

const login = (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (typeof email !== "string" || typeof password !== "string") {
      return res.status(400).json({ message: "Campos inválidos" });
    }

    const user = usersModel.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "Credenciais inválidas" });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Credenciais inválidas" });
    }

    const payload = { id: user.id, email: user.email, role: user.role };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });

    return res.json({ token });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao fazer login" });
  }
};

export default { register, login };
