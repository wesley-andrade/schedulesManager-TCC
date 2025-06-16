import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { User, userService } from "@/services/userService";
import Header from "@/components/Header";
import { useUser } from "@/contexts/UserContext";
import { UserTable } from "@/components/users/UserTable";
import { UserSearch } from "@/components/users/UserSearch";
import { UserDialog } from "@/components/users/UserDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  validateEmail,
  validatePassword,
  validatePhone,
  PasswordValidationError,
} from "@/utils/validators";
import { ROUTES } from "@/config/routes";

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

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    email: "",
    phone: "",
    role: "standard",
    password: "",
  });
  const [formErrors, setFormErrors] = useState<UserFormErrors>({});
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser, logout } = useUser();

  useEffect(() => {
    document.title = "TimeWise - Gerenciar Usuários";

    if (!currentUser) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para acessar esta página",
        variant: "destructive",
      });
      navigate(ROUTES.HOME);
      return;
    }

    if (currentUser.role !== "admin") {
      toast({
        title: "Erro",
        description: "Apenas administradores podem acessar esta página",
        variant: "destructive",
      });
      navigate(ROUTES.DASHBOARD);
      return;
    }

    loadUsers();
  }, [currentUser, navigate, toast]);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (error) {
      if (
        error instanceof Error &&
        (error.message.includes("Sessão expirada") ||
          error.message.includes("Token de autenticação não encontrado"))
      ) {
        logout();
        navigate(ROUTES.HOME);
      }

      toast({
        title: "Erro",
        description:
          error instanceof Error ? error.message : "Erro ao carregar usuários",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    navigate(ROUTES.DASHBOARD);
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      role: "standard",
      password: "",
    });
    setIsDialogOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      role: user.role,
      password: "",
    });
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    try {
      await userService.deleteUser(userToDelete.id);
      toast({
        title: "Sucesso",
        description: "Usuário excluído com sucesso",
      });
      loadUsers();
    } catch (error) {
      toast({
        title: "Erro",
        description:
          error instanceof Error ? error.message : "Erro ao excluir usuário",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const validateForm = () => {
    const errors: UserFormErrors = {};

    if (!formData.name) {
      errors.name = "Nome é obrigatório";
    }

    const emailError = validateEmail(formData.email);
    if (emailError) {
      errors.email = emailError;
    }

    if (!editingUser || formData.password) {
      const passwordErrors = validatePassword(formData.password);
      if (passwordErrors.length > 0) {
        errors.password = passwordErrors;
      }
    }

    if (formData.role === "standard") {
      const phoneError = validatePhone(formData.phone);
      if (phoneError) {
        errors.phone = phoneError;
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (editingUser) {
        await userService.updateUser(editingUser.id, formData);
        toast({
          title: "Sucesso",
          description: "Usuário atualizado com sucesso",
        });
        setIsDialogOpen(false);
        loadUsers();
      } else {
        await userService.createUser(formData);
        toast({
          title: "Sucesso",
          description: "Usuário criado com sucesso",
        });
        setIsDialogOpen(false);
        loadUsers();
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "email já está cadastrado") {
          setFormErrors((prev) => ({
            ...prev,
            email: "Este email já está cadastrado no sistema",
          }));
          return;
        }
      }

      toast({
        title: "Erro",
        description:
          error instanceof Error ? error.message : "Erro ao salvar usuário",
        variant: "destructive",
      });
    }
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setFormErrors({});
    }
  };

  const handleFormDataChange = (data: Partial<UserFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleFormErrorsChange = (errors: UserFormErrors) => {
    setFormErrors((prev) => ({ ...prev, ...errors }));
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />

      <div className="flex-1 container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <Button
              variant="ghost"
              className="mb-2 p-0 hover:bg-transparent text-blue-500 hover:text-blue-700"
              onClick={handleBackToDashboard}
            >
              &larr; Voltar ao Dashboard
            </Button>
            <h1 className="text-2xl font-bold text-gray-800">
              Gerenciar Usuários
            </h1>
            <div className="h-1 w-24 bg-blue-500 mt-2 rounded-full"></div>
          </div>
          <Button
            onClick={handleAddUser}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            <Plus className="h-5 w-5 mr-1" /> Adicionar Usuário
          </Button>
        </div>

        <UserSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />

        <UserTable
          users={filteredUsers}
          isLoading={isLoading}
          onEdit={handleEditUser}
          onDelete={handleDeleteClick}
        />

        <UserDialog
          isOpen={isDialogOpen}
          onOpenChange={handleDialogOpenChange}
          editingUser={editingUser}
          formData={formData}
          formErrors={formErrors}
          onFormDataChange={handleFormDataChange}
          onFormErrorsChange={handleFormErrorsChange}
          onSubmit={handleSubmit}
        />

        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir o usuário {userToDelete?.name}?
                Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default UserManagement;
