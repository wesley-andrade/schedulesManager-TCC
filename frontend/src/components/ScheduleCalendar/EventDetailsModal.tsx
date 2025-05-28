import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { ScheduleEvent } from "./types";

interface EventDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: ScheduleEvent | null;
  role?: string;
  view: string;
  onDelete: (event: ScheduleEvent) => void;
  onEdit: (event: ScheduleEvent) => void;
}

export function EventDetailsModal({
  isOpen,
  onClose,
  event,
  role,
  view,
  onDelete,
  onEdit,
}: EventDetailsModalProps) {
  if (!event) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detalhes da Aula</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <div>
            <b>Disciplina:</b> {event.title.split(" - ")[0]}
          </div>
          <div>
            <b>Professor:</b> {event.title.split(" - ")[1]}
          </div>
          <div>
            <b>Sala:</b> {event.title.split(" - ")[2]}
          </div>
          <div>
            <b>Início:</b> {event.start.toLocaleString("pt-BR")}
          </div>
          <div>
            <b>Fim:</b> {event.end.toLocaleString("pt-BR")}
          </div>
        </div>
        <DialogFooter>
          {role === "admin" && (view === "day" || view === "agenda") && (
            <>
              <button
                onClick={() => onDelete(event)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
              >
                Excluir
              </button>
              <button
                onClick={() => onEdit(event)}
                className="ml-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                Editar
              </button>
            </>
          )}
          <DialogClose asChild>
            <button className="ml-2 px-4 py-2 rounded border">Fechar</button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
