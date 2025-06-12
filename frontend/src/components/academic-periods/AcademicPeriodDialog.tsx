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

interface AcademicPeriodFormData {
  name: string;
  startDate: string;
  endDate: string;
}

interface AcademicPeriodFormErrors {
  name?: string;
  startDate?: string;
  endDate?: string;
}

interface AcademicPeriodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: AcademicPeriodFormData;
  setFormData: (data: AcademicPeriodFormData) => void;
  formErrors: AcademicPeriodFormErrors;
  onSubmit: (e: React.FormEvent) => void;
  isEditing: boolean;
}

export const AcademicPeriodDialog = ({
  open,
  onOpenChange,
  formData,
  setFormData,
  formErrors,
  onSubmit,
  isEditing,
}: AcademicPeriodDialogProps) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof AcademicPeriodFormData
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
            {isEditing
              ? "Editar Período Acadêmico"
              : "Adicionar Período Acadêmico"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Atualize as informações do período acadêmico abaixo."
              : "Preencha as informações para adicionar um novo período acadêmico."}
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
                placeholder="Ex: 2024.1"
              />
              {formErrors.name && (
                <p className="text-sm text-destructive">{formErrors.name}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="startDate">Data de Início</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleChange(e, "startDate")}
              />
              {formErrors.startDate && (
                <p className="text-sm text-destructive">
                  {formErrors.startDate}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="endDate">Data de Término</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleChange(e, "endDate")}
              />
              {formErrors.endDate && (
                <p className="text-sm text-destructive">{formErrors.endDate}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">
              {isEditing ? "Salvar Alterações" : "Adicionar Período"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
