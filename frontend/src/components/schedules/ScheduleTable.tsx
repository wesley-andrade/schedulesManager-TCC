import { Schedule } from "@/services/scheduleService";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";

interface ScheduleTableProps {
  schedules: Schedule[];
  isLoading: boolean;
  onEdit: (schedule: Schedule) => void;
  onDelete: (schedule: Schedule) => void;
}

export const ScheduleTable = ({
  schedules,
  isLoading,
  onEdit,
  onDelete,
}: ScheduleTableProps) => {
  const weekDays = [
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
  ];

  const sortedSchedules = [...schedules].sort((a, b) => {
    const dayA = weekDays.indexOf(a.dayOfWeek);
    const dayB = weekDays.indexOf(b.dayOfWeek);
    if (dayA !== dayB) return dayA - dayB;
    if (a.timeSlot.startTime < b.timeSlot.startTime) return -1;
    if (a.timeSlot.startTime > b.timeSlot.startTime) return 1;
    return 0;
  });

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="text-gray-700 font-bold">
              Dia da Semana
            </TableHead>
            <TableHead className="text-gray-700 font-bold">
              Horário Inicial
            </TableHead>
            <TableHead className="text-gray-700 font-bold">
              Horário Final
            </TableHead>
            <TableHead className="text-gray-700 font-bold text-right">
              Ações
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                Carregando...
              </TableCell>
            </TableRow>
          ) : sortedSchedules.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                Nenhum horário encontrado.
              </TableCell>
            </TableRow>
          ) : (
            sortedSchedules.map((schedule) => (
              <TableRow
                key={schedule.id}
                className="hover:bg-blue-50 transition-colors border-t border-gray-200"
              >
                <TableCell>{schedule.dayOfWeek}</TableCell>
                <TableCell>{schedule.timeSlot.startTime}</TableCell>
                <TableCell>{schedule.timeSlot.endTime}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(schedule)}
                    className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 mr-1"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(schedule)}
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
