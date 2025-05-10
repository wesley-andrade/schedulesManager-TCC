export type Role = "admin" | "teacher";

export type Holiday = {
  date: string;
  name: string;
  type: "national" | "regional";
};

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: Role;
}

export interface Teacher {
  id: number;
  userId: number;
  phone: string;
}

export interface TeacherAvailability {
  id: number;
  teacherId: number;
  scheduleId: number;
  status: boolean;
}

export interface Schedule {
  id: number;
  dayOfWeek: string;
  timeSlotId: number;
}

export interface TimeSlot {
  id: number;
  startTime: string;
  endTime: string;
}

export interface ClassSchedule {
  id: number;
  scheduleId: number;
  disciplineTeacherId: number;
  date: string;
}

export interface DisciplineTeacher {
  id: number;
  disciplineId: number;
  teacherId: number;
}

export interface Discipline {
  id: number;
  name: string;
  totalHours: number;
  requiredRoomType: string;
}

export interface DiscplineModule {
  id: number;
  disciplineId: number;
  moduleId: number;
  academicPeriodId: number;
}

export interface AcademicPeriod {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
}

export interface Module {
  id: number;
  name: string;
  totalStudents: number;
}

export interface DisciplineCourse {
  id: number;
  disciplineId: number;
  courseId: number;
}

export interface Course {
  id: number;
  name: string;
}

export interface ClassScheduleRoom {
  id: number;
  classScheduleId: number;
  roomId: number;
  scheduleId: number;
  date: string;
}

export interface AcademicPeriod {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
}

export interface Room {
  id: number;
  name: string;
  seatsAmount: number;
  type: string;
}
