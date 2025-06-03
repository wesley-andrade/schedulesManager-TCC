import { ReactNode, createContext, useContext, useState } from "react";
import { api } from "@/services/api";

export type UserRole = "admin" | "standard";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

interface LoginResponse {
  message: string;
  user: User;
  token: string;
}

interface UserContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      return JSON.parse(savedUser);
    }
    return null;
  });

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await api.post<LoginResponse>("/auth/login", {
        email,
        password,
      });

      const userData = response.data;
      setCurrentUser(userData.user);

      localStorage.setItem("timewise_token", userData.token);
      localStorage.setItem("user", JSON.stringify(userData.user));

      return true;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("timewise_token");
  };

  return (
    <UserContext.Provider
      value={{
        currentUser,
        login,
        logout,
        isAuthenticated: !!currentUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
