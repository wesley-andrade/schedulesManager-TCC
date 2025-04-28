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
    name: "Dr. João",
    email: "joao@medicina.com",
    password: bcrypt.hashSync("12345678", 10),
    role: "teacher",
  },
  {
    id: 2,
    name: "Admin",
    email: "admin@medicina.com",
    password: bcrypt.hashSync("12345678", 10),
    role: "admin",
  },
];

export let teachers: Teacher[] = [{ id: 1, userId: 1, phone: "99 999999999" }];

export let courses: Course[] = [{ id: 1, name: "Medicina" }];

export let module: Module[] = [{ id: 1, name: "1º Módulo", totalStudents: 60 }];

export let academicPeriod: AcademicPeriod[] = [
  {
    id: 1,
    name: "2023/2",
    startDate: "2023-08-01",
    endDate: "2024-01-31",
  },
];

export let disciplines: Discipline[] = [
  {
    id: 1,
    name: "Anatomia",
    totalHours: 60,
  },
];

export let disciplineModule: DiscplineModule[] = [
  {
    id: 1,
    disciplineId: 1,
    moduleId: 1,
    academicPeriodId: 1,
  },
];

export let disciplineCourse: DisciplineCourse[] = [
  { id: 1, disciplineId: 1, courseId: 1 },
];

export let timeSlots: TimeSlot[] = [
  { id: 1, startTime: "08:00", endTime: "09:00" },
];

export let schedules: Schedule[] = [
  { id: 1, dayOfWeek: "Segunda-feira", timeSlotId: 1 },
];

export let teacherAvailability: TeacherAvailability[] = [
  { id: 1, teacherId: 1, status: true, scheduleId: 1 },
];

export let disciplineTeacher: DisciplineTeacher[] = [
  { id: 1, disciplineId: 1, teacherId: 1 },
];

export let room: Room[] = [
  { id: 1, name: "Sala 101", seatsAmount: 60, type: "Laboratório" },
];

export let classScheduleRoom: ClassScheduleRoom[] = [
  { id: 1, classScheduleId: 1, roomId: 1 },
];

export let classSchedule: ClassSchedule[] = [
  { id: 1, scheduleId: 1, disciplineTeacherId: 1 },
];
