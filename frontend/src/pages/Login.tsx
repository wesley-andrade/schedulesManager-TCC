import { useEffect } from "react";
import Logo from "@/components/Logo";
import LoginForm from "@/components/LoginForm";

const Login = () => {
  useEffect(() => {
    document.title = "TimeWise - Login";
  }, []);

  return (
    <div className="min-h-screen flex">
      <div className="hidden md:flex md:w-1/2 lg:w-2/5 bg-blue-400 rounded-r-[80px] items-center justify-center relative p-8">
        <div className="text-center text-white max-w-md">
          <Logo size="lg" variant="light" />
          <h2 className="text-2xl font-bold mt-10 mb-4">
            Gerencie horários com eficiência
          </h2>
          <p className="text-lg opacity-90">
            e proporcione clareza aos professores
          </p>
        </div>
      </div>

      <div className="w-full md:w-1/2 lg:w-3/5 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md bg-gray-50 rounded-2xl p-8 shadow-md">
          <h1 className="text-2xl font-bold mb-2">
            Bem Vindo ao <span className="text-blue-500">Login</span>
          </h1>
          <p className="text-gray-600 mb-8">
            Informe seus dados para acessar o sistema
          </p>

          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Login;
