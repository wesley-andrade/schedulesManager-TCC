import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  TeacherAvailability,
  teacherAvailabilityService,
} from "@/services/teacherAvailabilityService";
import Header from "@/components/Header";
import { useUser } from "@/contexts/UserContext";
import { TeacherAvailabilityTable } from "@/components/teacher-availability/TeacherAvailabilityTable";
import { ROUTES } from "@/config/routes";
import { teacherService } from "@/services/teacherService";
import { scheduleService, Schedule } from "@/services/scheduleService";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function TeacherAvailabilityManagement() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser } = useUser();
  const [availabilities, setAvailabilities] = useState<TeacherAvailability[]>(
    []
  );
  const [teachers, setTeachers] = useState<{ id: number; name: string }[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTeacherId, setSelectedTeacherId] = useState<number | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!currentUser) {
      navigate(ROUTES.LOGIN);
      return;
    }

    loadData();
  }, [currentUser, navigate]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [availabilitiesData, teachersData, schedulesData] =
        await Promise.all([
          teacherAvailabilityService.getAllTeacherAvailability(),
          teacherService.getAllTeachers(),
          scheduleService.getAllSchedules(),
        ]);

      setAvailabilities(availabilitiesData);
      setTeachers(
        teachersData.map((t) => ({
          id: t.id,
          name: t.user?.name || "",
        }))
      );
      setSchedules(schedulesData);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTeacherChange = (teacherId: number) => {
    setSelectedTeacherId(teacherId);
  };

  const handleAvailabilityChange = async (
    scheduleId: number,
    status: boolean
  ) => {
    if (!selectedTeacherId) {
      toast({
        title: "Erro",
        description: "Selecione um professor primeiro",
        variant: "destructive",
      });
      return;
    }

    try {
      const existingAvailability = availabilities.find(
        (a) => a.teacherId === selectedTeacherId && a.scheduleId === scheduleId
      );

      if (existingAvailability) {
        await teacherAvailabilityService.deleteTeacherAvailability(
          existingAvailability.id
        );
        setAvailabilities(
          availabilities.filter((a) => a.id !== existingAvailability.id)
        );
        toast({
          title: "Sucesso",
          description: "Disponibilidade removida com sucesso",
        });
      } else {
        const newAvailability =
          await teacherAvailabilityService.createTeacherAvailability(
            selectedTeacherId,
            scheduleId,
            true
          );
        setAvailabilities([...availabilities, newAvailability]);
        toast({
          title: "Sucesso",
          description: "Disponibilidade adicionada com sucesso",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a disponibilidade",
        variant: "destructive",
      });
    }
  };

  const handleBackToDashboard = () => {
    navigate(ROUTES.DASHBOARD);
  };

  const filteredTeachers = teachers.filter((teacher) =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto py-6 px-4">
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
              Gerenciamento de Disponibilidades
            </h1>
            <div className="h-1 w-24 bg-blue-500 mt-2 rounded-full"></div>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-2 top-2.5 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Buscar professor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 border-gray-300"
            />
          </div>
        </div>

        <TeacherAvailabilityTable
          availabilities={availabilities}
          schedules={schedules}
          isLoading={isLoading}
          onAvailabilityChange={handleAvailabilityChange}
          teachers={filteredTeachers}
          selectedTeacherId={selectedTeacherId}
          onTeacherChange={handleTeacherChange}
        />
      </main>
    </div>
  );
}
