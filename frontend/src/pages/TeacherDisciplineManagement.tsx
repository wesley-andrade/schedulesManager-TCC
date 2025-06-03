import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { ROUTES } from "@/config/routes";
import { Teacher, teacherService } from "@/services/teacherService";
import { TeacherTable } from "@/components/teacher-disciplines/TeacherTable";
import { TeacherDisciplines } from "@/components/teacher-disciplines/TeacherDisciplines";
import { TeacherSearch } from "@/components/teacher-disciplines/TeacherSearch";

const TeacherDisciplineManagement = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const { currentUser, logout } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "TimeWise - Gerenciar Professores";

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

    loadTeachers();
  }, [currentUser, navigate, toast]);

  const loadTeachers = async () => {
    try {
      setIsLoading(true);
      const data = await teacherService.getAllTeachers();
      setTeachers(Array.isArray(data) ? data : []);
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
            : "Erro ao carregar professores",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    navigate(ROUTES.DASHBOARD);
  };

  const handleViewDisciplines = (teacher: Teacher) => {
    if (selectedTeacher?.id === teacher.id) {
      setSelectedTeacher(null);
    } else {
      setSelectedTeacher(teacher);
    }
  };

  const filteredTeachers = teachers.filter((teacher) =>
    teacher.user?.name.toLowerCase().includes(searchTerm.toLowerCase())
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
              Gerenciar Disciplinas dos Professores
            </h1>
            <div className="h-1 w-24 bg-blue-500 mt-2 rounded-full"></div>
          </div>
        </div>

        <TeacherSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <TeacherTable
              teachers={filteredTeachers}
              isLoading={isLoading}
              onViewDisciplines={handleViewDisciplines}
            />
          </div>

          <div>
            {selectedTeacher ? (
              <TeacherDisciplines teacher={selectedTeacher} />
            ) : (
              <div className="flex items-center justify-center h-full min-h-[120px]">
                <span className="text-gray-500 text-sm text-center">
                  Selecione um professor para ver suas disciplinas
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDisciplineManagement;
