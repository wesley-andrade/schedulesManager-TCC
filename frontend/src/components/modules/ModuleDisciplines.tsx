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
  AcademicPeriod,
  academicPeriodService,
} from "@/services/academicPeriodService";
import {
  DisciplineModule,
  disciplineModuleService,
} from "@/services/disciplineModuleService";
import { Module } from "@/services/moduleService";
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

interface ModuleDisciplinesProps {
  module: Module;
}

export const ModuleDisciplines = ({ module }: ModuleDisciplinesProps) => {
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [academicPeriods, setAcademicPeriods] = useState<AcademicPeriod[]>([]);
  const [moduleDisciplines, setModuleDisciplines] = useState<
    DisciplineModule[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [disciplineToDelete, setDisciplineToDelete] =
    useState<DisciplineModule | null>(null);
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>("");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, [module.id]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [disciplinesData, periodsData, moduleDisciplinesData] =
        await Promise.all([
          disciplineService.getAllDisciplines(),
          academicPeriodService.getAllAcademicPeriods(),
          disciplineModuleService.getAllDisciplineModules(),
        ]);

      setDisciplines(disciplinesData);
      setAcademicPeriods(periodsData);
      setModuleDisciplines(
        moduleDisciplinesData.filter((dm) => dm.moduleId === module.id)
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
    if (!selectedDiscipline || !selectedPeriod) {
      toast({
        title: "Erro",
        description: "Selecione uma disciplina e um período acadêmico",
        variant: "destructive",
      });
      return;
    }

    try {
      await disciplineModuleService.createDisciplineModule(
        parseInt(selectedDiscipline),
        module.id,
        parseInt(selectedPeriod)
      );

      toast({
        title: "Sucesso",
        description: "Disciplina adicionada à turma com sucesso",
      });

      setIsDialogOpen(false);
      setSelectedDiscipline("");
      setSelectedPeriod("");
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

  const handleDeleteClick = (disciplineModule: DisciplineModule) => {
    setDisciplineToDelete(disciplineModule);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!disciplineToDelete) return;

    try {
      await disciplineModuleService.deleteDisciplineModule(
        disciplineToDelete.id
      );
      toast({
        title: "Sucesso",
        description: "Disciplina removida da turma com sucesso",
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

  const getPeriodName = (periodId: number) => {
    return (
      academicPeriods.find((p) => p.id === periodId)?.name || "Desconhecido"
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
              <TableHead className="text-gray-700 font-bold">Período</TableHead>
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
                  colSpan={3}
                  className="text-center py-8 text-gray-500"
                >
                  Carregando...
                </TableCell>
              </TableRow>
            ) : moduleDisciplines.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center py-8 text-gray-500"
                >
                  Nenhuma disciplina associada a esta turma.
                </TableCell>
              </TableRow>
            ) : (
              moduleDisciplines.map((dm) => (
                <TableRow
                  key={dm.id}
                  className="hover:bg-blue-50 transition-colors border-t border-gray-200"
                >
                  <TableCell>{getDisciplineName(dm.disciplineId)}</TableCell>
                  <TableCell>{getPeriodName(dm.academicPeriodId)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(dm)}
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
              Selecione uma disciplina e um período acadêmico para associar à
              turma.
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
            <div className="grid gap-2">
              <Label htmlFor="period">Período Acadêmico</Label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um período" />
                </SelectTrigger>
                <SelectContent>
                  {academicPeriods.map((period) => (
                    <SelectItem key={period.id} value={period.id.toString()}>
                      {period.name}
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
              desta turma? Esta ação não pode ser desfeita.
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
