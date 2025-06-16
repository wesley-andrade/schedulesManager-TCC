import { Schedule } from "@/services/scheduleService";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

interface ScheduleDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingSchedule: Schedule | null;
  formData: ScheduleFormData;
  formErrors: ScheduleFormErrors;
  onFormDataChange: (data: Partial<ScheduleFormData>) => void;
  onFormErrorsChange: (errors: Partial<ScheduleFormErrors>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ScheduleDialog = ({
  isOpen,
  onOpenChange,
  editingSchedule,
  formData,
  formErrors,
  onFormDataChange,
  onFormErrorsChange,
  onSubmit,
}: ScheduleDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingSchedule ? "Editar Horário" : "Adicionar Horário"}
          </DialogTitle>
          <DialogDescription>
            {editingSchedule
              ? "Atualize as informações do horário abaixo."
              : "Preencha as informações para adicionar um novo horário."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dayOfWeek">Dia da Semana</Label>
            <Select
              value={formData.dayOfWeek}
              onValueChange={(value) => {
                onFormDataChange({
                  dayOfWeek: value as ScheduleFormData["dayOfWeek"],
                });
                onFormErrorsChange({ dayOfWeek: undefined });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o dia da semana" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Segunda-feira">Segunda-feira</SelectItem>
                <SelectItem value="Terça-feira">Terça-feira</SelectItem>
                <SelectItem value="Quarta-feira">Quarta-feira</SelectItem>
                <SelectItem value="Quinta-feira">Quinta-feira</SelectItem>
                <SelectItem value="Sexta-feira">Sexta-feira</SelectItem>
              </SelectContent>
            </Select>
            {formErrors.dayOfWeek && (
              <p className="text-sm text-red-500">{formErrors.dayOfWeek}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Horário Inicial</Label>
              <Input
                id="startTime"
                name="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => {
                  onFormDataChange({ startTime: e.target.value });
                  onFormErrorsChange({ startTime: undefined });
                }}
                className={formErrors.startTime ? "border-red-500" : ""}
              />
              {formErrors.startTime && (
                <p className="text-sm text-red-500">{formErrors.startTime}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">Horário Final</Label>
              <Input
                id="endTime"
                name="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => {
                  onFormDataChange({ endTime: e.target.value });
                  onFormErrorsChange({ endTime: undefined });
                }}
                className={formErrors.endTime ? "border-red-500" : ""}
              />
              {formErrors.endTime && (
                <p className="text-sm text-red-500">{formErrors.endTime}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="submit">
              {editingSchedule ? "Salvar Alterações" : "Adicionar Horário"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
