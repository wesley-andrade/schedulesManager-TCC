import { Teacher } from "@/services/teacherService";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BookOpen } from "lucide-react";

interface TeacherTableProps {
  teachers: Teacher[];
  isLoading: boolean;
  onViewDisciplines: (teacher: Teacher) => void;
}

export const TeacherTable = ({
  teachers,
  isLoading,
  onViewDisciplines,
}: TeacherTableProps) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="text-gray-700 font-bold">Nome</TableHead>
            <TableHead className="text-gray-700 font-bold">Email</TableHead>
            <TableHead className="text-gray-700 font-bold text-right">
              Ações
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                Carregando...
              </TableCell>
            </TableRow>
          ) : teachers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                Nenhum professor encontrado.
              </TableCell>
            </TableRow>
          ) : (
            teachers.map((teacher) => (
              <TableRow
                key={teacher.id}
                className="hover:bg-blue-50 transition-colors border-t border-gray-200"
              >
                <TableCell>{teacher.user?.name}</TableCell>
                <TableCell>{teacher.user?.email}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDisciplines(teacher)}
                    className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                  >
                    <BookOpen className="h-4 w-4" />
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
