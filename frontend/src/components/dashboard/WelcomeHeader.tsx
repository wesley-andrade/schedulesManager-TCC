import { User } from "@/services/userService";

interface WelcomeHeaderProps {
  user: User;
}

export const WelcomeHeader = ({ user }: WelcomeHeaderProps) => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800">
        Bem vindo, <span className="text-blue-500">{user.name}</span>
      </h1>
      <p className="text-gray-600 mt-1">
        {user.role === "admin"
          ? "Confira seus eventos e gerencie o sistema"
          : "Confira suas aulas e eventos no sistema"}
      </p>
      <div className="h-1 w-24 bg-blue-500 mt-2 rounded-full"></div>
    </div>
  );
};
