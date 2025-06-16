import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Discipline, disciplineService } from "@/services/disciplineService";
import {
  TeacherDiscipline,
  teacherDisciplineService,
} from "@/services/teacherDisciplineService";
import { Teacher } from "@/services/teacherService";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface TeacherDisciplinesProps {
  teacher: Teacher;
}

export const TeacherDisciplines = ({ teacher }: TeacherDisciplinesProps) => {
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [teacherDisciplines, setTeacherDisciplines] = useState<
    TeacherDiscipline[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [disciplineToDelete, setDisciplineToDelete] =
    useState<TeacherDiscipline | null>(null);
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, [teacher.id]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [disciplinesData, teacherDisciplinesData] = await Promise.all([
        disciplineService.getAllDisciplines(),
        teacherDisciplineService.getAllTeacherDisciplines(),
      ]);

      setDisciplines(disciplinesData);
      setTeacherDisciplines(
        teacherDisciplinesData.filter((td) => td.teacherId === teacher.id)
      );
    } catch (error) {
      toast({
        title: "Erro",
        description:
          error instanceof Error ? error.message : "Erro ao carregar dados",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddDiscipline = async () => {
    if (!selectedDiscipline) {
      toast({
        title: "Erro",
        description: "Selecione uma disciplina",
        variant: "destructive",
      });
      return;
    }

    try {
      await teacherDisciplineService.createTeacherDiscipline(
        teacher.id,
        parseInt(selectedDiscipline)
      );

      toast({
        title: "Sucesso",
        description: "Disciplina adicionada ao professor com sucesso",
      });

      setIsDialogOpen(false);
      setSelectedDiscipline("");
      loadData();
    } catch (error) {
      toast({
        title: "Erro",
        description:
          error instanceof Error
            ? error.message
            : "Erro ao adicionar disciplina",
        variant: "destructive",
      });
    }
  };

  const handleDeleteClick = (teacherDiscipline: TeacherDiscipline) => {
    setDisciplineToDelete(teacherDiscipline);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!disciplineToDelete) return;

    try {
      await teacherDisciplineService.deleteTeacherDiscipline(
        disciplineToDelete.id
      );
      toast({
        title: "Sucesso",
        description: "Disciplina removida do professor com sucesso",
      });
      loadData();
    } catch (error) {
      toast({
        title: "Erro",
        description:
          error instanceof Error ? error.message : "Erro ao remover disciplina",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setDisciplineToDelete(null);
    }
  };

  const getDisciplineName = (disciplineId: number) => {
    return (
      disciplines.find((d) => d.id === disciplineId)?.name || "Desconhecida"
    );
  };

  return (
    <div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="text-gray-700 font-bold">
                Disciplina
              </TableHead>
              <TableHead className="text-gray-700 font-bold text-right flex items-center justify-end gap-2">
                Ações
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsDialogOpen(true)}
                  className="ml-2 px-2 py-1 h-7 w-7 flex items-center justify-center border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700"
                  title="Adicionar Disciplina"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={2}
                  className="text-center py-8 text-gray-500"
                >
                  Carregando...
                </TableCell>
              </TableRow>
            ) : teacherDisciplines.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={2}
                  className="text-center py-8 text-gray-500"
                >
                  Nenhuma disciplina associada a este professor.
                </TableCell>
              </TableRow>
            ) : (
              teacherDisciplines.map((td) => (
                <TableRow
                  key={td.id}
                  className="hover:bg-blue-50 transition-colors border-t border-gray-200"
                >
                  <TableCell>{getDisciplineName(td.disciplineId)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(td)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Disciplina</DialogTitle>
            <DialogDescription>
              Selecione uma disciplina para associar ao professor.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="discipline">Disciplina</Label>
              <Select
                value={selectedDiscipline}
                onValueChange={setSelectedDiscipline}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma disciplina" />
                </SelectTrigger>
                <SelectContent>
                  {disciplines.map((discipline) => (
                    <SelectItem
                      key={discipline.id}
                      value={discipline.id.toString()}
                    >
                      {discipline.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddDiscipline}>Adicionar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover a disciplina{" "}
              {disciplineToDelete &&
                getDisciplineName(disciplineToDelete.disciplineId)}{" "}
              deste professor? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
