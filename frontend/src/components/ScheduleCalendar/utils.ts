import { ScheduleEvent } from "./types";

export const formatScheduleEvent = (item: any): ScheduleEvent | null => {
  try {
    if (
      !item?.schedule?.timeSlot?.startTime ||
      !item?.schedule?.timeSlot?.endTime ||
      !item?.date
    ) {
      return null;
    }

    const startDate = new Date(item.date);
    const [startHour, startMinute] = item.schedule.timeSlot.startTime
      .split(":")
      .map(Number);

    startDate.setHours(startHour, startMinute, 0, 0);
    const endDate = new Date(item.date);
    const [endHour, endMinute] = item.schedule.timeSlot.endTime
      .split(":")
      .map(Number);
    endDate.setHours(endHour, endMinute, 0, 0);

    const disciplineName =
      item.disciplineTeacher?.discipline?.name || "Sem Disciplina";
    const roomName = item.rooms?.[0]?.room?.name || "?";
    const teacherName =
      item.disciplineTeacher?.teacher?.user?.name || "Sem Professor";
    const title = `${disciplineName} - ${teacherName} - Sala ${roomName}`;

    return {
      id: item.id,
      title,
      start: startDate,
      end: endDate,
      disciplineTeacherId: item.disciplineTeacherId,
      scheduleId: item.scheduleId,
    };
  } catch {
    return null;
  }
};
