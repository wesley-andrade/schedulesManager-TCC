import bcrypt from "bcrypt";

import { User } from "../types";

export let users: User[] = [
  {
    id: 1,
    name: "Dr. João",
    email: "joao@medicina.com",
    password: bcrypt.hashSync("12345678", 10),
    role: "teacher"
  },
  {
    id: 2,
    name: "Admin",
    email: "admin@medicina.com",
    password: bcrypt.hashSync("12345678", 10),
    role: "admin"
  }
];
