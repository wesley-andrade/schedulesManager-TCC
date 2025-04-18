import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../types";

const JWT_SECRET = process.env.JWT_SECRET || "chave_secreta_padrao";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Token não fornecido ou malformado" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as User;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido" });
  }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: "Usuário não autenticado" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Acesso negado: apenas administradores podem realizar esta ação",
    });
  }

  next();
};
