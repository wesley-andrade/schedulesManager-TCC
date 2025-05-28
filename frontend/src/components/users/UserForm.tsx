import { User } from "@/services/userService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PasswordValidationError } from "@/utils/validators";

interface UserFormData {
  name: string;
  email: string;
  phone: string;
  role: "standard" | "admin";
  password: string;
}

interface UserFormErrors {
  name?: string;
  email?: string;
  password?: PasswordValidationError[];
  phone?: string;
}

interface UserFormProps {
  formData: UserFormData;
  formErrors: UserFormErrors;
  editingUser: User | null;
  onFormDataChange: (data: Partial<UserFormData>) => void;
  onFormErrorsChange: (errors: Partial<UserFormErrors>) => void;
}

export const UserForm = ({
  formData,
  formErrors,
  editingUser,
  onFormDataChange,
  onFormErrorsChange,
}: UserFormProps) => {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => {
            onFormDataChange({ name: e.target.value });
            onFormErrorsChange({ name: undefined });
          }}
          className={formErrors.name ? "border-red-500" : ""}
          required
        />
        {formErrors.name && (
          <p className="text-sm text-red-500 mt-1">{formErrors.name}</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => {
            onFormDataChange({ email: e.target.value });
            onFormErrorsChange({ email: undefined });
          }}
          className={formErrors.email ? "border-red-500" : ""}
          required
        />
        {formErrors.email && (
          <p className="text-sm text-red-500 mt-1">{formErrors.email}</p>
        )}
      </div>

      {formData.role === "standard" && (
        <div className="grid gap-2">
          <Label htmlFor="phone">Telefone</Label>
          <PhoneInput
            id="phone"
            value={formData.phone}
            onValueChange={(value) => {
              onFormDataChange({ phone: value });
              onFormErrorsChange({ phone: undefined });
            }}
            className={formErrors.phone ? "border-red-500" : ""}
          />
          {formErrors.phone && (
            <p className="text-sm text-red-500 mt-1">{formErrors.phone}</p>
          )}
        </div>
      )}

      <div className="grid gap-2">
        <Label htmlFor="role">Tipo de Usuário</Label>
        <Select
          value={formData.role}
          onValueChange={(value: "admin" | "standard") => {
            onFormDataChange({
              role: value,
              ...(value === "admin" && { phone: "" }),
            });
            if (value === "admin") {
              onFormErrorsChange({ phone: undefined });
            }
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Administrador</SelectItem>
            <SelectItem value="standard">Padrão</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="password">
          {editingUser ? "Nova Senha (opcional)" : "Senha"}
        </Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => {
            onFormDataChange({ password: e.target.value });
            onFormErrorsChange({ password: undefined });
          }}
          className={formErrors.password ? "border-red-500" : ""}
          required={!editingUser}
          minLength={8}
          placeholder={
            editingUser ? "Deixe em branco para manter a senha atual" : ""
          }
        />
        {formErrors.password && formErrors.password.length > 0 && (
          <div className="mt-2 space-y-1">
            <p className="text-sm font-medium text-red-500">
              A senha deve conter:
            </p>
            <ul className="text-sm text-red-500 list-disc list-inside space-y-1">
              {formErrors.password.map((error, index) => (
                <li key={index}>{error.message}</li>
              ))}
            </ul>
          </div>
        )}
        {editingUser && !formErrors.password && (
          <p className="text-sm text-gray-500">
            Deixe em branco para manter a senha atual
          </p>
        )}
      </div>
    </div>
  );
};
