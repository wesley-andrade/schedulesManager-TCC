import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { ScheduleEvent } from "./types";

interface EditEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: ScheduleEvent | null;
  editDate: string;
  editScheduleId: number | null;
  schedules: any[];
  editLoading: boolean;
  editError: string | null;
  onDateChange: (date: string) => void;
  onScheduleChange: (scheduleId: number) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function EditEventModal({
  isOpen,
  onClose,
  event,
  editDate,
  editScheduleId,
  schedules,
  editLoading,
  editError,
  onDateChange,
  onScheduleChange,
  onSubmit,
}: EditEventModalProps) {
  if (!event) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Aula</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Data</label>
            <input
              type="date"
              value={editDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="w-full border rounded px-2 py-1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Horário</label>
            <select
              value={editScheduleId ?? ""}
              onChange={(e) => onScheduleChange(Number(e.target.value))}
              className="w-full border rounded px-2 py-1"
              required
            >
              <option value="" disabled>
                Selecione um horário
              </option>
              {schedules.map((s: any) => (
                <option key={s.id} value={s.id}>
                  {s.dayOfWeek} - {s.timeSlot?.startTime} às{" "}
                  {s.timeSlot?.endTime}
                </option>
              ))}
            </select>
          </div>
          {editError && (
            <div className="text-red-500 text-sm">{String(editError)}</div>
          )}
          <DialogFooter>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              disabled={editLoading}
            >
              Salvar
            </button>
            <DialogClose asChild>
              <button type="button" className="ml-2 px-4 py-2 rounded border">
                Cancelar
              </button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
