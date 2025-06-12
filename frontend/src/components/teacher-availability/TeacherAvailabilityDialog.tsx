import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Schedule } from "@/services/scheduleService";

interface TeacherAvailabilityFormData {
  teacherId: string;
  scheduleId: string;
  status: boolean;
}

interface TeacherAvailabilityFormErrors {
  teacherId?: string;
  scheduleId?: string;
}

interface TeacherAvailabilityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: TeacherAvailabilityFormData;
  setFormData: (data: TeacherAvailabilityFormData) => void;
  formErrors: TeacherAvailabilityFormErrors;
  onSubmit: (e: React.FormEvent) => void;
  isEditing: boolean;
  teachers: { id: number; name: string }[];
  schedules: Schedule[];
}

const formSchema = z.object({
  teacherId: z.string().min(1, "Professor é obrigatório"),
  scheduleId: z.string().min(1, "Horário é obrigatório"),
});

export function TeacherAvailabilityDialog({
  open,
  onOpenChange,
  formData,
  setFormData,
  formErrors,
  onSubmit,
  isEditing,
  teachers,
  schedules,
}: TeacherAvailabilityDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      teacherId: formData.teacherId,
      scheduleId: formData.scheduleId,
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    form.handleSubmit(() => {
      onSubmit(e);
    })();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Disponibilidade" : "Nova Disponibilidade"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="teacherId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Professor</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setFormData({ ...formData, teacherId: value });
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um professor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {teachers.map((teacher) => (
                        <SelectItem
                          key={teacher.id}
                          value={teacher.id.toString()}
                        >
                          {teacher.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage>{formErrors.teacherId}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="scheduleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Horário</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setFormData({ ...formData, scheduleId: value });
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um horário" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {schedules.map((schedule) => (
                        <SelectItem
                          key={schedule.id}
                          value={schedule.id.toString()}
                        >
                          {schedule.dayOfWeek} - {schedule.timeSlot.startTime}{" "}
                          às {schedule.timeSlot.endTime}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage>{formErrors.scheduleId}</FormMessage>
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">{isEditing ? "Salvar" : "Criar"}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
