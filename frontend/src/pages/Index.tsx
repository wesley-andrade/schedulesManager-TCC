import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/services/api";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { ManagementMenu } from "@/components/dashboard/ManagementMenu";
import { WelcomeHeader } from "@/components/dashboard/WelcomeHeader";
import ScheduleCalendar from "@/components/ScheduleCalendar/index";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { User } from "@/services/userService";
import { useCalendar } from "@/contexts/CalendarContext";

const Index = () => {
  const { currentUser } = useUser();
  const { toast } = useToast();
  const { triggerRefresh } = useCalendar();
  const [totalRooms, setTotalRooms] = useState<number>(0);
  const [totalDisciplines, setTotalDisciplines] = useState<number>(0);
  const [totalTeachers, setTotalTeachers] = useState<number>(0);
  const [academicPeriods, setAcademicPeriods] = useState<any[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [calendarKey, setCalendarKey] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-600">Carregando usuário...</div>
      </div>
    );
  }

  useEffect(() => {
    document.title = "TimeWise - Página Principal";
    fetchDashboardData();
    fetchAcademicPeriods();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [roomsRes, disciplinesRes, teachersRes] = await Promise.all([
        api.get("/rooms"),
        api.get("/disciplines"),
        api.get("/teachers"),
      ]);
      setTotalRooms(roomsRes.data.length);
      setTotalDisciplines(disciplinesRes.data.length);
      setTotalTeachers(teachersRes.data.length);
    } catch (error) {
      console.error("Erro ao buscar dados do dashboard:", error);
    }
  };

  const fetchAcademicPeriods = async () => {
    try {
      const response = await api.get("/academic-periods");
      setAcademicPeriods(response.data);
    } catch (error) {
      console.error("Erro ao buscar períodos acadêmicos:", error);
    }
  };

  const handleGenerateSchedules = async () => {
    if (!selectedPeriod) return;

    try {
      setIsGenerating(true);
      await api.post(
        `/class-schedules/generate?academicPeriodId=${selectedPeriod}`
      );

      toast({
        title: "Aulas geradas com sucesso!",
        description: "O calendário será atualizado em instantes.",
      });

      triggerRefresh();
      setIsDialogOpen(false);
      setSelectedPeriod("");
    } catch (error) {
      console.error("Erro ao gerar aulas:", error);
      toast({
        title: "Erro ao gerar aulas",
        description:
          "Ocorreu um erro ao tentar gerar as aulas. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const user: User = {
    ...currentUser,
    phone: "",
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />

      <div className="flex flex-1 container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row w-full gap-6">
          <div className="lg:w-2/3 space-y-6">
            <WelcomeHeader user={user} />

            {currentUser.role === "admin" && (
              <DashboardStats
                totalRooms={totalRooms}
                totalDisciplines={totalDisciplines}
                totalTeachers={totalTeachers}
              />
            )}

            <div className="bg-white rounded-lg shadow p-6 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <span role="img" aria-label="calendar">
                    📅
                  </span>{" "}
                  Calendário de Aulas
                </h2>
                {currentUser.role === "admin" && (
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-purple-500 hover:bg-purple-600 text-white flex items-center gap-2">
                        + Gerar Aulas
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Gerar Horários</DialogTitle>
                      </DialogHeader>
                      <div className="py-4">
                        <Select
                          value={selectedPeriod}
                          onValueChange={setSelectedPeriod}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o período acadêmico" />
                          </SelectTrigger>
                          <SelectContent>
                            {academicPeriods.map((period) => (
                              <SelectItem key={period.id} value={period.id}>
                                {period.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        onClick={handleGenerateSchedules}
                        disabled={!selectedPeriod || isGenerating}
                        className="w-full"
                      >
                        {isGenerating ? "Gerando..." : "Gerar Horários"}
                      </Button>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
              <ScheduleCalendar
                userId={currentUser.id}
                role={currentUser.role}
              />
            </div>
          </div>

          {currentUser.role === "admin" && (
            <div className="lg:w-1/3 space-y-6">
              <ManagementMenu />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
