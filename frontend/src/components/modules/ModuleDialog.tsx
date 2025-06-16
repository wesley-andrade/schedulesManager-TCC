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

interface ModuleFormData {
  name: string;
  totalStudents: string;
}

interface ModuleFormErrors {
  name?: string;
  totalStudents?: string;
}

interface ModuleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: ModuleFormData;
  setFormData: (data: ModuleFormData) => void;
  formErrors: ModuleFormErrors;
  onSubmit: (e: React.FormEvent) => void;
  isEditing: boolean;
}

export const ModuleDialog = ({
  open,
  onOpenChange,
  formData,
  setFormData,
  formErrors,
  onSubmit,
  isEditing,
}: ModuleDialogProps) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof ModuleFormData
  ) => {
    setFormData({
      ...formData,
      [field]: e.target.value,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Turma" : "Adicionar Turma"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Atualize as informações da turma abaixo."
              : "Preencha as informações para adicionar uma nova turma."}
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
                placeholder="Ex: Turma A"
              />
              {formErrors.name && (
                <p className="text-sm text-destructive">{formErrors.name}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="totalStudents">Total de Alunos</Label>
              <Input
                id="totalStudents"
                type="number"
                min="1"
                value={formData.totalStudents}
                onChange={(e) => handleChange(e, "totalStudents")}
                placeholder="Ex: 30"
              />
              {formErrors.totalStudents && (
                <p className="text-sm text-destructive">
                  {formErrors.totalStudents}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">
              {isEditing ? "Salvar Alterações" : "Adicionar Turma"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
