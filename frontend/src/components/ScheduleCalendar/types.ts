export interface ScheduleEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  disciplineTeacherId: number;
  scheduleId: number;
}

export interface ScheduleCalendarProps {
  userId?: number;
  role?: string;
}
