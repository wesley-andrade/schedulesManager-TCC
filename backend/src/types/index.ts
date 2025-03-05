export type Role = "admin" | "teacher";

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: Role;
}
