import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Schedule, scheduleService } from "@/services/scheduleService";
import Header from "@/components/Header";
import { useUser } from "@/contexts/UserContext";
import { ScheduleTable } from "@/components/schedules/ScheduleTable";
import { ScheduleSearch } from "@/components/schedules/ScheduleSearch";
import { ScheduleDialog } from "@/components/schedules/ScheduleDialog";
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
import { timeSlotService } from "@/services/timeSlotService";
import { ROUTES } from "@/config/routes";

interface ScheduleFormData {
  dayOfWeek:
    | "Segunda-feira"
    | "Terça-feira"
    | "Quarta-feira"
    | "Quinta-feira"
    | "Sexta-feira";
  timeSlotId: number;
  startTime: string;
  endTime: string;
}

interface ScheduleFormErrors {
  dayOfWeek?: string;
  timeSlotId?: string;
  startTime?: string;
  endTime?: string;
}

const ScheduleManagement = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState<Schedule | null>(
    null
  );
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [formData, setFormData] = useState<ScheduleFormData>({
    dayOfWeek: "Segunda-feira",
    timeSlotId: 0,
    startTime: "",
    endTime: "",
  });
  const [formErrors, setFormErrors] = useState<ScheduleFormErrors>({});
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser, logout } = useUser();

  useEffect(() => {
    document.title = "TimeWise - Gerenciar Horários";

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

    loadSchedules();
  }, [currentUser, navigate, toast]);

  const loadSchedules = async () => {
    try {
      setIsLoading(true);
      const data = await scheduleService.getAllSchedules();
      setSchedules(data);
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
          error instanceof Error ? error.message : "Erro ao carregar horários",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    navigate(ROUTES.DASHBOARD);
  };

  const handleAddSchedule = () => {
    setEditingSchedule(null);
    setFormData({
      dayOfWeek: "Segunda-feira",
      timeSlotId: 0,
      startTime: "",
      endTime: "",
    });
    setIsDialogOpen(true);
  };

  const handleEditSchedule = (schedule: Schedule) => {
    setEditingSchedule(schedule);
    setFormData({
      dayOfWeek: schedule.dayOfWeek,
      timeSlotId: schedule.timeSlotId,
      startTime: schedule.timeSlot.startTime,
      endTime: schedule.timeSlot.endTime,
    });
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (schedule: Schedule) => {
    setScheduleToDelete(schedule);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!scheduleToDelete) return;

    try {
      await scheduleService.deleteSchedule(scheduleToDelete.id);
      toast({
        title: "Sucesso",
        description: "Horário excluído com sucesso",
      });
      loadSchedules();
    } catch (error) {
      toast({
        title: "Erro",
        description:
          error instanceof Error ? error.message : "Erro ao excluir horário",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setScheduleToDelete(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors: ScheduleFormErrors = {};

    if (!formData.dayOfWeek) {
      errors.dayOfWeek = "Dia da semana é obrigatório";
    }

    if (!formData.startTime) {
      errors.startTime = "Horário inicial é obrigatório";
    }

    if (!formData.endTime) {
      errors.endTime = "Horário final é obrigatório";
    }

    if (formData.startTime && formData.endTime) {
      const startTime = new Date(`2000-01-01T${formData.startTime}`);
      const endTime = new Date(`2000-01-01T${formData.endTime}`);

      if (startTime >= endTime) {
        errors.endTime =
          "O horário final deve ser posterior ao horário inicial";
      }
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const timeSlot = await timeSlotService.createTimeSlot({
        startTime: formData.startTime,
        endTime: formData.endTime,
      });

      const scheduleData = {
        dayOfWeek: formData.dayOfWeek,
        timeSlotId: timeSlot.id,
      };

      if (editingSchedule) {
        await scheduleService.updateSchedule(editingSchedule.id, scheduleData);
        toast({
          title: "Sucesso",
          description: "Horário atualizado com sucesso",
        });
      } else {
        await scheduleService.createSchedule(scheduleData);
        toast({
          title: "Sucesso",
          description: "Horário criado com sucesso",
        });
      }

      setIsDialogOpen(false);
      loadSchedules();
    } catch (error) {
      toast({
        title: "Erro",
        description:
          error instanceof Error ? error.message : "Erro ao salvar horário",
        variant: "destructive",
      });
    }
  };

  const filteredSchedules = schedules.filter(
    (schedule) =>
      schedule.dayOfWeek.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.timeSlot.startTime
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      schedule.timeSlot.endTime.toLowerCase().includes(searchTerm.toLowerCase())
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
              Gerenciar Horários
            </h1>
            <div className="h-1 w-24 bg-blue-500 mt-2 rounded-full"></div>
          </div>
          <Button
            onClick={handleAddSchedule}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            <Plus className="h-5 w-5 mr-1" /> Adicionar Horário
          </Button>
        </div>

        <ScheduleSearch
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <ScheduleTable
          schedules={filteredSchedules}
          isLoading={isLoading}
          onEdit={handleEditSchedule}
          onDelete={handleDeleteClick}
        />

        <ScheduleDialog
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          editingSchedule={editingSchedule}
          formData={formData}
          formErrors={formErrors}
          onFormDataChange={(data) =>
            setFormData((prev) => ({ ...prev, ...data }))
          }
          onFormErrorsChange={(errors) =>
            setFormErrors((prev) => ({ ...prev, ...errors }))
          }
          onSubmit={handleSubmit}
        />

        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir este horário? Esta ação não pode
                ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm}>
                Confirmar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default ScheduleManagement;
