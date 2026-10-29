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
import { CalendarPlus } from "lucide-react";
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "TimeWise - Página Principal";

    if (currentUser?.role === "admin") {
      fetchDashboardData();
      fetchAcademicPeriods();
    }
  }, [currentUser?.role]);

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
    setIsConfirmOpen(false);

    try {
      setIsGenerating(true);
      const response = await api.post(
        `/class-schedules/generate?academicPeriodId=${selectedPeriod}`,
        {},
        { responseType: "blob" },
      );

      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: "application/pdf" }),
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "relatorio_horarios.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast({
        title: "Relatório gerado com sucesso!",
        description: "O PDF foi baixado.",
      });

      triggerRefresh();
      setIsDialogOpen(false);
      setSelectedPeriod("");
    } catch (error: any) {
      console.error("Erro ao gerar aulas:", error);

      let description =
        "Ocorreu um erro ao tentar gerar o PDF. Tente novamente.";
      const data = error?.response?.data;

      if (data instanceof Blob) {
        try {
          const parsed = JSON.parse(await data.text());
          description = parsed.message ?? description;
        } catch {}
      }

      toast({
        title: "Erro ao gerar relatório",
        description,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-600">Carregando usuário...</div>
      </div>
    );
  }

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
                        <CalendarPlus /> Gerar Aulas
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
                              <SelectItem
                                key={period.id}
                                value={String(period.id)}
                              >
                                {period.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        onClick={() => setIsConfirmOpen(true)}
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

      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent className="sm:max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>Gerar horários?</AlertDialogTitle>
            <AlertDialogDescription>
              Todas as aulas já geradas para este período, inclusive edições
              manuais, serão apagadas e recriadas. Esta ação não pode ser
              desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setIsConfirmOpen(false);
                setIsDialogOpen(false);
                setSelectedPeriod("");
              }}
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault();
                handleGenerateSchedules();
              }}
              disabled={isGenerating}
            >
              {isGenerating ? "Gerando..." : "Gerar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Index;
