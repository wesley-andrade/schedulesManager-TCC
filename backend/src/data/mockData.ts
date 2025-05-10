import bcrypt from "bcrypt";

import {
  AcademicPeriod,
  ClassSchedule,
  ClassScheduleRoom,
  Course,
  Discipline,
  DisciplineCourse,
  DisciplineTeacher,
  DiscplineModule,
  Module,
  Room,
  Schedule,
  Teacher,
  TeacherAvailability,
  TimeSlot,
  User,
} from "../types";

export let users: User[] = [
  {
    id: 1,
    name: "Dra. Ana Clara",
    email: "ana@medicina.com",
    password: bcrypt.hashSync("12345678", 10),
    role: "teacher",
  },
  {
    id: 2,
    name: "Dr. Rafael Lima",
    email: "rafael@medicina.com",
    password: bcrypt.hashSync("12345678", 10),
    role: "teacher",
  },
  {
    id: 3,
    name: "Dr. Carlos Mendes",
    email: "carlos@medicina.com",
    password: bcrypt.hashSync("12345678", 10),
    role: "teacher",
  },
  {
    id: 4,
    name: "Dra. Mariana Costa",
    email: "mariana@medicina.com",
    password: bcrypt.hashSync("12345678", 10),
    role: "teacher",
  },
  {
    id: 5,
    name: "Admin",
    email: "admin@medicina.com",
    password: bcrypt.hashSync("12345678", 10),
    role: "admin",
  },
];

export let teachers: Teacher[] = [
  { id: 1, userId: 1, phone: "41 91234-5678" },
  { id: 2, userId: 2, phone: "41 97654-3210" },
  { id: 3, userId: 3, phone: "41 92345-6789" },
  { id: 4, userId: 4, phone: "41 93456-7890" },
];

export let disciplines: Discipline[] = [
  { id: 1, name: "Anatomia", totalHours: 60, requiredRoomType: "Laboratório" },
  { id: 2, name: "Fisiologia", totalHours: 60, requiredRoomType: "Sala comum" },
];

export let modules: Module[] = [
  { id: 1, name: "1º Módulo", totalStudents: 50 },
  { id: 2, name: "2º Módulo", totalStudents: 50 },
  { id: 3, name: "3º Módulo", totalStudents: 40 },
];

export let academicPeriods: AcademicPeriod[] = [
  { id: 1, name: "2024/1", startDate: "2024-02-01", endDate: "2024-06-30" },
];

export let disciplineModule: DiscplineModule[] = [
  { id: 1, disciplineId: 1, moduleId: 1, academicPeriodId: 1 },
  { id: 2, disciplineId: 2, moduleId: 1, academicPeriodId: 1 },
];

export let disciplineTeacher: DisciplineTeacher[] = [
  { id: 1, disciplineId: 1, teacherId: 1 },
  { id: 2, disciplineId: 2, teacherId: 2 },
  { id: 3, disciplineId: 3, teacherId: 3 },
  { id: 4, disciplineId: 4, teacherId: 4 },
  { id: 5, disciplineId: 5, teacherId: 1 },
];

export let rooms: Room[] = [
  { id: 1, name: "Laboratório A", seatsAmount: 60, type: "Laboratório" },
  { id: 2, name: "Laboratório B", seatsAmount: 40, type: "Laboratório" },
  { id: 3, name: "Sala 101", seatsAmount: 50, type: "Sala comum" },
  { id: 4, name: "Sala 102", seatsAmount: 50, type: "Sala comum" },
  { id: 5, name: "Sala 103", seatsAmount: 45, type: "Sala comum" },
  { id: 6, name: "Auditório", seatsAmount: 100, type: "Auditório" },
];

export let timeSlots: TimeSlot[] = [
  { id: 1, startTime: "08:00", endTime: "09:00" },
  { id: 2, startTime: "09:00", endTime: "10:00" },
  { id: 3, startTime: "10:00", endTime: "11:00" },
  { id: 4, startTime: "11:00", endTime: "12:00" },
  { id: 5, startTime: "13:00", endTime: "14:00" },
  { id: 6, startTime: "14:00", endTime: "15:00" },
  { id: 7, startTime: "15:00", endTime: "16:00" },
];

export let schedules: Schedule[] = [
  { id: 1, dayOfWeek: "Segunda-feira", timeSlotId: 1 },
  { id: 2, dayOfWeek: "Segunda-feira", timeSlotId: 2 },
  { id: 3, dayOfWeek: "Terça-feira", timeSlotId: 3 },
  { id: 4, dayOfWeek: "Terça-feira", timeSlotId: 4 },
  { id: 5, dayOfWeek: "Quarta-feira", timeSlotId: 5 },
  { id: 6, dayOfWeek: "Quarta-feira", timeSlotId: 6 },
  { id: 7, dayOfWeek: "Quinta-feira", timeSlotId: 7 },
  { id: 8, dayOfWeek: "Sexta-feira", timeSlotId: 1 },
  { id: 9, dayOfWeek: "Sexta-feira", timeSlotId: 2 },
];

export let teacherAvailability: TeacherAvailability[] = [
  { id: 1, teacherId: 1, scheduleId: 1, status: true },
  { id: 2, teacherId: 1, scheduleId: 2, status: true },
  { id: 3, teacherId: 1, scheduleId: 3, status: true },
  { id: 4, teacherId: 1, scheduleId: 5, status: true },
  { id: 5, teacherId: 1, scheduleId: 7, status: true },
  { id: 6, teacherId: 1, scheduleId: 8, status: true },

  { id: 7, teacherId: 2, scheduleId: 1, status: true },
  { id: 8, teacherId: 2, scheduleId: 3, status: true },
  { id: 9, teacherId: 2, scheduleId: 4, status: true },
  { id: 10, teacherId: 2, scheduleId: 5, status: true },
  { id: 11, teacherId: 2, scheduleId: 6, status: true },
  { id: 12, teacherId: 2, scheduleId: 9, status: true },

  { id: 13, teacherId: 3, scheduleId: 2, status: true },
  { id: 14, teacherId: 3, scheduleId: 4, status: true },
  { id: 15, teacherId: 3, scheduleId: 5, status: true },
  { id: 16, teacherId: 3, scheduleId: 6, status: true },
  { id: 17, teacherId: 3, scheduleId: 7, status: true },
  { id: 18, teacherId: 3, scheduleId: 8, status: true },

  { id: 19, teacherId: 4, scheduleId: 1, status: true },
  { id: 20, teacherId: 4, scheduleId: 2, status: true },
  { id: 21, teacherId: 4, scheduleId: 3, status: true },
  { id: 22, teacherId: 4, scheduleId: 4, status: true },
  { id: 23, teacherId: 4, scheduleId: 5, status: true },
  { id: 24, teacherId: 4, scheduleId: 6, status: true },
  { id: 25, teacherId: 4, scheduleId: 7, status: true },
  { id: 26, teacherId: 4, scheduleId: 8, status: true },
  { id: 27, teacherId: 4, scheduleId: 9, status: true },
];

export let courses: Course[] = [{ id: 1, name: "Medicina" }];

export let disciplineCourse: DisciplineCourse[] = [
  { id: 1, disciplineId: 1, courseId: 1 },
  { id: 2, disciplineId: 2, courseId: 1 },
  { id: 3, disciplineId: 3, courseId: 1 },
];

export let classSchedules: ClassSchedule[] = [];

export let classScheduleRooms: ClassScheduleRoom[] = [];
