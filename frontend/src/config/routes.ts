export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  USERS: "/users",
  ACADEMIC_PERIODS: "/academic-periods",
  ROOMS: "/rooms",
  CLASSES: "/classes",
  SCHEDULES: "/schedules",
  AVAILABILITIES: "/availabilities",
  DISCIPLINES: "/disciplines",
  TEACHER_DISCIPLINES: "/teacher-disciplines",
} as const;

export const PUBLIC_ROUTES = [ROUTES.LOGIN] as const;
export const PROTECTED_ROUTES = [
  ROUTES.HOME,
  ROUTES.DASHBOARD,
  ROUTES.USERS,
  ROUTES.ACADEMIC_PERIODS,
  ROUTES.ROOMS,
  ROUTES.CLASSES,
  ROUTES.SCHEDULES,
  ROUTES.AVAILABILITIES,
  ROUTES.DISCIPLINES,
  ROUTES.TEACHER_DISCIPLINES,
] as const;
