import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RoomType } from "@/services/roomService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Course } from "@/services/courseService";

interface DisciplineFormData {
  name: string;
  totalHours: string;
  requiredRoomType: RoomType | "";
  courseId: string;
}

interface DisciplineFormErrors {
  name?: string;
  totalHours?: string;
  requiredRoomType?: string;
  courseId?: string;
}

interface DisciplineDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: DisciplineFormData;
  setFormData: (data: DisciplineFormData) => void;
  formErrors: DisciplineFormErrors;
  onSubmit: (e: React.FormEvent) => void;
  isEditing: boolean;
  courses: Course[];
}

export const DisciplineDialog = ({
  open,
  onOpenChange,
  formData,
  setFormData,
  formErrors,
  onSubmit,
  isEditing,
  courses,
}: DisciplineDialogProps) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof DisciplineFormData
  ) => {
    setFormData({
      ...formData,
      [field]: e.target.value,
    });
  };

  const handleTypeChange = (value: RoomType) => {
    setFormData({
      ...formData,
      requiredRoomType: value,
    });
  };

  const handleCourseChange = (value: string) => {
    setFormData({
      ...formData,
      courseId: value,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Disciplina" : "Adicionar Disciplina"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Atualize as informações da disciplina abaixo."
              : "Preencha as informações para adicionar uma nova disciplina."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange(e, "name")}
                placeholder="Ex: Matemática"
              />
              {formErrors.name && (
                <p className="text-sm text-destructive">{formErrors.name}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="totalHours">Carga Horária</Label>
              <Input
                id="totalHours"
                type="number"
                min="1"
                value={formData.totalHours}
                onChange={(e) => handleChange(e, "totalHours")}
                placeholder="Ex: 60"
              />
              {formErrors.totalHours && (
                <p className="text-sm text-destructive">
                  {formErrors.totalHours}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="requiredRoomType">Tipo de Sala</Label>
              <Select
                value={formData.requiredRoomType}
                onValueChange={handleTypeChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de sala" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Comum">Comum</SelectItem>
                  <SelectItem value="Laboratório">Laboratório</SelectItem>
                  <SelectItem value="Auditório">Auditório</SelectItem>
                </SelectContent>
              </Select>
              {formErrors.requiredRoomType && (
                <p className="text-sm text-destructive">
                  {formErrors.requiredRoomType}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="course">Curso</Label>
              <Select
                value={formData.courseId}
                onValueChange={handleCourseChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o curso" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id.toString()}>
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.courseId && (
                <p className="text-sm text-destructive">
                  {formErrors.courseId}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">
              {isEditing ? "Salvar Alterações" : "Adicionar Disciplina"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
