import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { ScheduleEvent } from "./types";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: ScheduleEvent | null;
  onConfirm: (event: ScheduleEvent) => void;
}

export function DeleteConfirmationModal({
  isOpen,
  onClose,
  event,
  onConfirm,
}: DeleteConfirmationModalProps) {
  if (!event) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar exclusão</DialogTitle>
        </DialogHeader>
        <p>Tem certeza que deseja excluir esta aula?</p>
        <DialogFooter>
          <button
            onClick={() => onConfirm(event)}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
          >
            Excluir
          </button>
          <DialogClose asChild>
            <button className="ml-2 px-4 py-2 rounded border">Cancelar</button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
