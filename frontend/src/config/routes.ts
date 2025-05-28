export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  USERS: "/users",
  ACADEMIC_PERIODS: "/academic-periods",
  ROOMS: "/rooms",
  DISCIPLINES: "/disciplines",
  TEACHERS: "/teachers",
  SCHEDULES: "/schedules",
} as const;

export const PUBLIC_ROUTES = [ROUTES.LOGIN] as const;
export const PROTECTED_ROUTES = [
  ROUTES.HOME,
  ROUTES.DASHBOARD,
  ROUTES.USERS,
  ROUTES.ACADEMIC_PERIODS,
  ROUTES.ROOMS,
  ROUTES.DISCIPLINES,
  ROUTES.TEACHERS,
  ROUTES.SCHEDULES,
] as const;
