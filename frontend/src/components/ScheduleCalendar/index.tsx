import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { EventComponent } from "./EventComponent";
import { EventDetailsModal } from "./EventDetailsModal";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";
import { EditEventModal } from "./EditEventModal";
import { ScheduleEvent, ScheduleCalendarProps } from "./types";
import { formatScheduleEvent } from "./utils";
import { useCalendar } from "@/contexts/CalendarContext";

const locales = { "pt-BR": ptBR };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

function ScheduleCalendarComponent({ userId, role }: ScheduleCalendarProps) {
  const { refreshTrigger } = useCalendar();
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState(Views.MONTH);
  const { toast } = useToast();
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(
    null
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<ScheduleEvent | null>(
    null
  );
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editDate, setEditDate] = useState<string>("");
  const [editScheduleId, setEditScheduleId] = useState<number | null>(null);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const handleDeleteEvent = async (eventId: number) => {
    try {
      await api.delete(`/class-schedules/${eventId}`);
      setEvents(events.filter((event) => event.id !== eventId));
      setModalOpen(false);
      setConfirmDeleteOpen(false);
      setEventToDelete(null);
      toast({
        title: "Aula excluída",
        description: "A aula foi excluída com sucesso.",
      });
    } catch {
      toast({
        title: "Erro ao excluir aula",
        description: "Não foi possível excluir a aula. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const openDeleteConfirmation = (event: ScheduleEvent) => {
    setEventToDelete(event);
    setConfirmDeleteOpen(true);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data: classSchedulesData } = await api.get(
          role === "standard" && userId
            ? `/class-schedules?teacherId=${userId}`
            : "/class-schedules"
        );

        if (!Array.isArray(classSchedulesData)) throw new Error();
        const formatScheduleEvents = classSchedulesData
          .map(formatScheduleEvent)
          .filter((event): event is ScheduleEvent => event !== null);
        setEvents(formatScheduleEvents);
      } catch {
        setError("Erro ao carregar o calendário. Por favor, tente novamente.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [userId, role, refreshTrigger]);

  useEffect(() => {
    if (editModalOpen) {
      api
        .get("/schedules?includeTimeSlot=true")
        .then((res) => setSchedules(res.data))
        .catch(() => setSchedules([]));
    }
  }, [editModalOpen]);

  const openEditModal = (event: ScheduleEvent) => {
    setEditDate(event.start.toISOString().slice(0, 10));
    setEditScheduleId(event.scheduleId);
    setEditModalOpen(true);
    setEditError(null);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent || !editScheduleId || !editDate) return;
    setEditLoading(true);
    setEditError(null);
    try {
      const selectedSchedule = schedules.find(
        (s: any) => s.id === editScheduleId
      );

      if (!selectedSchedule || !selectedSchedule.timeSlot) {
        setEditError("Horário selecionado inválido. Tente novamente.");
        setEditLoading(false);
        return;
      }
      const startTime = selectedSchedule.timeSlot.startTime;
      const dateTime = `${editDate}T${startTime}:00`;
      await api.put(`/class-schedules/${selectedEvent.id}`, {
        scheduleId: editScheduleId,
        date: dateTime,
      });
      setEditModalOpen(false);
      setModalOpen(false);
      setEditLoading(false);
      toast({ title: "Aula editada com sucesso!" });
      const { data: classSchedulesData } = await api.get(
        role === "standard" && userId
          ? `/class-schedules?teacherId=${userId}`
          : "/class-schedules"
      );
      const formatScheduleEvents = classSchedulesData
        .map(formatScheduleEvent)
        .filter((event: any): event is ScheduleEvent => event !== null);
      setEvents(formatScheduleEvents);
    } catch (err: any) {
      const backendError = err?.response?.data;
      let errorMessage = "Erro ao editar aula";

      if (backendError?.message) {
        errorMessage = backendError.message;
      } else if (typeof backendError === "string") {
        errorMessage = backendError;
      }

      setEditError(errorMessage);
      toast({
        title: "Erro ao editar aula",
        description: errorMessage,
        variant: "destructive",
      });
      setEditLoading(false);
    }
  };

  const handleEventSelect = (event: ScheduleEvent) => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <div className="text-gray-600">Carregando calendário...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <>
      <div style={{ height: 600 }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{
            height: "100%",
            backgroundColor: "white",
            padding: "1rem",
            borderRadius: "0.5rem",
          }}
          date={date}
          view={view}
          onView={setView}
          onNavigate={setDate}
          views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
          culture="pt-BR"
          components={{
            event: (props) => (
              <EventComponent
                {...props}
                role={role}
                view={view}
                onDelete={openDeleteConfirmation}
                onEdit={openEditModal}
                onSelect={handleEventSelect}
              />
            ),
          }}
          messages={{
            today: "Hoje",
            previous: "Anterior",
            next: "Próximo",
            month: "Mês",
            week: "Semana",
            day: "Dia",
            agenda: "Agenda",
            date: "Data",
            time: "Hora",
            event: "Evento",
            noEventsInRange: "Nenhum evento neste intervalo",
            showMore: (total) => `+ ${total} eventos`,
            allDay: "Dia inteiro",
            work_week: "Semana de trabalho",
            tomorrow: "Amanhã",
            yesterday: "Ontem",
            thisWeek: "Esta semana",
            lastWeek: "Semana passada",
            nextWeek: "Próxima semana",
            thisMonth: "Este mês",
            lastMonth: "Mês passado",
            nextMonth: "Próximo mês",
          }}
        />
      </div>

      <EventDetailsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        event={selectedEvent}
        role={role}
        view={view}
        onDelete={openDeleteConfirmation}
        onEdit={openEditModal}
      />

      <DeleteConfirmationModal
        isOpen={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        event={eventToDelete}
        onConfirm={(event) => handleDeleteEvent(event.id)}
      />

      <EditEventModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        event={selectedEvent}
        editDate={editDate}
        editScheduleId={editScheduleId}
        schedules={schedules}
        editLoading={editLoading}
        editError={editError}
        onDateChange={setEditDate}
        onScheduleChange={setEditScheduleId}
        onSubmit={handleEditSubmit}
      />
    </>
  );
}

export default function ScheduleCalendar(props: ScheduleCalendarProps) {
  return <ScheduleCalendarComponent {...props} />;
}
