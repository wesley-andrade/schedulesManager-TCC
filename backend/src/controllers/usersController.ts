import bcrypt from "bcrypt";
import { Request, Response } from "express";
import usersModel from "../models/usersModel";

const index = (req: Request, res: Response) => {
  try {
    const users = usersModel.getAllUsers();
    return res.json({ users });
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

    return res.json({ ...user, password: undefined });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao buscar usuário" });
  }
};

const update = (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { name, email, password, role } = req.body;

    const user = usersModel.getUserById(parseInt(id));
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    const updates = {
      name,
      email,
      password: bcrypt.hashSync(password, 10),
      role
    };

    const updatedUser = usersModel.updateUser(parseInt(id), updates);
    return res.json({ ...updatedUser, password: undefined });
  } catch (error) {
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
  delete: deleteUser
};
