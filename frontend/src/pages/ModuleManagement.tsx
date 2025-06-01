import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Module, moduleService } from "@/services/moduleService";
import Header from "@/components/Header";
import { useUser } from "@/contexts/UserContext";
import { ModuleTable } from "@/components/modules/ModuleTable";
import { ModuleSearch } from "@/components/modules/ModuleSearch";
import { ModuleDialog } from "@/components/modules/ModuleDialog";
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
import { ModuleDisciplines } from "@/components/modules/ModuleDisciplines";

interface ModuleFormData {
  name: string;
  totalStudents: string;
}

interface ModuleFormErrors {
  name?: string;
  totalStudents?: string;
}

const ModuleManagement = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [moduleToDelete, setModuleToDelete] = useState<Module | null>(null);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [formData, setFormData] = useState<ModuleFormData>({
    name: "",
    totalStudents: "",
  });
  const [formErrors, setFormErrors] = useState<ModuleFormErrors>({});
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser, logout } = useUser();

  useEffect(() => {
    document.title = "TimeWise - Gerenciar Turmas";

    if (!currentUser) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para acessar esta página",
        variant: "destructive",
      });
      navigate("/");
      return;
    }

    if (currentUser.role !== "admin") {
      toast({
        title: "Erro",
        description: "Apenas administradores podem acessar esta página",
        variant: "destructive",
      });
      navigate("/dashboard");
      return;
    }

    loadModules();
  }, [currentUser, navigate, toast]);

  const loadModules = async () => {
    try {
      setIsLoading(true);
      const data = await moduleService.getAllModules();
      setModules(Array.isArray(data) ? data : []);
    } catch (error) {
      if (
        error instanceof Error &&
        (error.message.includes("Sessão expirada") ||
          error.message.includes("Token de autenticação não encontrado"))
      ) {
        logout();
        navigate("/");
      }

      toast({
        title: "Erro",
        description:
          error instanceof Error ? error.message : "Erro ao carregar turmas",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  const handleAddModule = () => {
    setEditingModule(null);
    setFormData({
      name: "",
      totalStudents: "",
    });
    setIsDialogOpen(true);
  };

  const handleEditModule = (module: Module) => {
    setEditingModule(module);
    setFormData({
      name: module.name,
      totalStudents: module.totalStudents.toString(),
    });
    setIsDialogOpen(true);
  };

  const handleViewDisciplines = (module: Module) => {
    if (selectedModule?.id === module.id) {
      setSelectedModule(null);
    } else {
      setSelectedModule(module);
    }
  };

  const handleDeleteClick = (module: Module) => {
    setModuleToDelete(module);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!moduleToDelete) return;

    try {
      await moduleService.deleteModule(moduleToDelete.id);
      toast({
        title: "Sucesso",
        description: "Turma excluída com sucesso",
      });
      loadModules();
    } catch (error) {
      toast({
        title: "Erro",
        description:
          error instanceof Error ? error.message : "Erro ao excluir turma",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setModuleToDelete(null);
    }
  };

  const validateForm = () => {
    const errors: ModuleFormErrors = {};

    if (!formData.name) {
      errors.name = "Nome é obrigatório";
    }

    if (!formData.totalStudents) {
      errors.totalStudents = "Total de alunos é obrigatório";
    } else {
      const totalStudents = parseInt(formData.totalStudents);
      if (isNaN(totalStudents) || totalStudents <= 0) {
        errors.totalStudents = "Total de alunos deve ser maior que zero";
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
      const moduleData = {
        name: formData.name,
        totalStudents: parseInt(formData.totalStudents),
      };

      if (editingModule) {
        await moduleService.updateModule(editingModule.id, moduleData);
        toast({
          title: "Sucesso",
          description: "Turma atualizada com sucesso",
        });
      } else {
        await moduleService.createModule(moduleData);
        toast({
          title: "Sucesso",
          description: "Turma criada com sucesso",
        });
      }

      setIsDialogOpen(false);
      loadModules();
    } catch (error) {
      toast({
        title: "Erro",
        description:
          error instanceof Error ? error.message : "Erro ao salvar turma",
        variant: "destructive",
      });
    }
  };

  const filteredModules = (modules ?? []).filter((module) =>
    module.name.toLowerCase().includes(searchTerm.toLowerCase())
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
              Gerenciar Turmas
            </h1>
            <div className="h-1 w-24 bg-blue-500 mt-2 rounded-full"></div>
          </div>
          <Button
            onClick={handleAddModule}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            <Plus className="h-5 w-5 mr-1" /> Adicionar Turma
          </Button>
        </div>

        <ModuleSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <ModuleTable
              modules={filteredModules}
              isLoading={isLoading}
              onEdit={handleEditModule}
              onDelete={handleDeleteClick}
              onViewDisciplines={handleViewDisciplines}
            />
          </div>

          <div>
            {selectedModule ? (
              <ModuleDisciplines module={selectedModule} />
            ) : (
              <div className="flex items-center justify-center h-full min-h-[120px]">
                <span className="text-gray-500 text-sm text-center">
                  Selecione uma turma para ver suas disciplinas
                </span>
              </div>
            )}
          </div>
        </div>

        <ModuleDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          formData={formData}
          setFormData={setFormData}
          formErrors={formErrors}
          onSubmit={handleSubmit}
          isEditing={!!editingModule}
        />

        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir a turma {moduleToDelete?.name}?
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

export default ModuleManagement;
