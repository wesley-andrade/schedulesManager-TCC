import { User } from "@/services/userService";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserForm } from "./UserForm";
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

interface UserDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingUser: User | null;
  formData: UserFormData;
  formErrors: UserFormErrors;
  onFormDataChange: (data: Partial<UserFormData>) => void;
  onFormErrorsChange: (errors: Partial<UserFormErrors>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const UserDialog = ({
  isOpen,
  onOpenChange,
  editingUser,
  formData,
  formErrors,
  onFormDataChange,
  onFormErrorsChange,
  onSubmit,
}: UserDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingUser ? "Editar Usuário" : "Adicionar Usuário"}
          </DialogTitle>
          <DialogDescription>
            {editingUser
              ? "Atualize as informações do usuário abaixo."
              : "Preencha as informações para adicionar um novo usuário."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <UserForm
            formData={formData}
            formErrors={formErrors}
            editingUser={editingUser}
            onFormDataChange={onFormDataChange}
            onFormErrorsChange={onFormErrorsChange}
          />
          <DialogFooter>
            <Button type="submit">
              {editingUser ? "Salvar Alterações" : "Adicionar Usuário"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
