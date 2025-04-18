import { users } from "../data/mockData";
import { Role, User } from "../types";

const getAllUsers = (): Omit<User, "password">[] => {
  return users.map(({ password, ...user }) => user);
};

const getUserById = (id: number): User | undefined => {
  return users.find(user => user.id === id);
};

const getUserByEmail = (email: string): User | undefined => {
  return users.find(user => user.email === email);
};

const createUser = (
  name: string,
  email: string,
  password: string,
  role: Role
): User => {
  const newUser: User = {
    id: Math.floor(Math.random() * 9999),
    name,
    email,
    password,
    role
  };
  users.push(newUser);
  return newUser;
};

const updateUser = (
  id: number,
  updates: Partial<Omit<User, "id">>
): User | undefined => {
  const index = users.findIndex(user => user.id === id);
  if (index === -1) return undefined;

  users[index] = { ...users[index], ...updates };
  return users[index];
};

const deleteUser = (id: number): boolean => {
  const index = users.findIndex(user => user.id === id);
  if (index === -1) return false;

  users.splice(index, 1);
  return true;
};

export default {
  getAllUsers,
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser
};
