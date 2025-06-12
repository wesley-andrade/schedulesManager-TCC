import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { disciplineService, Discipline } from "@/services/disciplineService";
import Header from "@/components/Header";
import { useUser } from "@/contexts/UserContext";
import { DisciplineTable } from "@/components/disciplines/DisciplineTable";
import { DisciplineDialog } from "@/components/disciplines/DisciplineDialog";
import { ROUTES } from "@/config/routes";
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
import { DisciplineSearch } from "@/components/disciplines/DisciplineSearch";
import { RoomType } from "@/services/roomService";
import { courseService, Course } from "@/services/courseService";
import { disciplineCourseService } from "@/services/disciplineCourseService";

interface DisciplineFormData {
  name: string;
  totalHours: string;
  requiredRoomType: RoomType | "";
  courseId: string;
}

interface DisciplineFormErrors {
  name?: string;
  totalHours?: string;
  requiredRoomType?: string;
  courseId?: string;
}

const DisciplineManagement = () => {
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [disciplineToDelete, setDisciplineToDelete] =
    useState<Discipline | null>(null);
  const [editingDiscipline, setEditingDiscipline] = useState<Discipline | null>(
    null
  );
  const [formData, setFormData] = useState<DisciplineFormData>({
    name: "",
    totalHours: "",
    requiredRoomType: "",
    courseId: "",
  });
  const [formErrors, setFormErrors] = useState<DisciplineFormErrors>({});
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser, logout } = useUser();
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    document.title = "TimeWise - Gerenciar Disciplinas";

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

    loadDisciplines();
    loadCourses();
  }, [currentUser, navigate, toast]);

  const loadDisciplines = async () => {
    try {
      setIsLoading(true);
      const data = await disciplineService.getAllDisciplines();
      setDisciplines(Array.isArray(data) ? data : []);
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
          error instanceof Error
            ? error.message
            : "Erro ao carregar disciplinas",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadCourses = async () => {
    try {
      const data = await courseService.getAllCourses();
      setCourses(Array.isArray(data) ? data : []);
    } catch (error) {
      toast({
        title: "Erro",
        description:
          error instanceof Error ? error.message : "Erro ao carregar cursos",
        variant: "destructive",
      });
    }
  };

  const handleBackToDashboard = () => {
    navigate(ROUTES.DASHBOARD);
  };

  const handleAddDiscipline = () => {
    setIsEditing(false);
    setFormData({
      name: "",
      totalHours: "",
      requiredRoomType: "",
      courseId: "",
    });
    setFormErrors({});
    setIsDialogOpen(true);
  };

  const handleEditDiscipline = (discipline: Discipline) => {
    setIsEditing(true);
    setFormData({
      name: discipline.name,
      totalHours: discipline.totalHours.toString(),
      requiredRoomType: discipline.requiredRoomType as RoomType,
      courseId: discipline.disciplineCourses?.[0]?.course?.id?.toString() || "",
    });
    setFormErrors({});
    setEditingDiscipline(discipline);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (discipline: Discipline) => {
    setDisciplineToDelete(discipline);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!disciplineToDelete) return;
    try {
      const associationId = disciplineToDelete.disciplineCourses?.[0]?.id;
      if (associationId) {
        await disciplineCourseService.deleteDisciplineCourse(associationId);
      }
      await disciplineService.deleteDiscipline(disciplineToDelete.id);
      toast({
        title: "Sucesso",
        description: "Disciplina excluída com sucesso",
      });
      loadDisciplines();
    } catch (error) {
      toast({
        title: "Erro",
        description:
          error instanceof Error ? error.message : "Erro ao excluir disciplina",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setDisciplineToDelete(null);
    }
  };

  const validateForm = () => {
    const errors: DisciplineFormErrors = {};
    if (!formData.name) errors.name = "Nome é obrigatório.";
    if (!formData.totalHours)
      errors.totalHours = "Carga horária é obrigatória.";
    else if (
      isNaN(Number(formData.totalHours)) ||
      Number(formData.totalHours) <= 0
    )
      errors.totalHours = "Informe um número válido.";
    if (!formData.requiredRoomType)
      errors.requiredRoomType = "Tipo de sala é obrigatório.";
    if (!formData.courseId) errors.courseId = "Curso é obrigatório.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleDialogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      if (isEditing && editingDiscipline) {
        const data = {
          name: formData.name,
          totalHours: Number(formData.totalHours),
          requiredRoomType: formData.requiredRoomType as RoomType,
        };
        await disciplineService.updateDiscipline(editingDiscipline.id, data);

        const associationId = editingDiscipline.disciplineCourses?.[0]?.id;
        if (associationId) {
          await disciplineCourseService.deleteDisciplineCourse(associationId);
        }

        await disciplineCourseService.createDisciplineCourse({
          disciplineId: editingDiscipline.id,
          courseId: Number(formData.courseId),
        });
      } else {
        const newDiscipline = await disciplineService.createDiscipline({
          name: formData.name,
          totalHours: Number(formData.totalHours),
          requiredRoomType: formData.requiredRoomType as RoomType,
        });
        await disciplineCourseService.createDisciplineCourse({
          disciplineId: newDiscipline.id,
          courseId: Number(formData.courseId),
        });
      }
      setIsDialogOpen(false);
      loadDisciplines();
    } catch (err: any) {
      setFormErrors({ name: err.message || "Erro ao salvar disciplina." });
    }
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setFormErrors({});
    }
  };

  const filteredDisciplines = disciplines.filter((discipline) =>
    discipline.name.toLowerCase().includes(searchTerm.toLowerCase())
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
              Gerenciar Disciplinas
            </h1>
            <div className="h-1 w-24 bg-blue-500 mt-2 rounded-full"></div>
          </div>
          <Button
            onClick={handleAddDiscipline}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            <Plus className="h-5 w-5 mr-1" /> Adicionar Disciplina
          </Button>
        </div>
        <DisciplineSearch
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
        <DisciplineTable
          disciplines={filteredDisciplines}
          isLoading={isLoading}
          onEdit={handleEditDiscipline}
          onDelete={handleDeleteClick}
        />
        <DisciplineDialog
          open={isDialogOpen}
          onOpenChange={handleDialogOpenChange}
          formData={formData}
          setFormData={setFormData}
          formErrors={formErrors}
          onSubmit={handleDialogSubmit}
          isEditing={!!editingDiscipline}
          courses={courses}
        />
        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir a disciplina "
                {disciplineToDelete?.name}"? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm}>
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default DisciplineManagement;
