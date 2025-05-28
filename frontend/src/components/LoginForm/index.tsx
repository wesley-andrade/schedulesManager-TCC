import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { LoginFormProps } from "./types";
import { validateLoginForm, LoginFormErrors } from "./utils";

const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validationErrors = validateLoginForm({ email, password });
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const success = await login(email, password);
      if (success) {
        toast({
          title: "Login realizado",
          description: "Bem-vindo ao TimeWise!",
        });
        onSuccess?.();
        navigate("/dashboard");
      }
    } catch (error) {
      toast({
        title: "Erro no login",
        description:
          error instanceof Error
            ? error.message
            : "Usuário ou senha incorretos",
        variant: "destructive",
      });
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">Usuário</Label>
        <div className="relative">
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors({ ...errors, email: undefined });
            }}
            className={`h-12 pl-10 ${errors.email ? "border-red-500" : ""}`}
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <User size={18} />
          </div>
        </div>
        {errors.email && (
          <p className="text-sm text-red-500 mt-1">{errors.email}</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Senha</Label>
        </div>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors({ ...errors, password: undefined });
            }}
            className={`h-12 pr-10 ${errors.password ? "border-red-500" : ""}`}
          />
          <button
            type="button"
            onClick={toggleShowPassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && errors.password.length > 0 && (
          <div className="mt-2 space-y-1">
            <p className="text-sm font-medium text-red-500">
              A senha deve conter:
            </p>
            <ul className="text-sm text-red-500 list-disc list-inside space-y-1">
              {errors.password.map((error, index) => (
                <li key={index}>{error.message}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <Button
        type="submit"
        className="w-full h-12 bg-blue-500 hover:bg-blue-600 transition-colors"
      >
        ENTRAR
      </Button>
    </form>
  );
};

export default LoginForm;
