import { TeacherAvailability } from "@/services/teacherAvailabilityService";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Schedule } from "@/services/scheduleService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TeacherAvailabilityTableProps {
  availabilities: TeacherAvailability[];
  schedules: Schedule[];
  isLoading: boolean;
  onAvailabilityChange: (scheduleId: number, status: boolean) => void;
  teachers: { id: number; name: string }[];
  selectedTeacherId: number | null;
  onTeacherChange: (teacherId: number) => void;
}

export function TeacherAvailabilityTable({
  availabilities,
  schedules,
  isLoading,
  onAvailabilityChange,
  teachers,
  selectedTeacherId,
  onTeacherChange,
}: TeacherAvailabilityTableProps) {
  const daysOfWeek = [
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
  ];

  const schedulesByDay = schedules.reduce((acc, schedule) => {
    if (!acc[schedule.dayOfWeek]) {
      acc[schedule.dayOfWeek] = [];
    }
    acc[schedule.dayOfWeek].push(schedule);
    return acc;
  }, {} as Record<string, Schedule[]>);

  Object.keys(schedulesByDay).forEach((day) => {
    schedulesByDay[day].sort((a, b) => {
      return a.timeSlot.startTime.localeCompare(b.timeSlot.startTime);
    });
  });

  const uniqueTimeSlots = Array.from(
    new Set(
      schedules.map((s) => `${s.timeSlot.startTime}-${s.timeSlot.endTime}`)
    )
  ).map((timeSlot) => {
    const [startTime, endTime] = timeSlot.split("-");
    return { startTime, endTime };
  });

  uniqueTimeSlots.sort((a, b) => a.startTime.localeCompare(b.startTime));

  const isAvailable = (scheduleId: number) => {
    return availabilities.some(
      (a) => a.scheduleId === scheduleId && a.teacherId === selectedTeacherId
    );
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium">Professor:</span>
        <Select
          value={selectedTeacherId?.toString()}
          onValueChange={(value) => onTeacherChange(parseInt(value))}
        >
          <SelectTrigger className="w-[300px]">
            <SelectValue placeholder="Selecione um professor" />
          </SelectTrigger>
          <SelectContent>
            {teachers.map((teacher) => (
              <SelectItem key={teacher.id} value={teacher.id.toString()}>
                {teacher.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="text-gray-700 font-bold">Horário</TableHead>
              {daysOfWeek.map((day) => (
                <TableHead key={day} className="text-gray-700 font-bold">
                  {day}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {uniqueTimeSlots.map((timeSlot) => (
              <TableRow
                key={`${timeSlot.startTime}-${timeSlot.endTime}`}
                className="hover:bg-blue-50 transition-colors border-t border-gray-200"
              >
                <TableCell className="font-medium">
                  {timeSlot.startTime} - {timeSlot.endTime}
                </TableCell>
                {daysOfWeek.map((day) => {
                  const schedule = schedulesByDay[day]?.find(
                    (s) =>
                      s.timeSlot.startTime === timeSlot.startTime &&
                      s.timeSlot.endTime === timeSlot.endTime
                  );
                  return (
                    <TableCell key={`${day}-${timeSlot.startTime}`}>
                      {schedule && (
                        <Checkbox
                          checked={isAvailable(schedule.id)}
                          onCheckedChange={(checked) =>
                            onAvailabilityChange(
                              schedule.id,
                              checked as boolean
                            )
                          }
                          disabled={!selectedTeacherId}
                          className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                        />
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
