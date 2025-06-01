import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AcademicPeriod,
  academicPeriodService,
} from "@/services/academicPeriodService";
import Header from "@/components/Header";
import { useUser } from "@/contexts/UserContext";
import { AcademicPeriodTable } from "@/components/academic-periods/AcademicPeriodTable";
import { AcademicPeriodSearch } from "@/components/academic-periods/AcademicPeriodSearch";
import { AcademicPeriodDialog } from "@/components/academic-periods/AcademicPeriodDialog";
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

interface AcademicPeriodFormData {
  name: string;
  startDate: string;
  endDate: string;
}

interface AcademicPeriodFormErrors {
  name?: string;
  startDate?: string;
  endDate?: string;
}

const AcademicPeriodManagement = () => {
  const [periods, setPeriods] = useState<AcademicPeriod[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [periodToDelete, setPeriodToDelete] = useState<AcademicPeriod | null>(
    null
  );
  const [editingPeriod, setEditingPeriod] = useState<AcademicPeriod | null>(
    null
  );
  const [formData, setFormData] = useState<AcademicPeriodFormData>({
    name: "",
    startDate: "",
    endDate: "",
  });
  const [formErrors, setFormErrors] = useState<AcademicPeriodFormErrors>({});
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser, logout } = useUser();

  useEffect(() => {
    document.title = "TimeWise - Gerenciar Períodos Acadêmicos";

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

    loadPeriods();
  }, [currentUser, navigate, toast]);

  const loadPeriods = async () => {
    try {
      setIsLoading(true);
      const data = await academicPeriodService.getAllAcademicPeriods();
      setPeriods(Array.isArray(data) ? data : []);
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
          error instanceof Error
            ? error.message
            : "Erro ao carregar períodos acadêmicos",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  const handleAddPeriod = () => {
    setEditingPeriod(null);
    setFormData({
      name: "",
      startDate: "",
      endDate: "",
    });
    setIsDialogOpen(true);
  };

  const handleEditPeriod = (period: AcademicPeriod) => {
    setEditingPeriod(period);
    setFormData({
      name: period.name,
      startDate: period.startDate,
      endDate: period.endDate,
    });
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (period: AcademicPeriod) => {
    setPeriodToDelete(period);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!periodToDelete) return;

    try {
      await academicPeriodService.deletePeriod(periodToDelete.id);
      toast({
        title: "Sucesso",
        description: "Período acadêmico excluído com sucesso",
      });
      loadPeriods();
    } catch (error) {
      toast({
        title: "Erro",
        description:
          error instanceof Error
            ? error.message
            : "Erro ao excluir período acadêmico",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setPeriodToDelete(null);
    }
  };

  const validateForm = () => {
    const errors: AcademicPeriodFormErrors = {};

    if (!formData.name) {
      errors.name = "Nome é obrigatório";
    }

    if (!formData.startDate) {
      errors.startDate = "Data de início é obrigatória";
    }

    if (!formData.endDate) {
      errors.endDate = "Data de término é obrigatória";
    }

    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);

      if (startDate >= endDate) {
        errors.endDate =
          "A data de término deve ser posterior à data de início";
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
      if (editingPeriod) {
        await academicPeriodService.updatePeriod(editingPeriod.id, formData);
        toast({
          title: "Sucesso",
          description: "Período acadêmico atualizado com sucesso",
        });
      } else {
        await academicPeriodService.createPeriod(formData);
        toast({
          title: "Sucesso",
          description: "Período acadêmico criado com sucesso",
        });
      }

      setIsDialogOpen(false);
      loadPeriods();
    } catch (error) {
      toast({
        title: "Erro",
        description:
          error instanceof Error
            ? error.message
            : "Erro ao salvar período acadêmico",
        variant: "destructive",
      });
    }
  };

  const filteredPeriods = (periods ?? []).filter((period) =>
    period.name.toLowerCase().includes(searchTerm.toLowerCase())
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
              Gerenciar Períodos Acadêmicos
            </h1>
            <div className="h-1 w-24 bg-blue-500 mt-2 rounded-full"></div>
          </div>
          <Button
            onClick={handleAddPeriod}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            <Plus className="h-5 w-5 mr-1" /> Adicionar Período
          </Button>
        </div>

        <AcademicPeriodSearch
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <AcademicPeriodTable
          periods={filteredPeriods}
          isLoading={isLoading}
          onEdit={handleEditPeriod}
          onDelete={handleDeleteClick}
        />

        <AcademicPeriodDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          formData={formData}
          setFormData={setFormData}
          formErrors={formErrors}
          onSubmit={handleSubmit}
          isEditing={!!editingPeriod}
        />

        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir o período acadêmico{" "}
                {periodToDelete?.name}? Esta ação não pode ser desfeita.
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

export default AcademicPeriodManagement;
