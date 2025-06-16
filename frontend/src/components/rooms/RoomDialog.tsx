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
import { RoomType } from "@/services/roomService";

interface RoomFormData {
  name: string;
  seatsAmount: string;
  type: RoomType;
}

interface RoomFormErrors {
  name?: string;
  seatsAmount?: string;
  type?: string;
}

interface RoomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: RoomFormData;
  setFormData: (data: RoomFormData) => void;
  formErrors: RoomFormErrors;
  onSubmit: (e: React.FormEvent) => void;
  isEditing: boolean;
}

export const RoomDialog = ({
  open,
  onOpenChange,
  formData,
  setFormData,
  formErrors,
  onSubmit,
  isEditing,
}: RoomDialogProps) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof RoomFormData
  ) => {
    setFormData({
      ...formData,
      [field]: e.target.value,
    });
  };

  const handleTypeChange = (value: RoomType) => {
    setFormData({
      ...formData,
      type: value,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Sala" : "Adicionar Sala"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Atualize as informações da sala abaixo."
              : "Preencha as informações para adicionar uma nova sala."}
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
                placeholder="Ex: Sala 101"
              />
              {formErrors.name && (
                <p className="text-sm text-destructive">{formErrors.name}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="seatsAmount">Capacidade</Label>
              <Input
                id="seatsAmount"
                type="number"
                min="1"
                value={formData.seatsAmount}
                onChange={(e) => handleChange(e, "seatsAmount")}
                placeholder="Ex: 30"
              />
              {formErrors.seatsAmount && (
                <p className="text-sm text-destructive">
                  {formErrors.seatsAmount}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">Tipo</Label>
              <Select value={formData.type} onValueChange={handleTypeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo da sala" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={RoomType.Comum}>Comum</SelectItem>
                  <SelectItem value={RoomType.Laboratório}>
                    Laboratório
                  </SelectItem>
                  <SelectItem value={RoomType.Auditório}>Auditório</SelectItem>
                </SelectContent>
              </Select>
              {formErrors.type && (
                <p className="text-sm text-destructive">{formErrors.type}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">
              {isEditing ? "Salvar Alterações" : "Adicionar Sala"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
