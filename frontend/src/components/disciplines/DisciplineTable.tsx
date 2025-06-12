import { Discipline } from "@/services/disciplineService";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from "lucide-react";

interface DisciplineTableProps {
  disciplines: Discipline[];
  isLoading: boolean;
  onEdit: (discipline: Discipline) => void;
  onDelete: (discipline: Discipline) => void;
}

const getTypeColor = (type: string) => {
  switch (type) {
    case "Comum":
      return "bg-blue-100 text-blue-800";
    case "Laboratório":
      return "bg-green-100 text-green-800";
    case "Auditório":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const DisciplineTable = ({
  disciplines,
  isLoading,
  onEdit,
  onDelete,
}: DisciplineTableProps) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="text-gray-700 font-bold">Nome</TableHead>
            <TableHead className="text-gray-700 font-bold">
              Carga Horária
            </TableHead>
            <TableHead className="text-gray-700 font-bold">
              Tipo de Sala
            </TableHead>
            <TableHead className="text-gray-700 font-bold">Curso</TableHead>
            <TableHead className="text-gray-700 font-bold text-right">
              Ações
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                Carregando...
              </TableCell>
            </TableRow>
          ) : disciplines.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                Nenhuma disciplina encontrada.
              </TableCell>
            </TableRow>
          ) : (
            disciplines.map((discipline) => (
              <TableRow
                key={discipline.id}
                className="hover:bg-blue-50 transition-colors border-t border-gray-200"
              >
                <TableCell>{discipline.name}</TableCell>
                <TableCell>{discipline.totalHours} horas</TableCell>
                <TableCell>
                  <Badge
                    className={`${getTypeColor(
                      discipline.requiredRoomType
                    )} capitalize`}
                  >
                    {discipline.requiredRoomType}
                  </Badge>
                </TableCell>
                <TableCell>
                  {discipline.disciplineCourses?.[0]?.course?.name || "-"}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(discipline)}
                    className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 mr-1"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(discipline)}
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
  );
};
