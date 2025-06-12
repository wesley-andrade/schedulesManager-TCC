import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ROUTES } from "@/config/routes";
import Index from "./pages/Index";
import Login from "./pages/Login";
import UserManagement from "./pages/UserManagement";
import AcademicPeriodManagement from "./pages/AcademicPeriodManagement";
import RoomManagement from "./pages/RoomManagement";
import ModuleManagement from "./pages/ModuleManagement";
import ScheduleManagement from "@/pages/ScheduleManagement";
import TeacherDisciplineManagement from "@/pages/TeacherDisciplineManagement";
import DisciplineManagement from "@/pages/DisciplineManagement";
import TeacherAvailabilityManagement from "@/pages/TeacherAvailabilityManagement";
import { UserProvider } from "./contexts/UserContext";
import { CalendarProvider } from "./contexts/CalendarContext";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <CalendarProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              <Route path={ROUTES.HOME} element={<Login />} />
              <Route
                path={ROUTES.DASHBOARD}
                element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.USERS}
                element={
                  <ProtectedRoute>
                    <UserManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.ACADEMIC_PERIODS}
                element={
                  <ProtectedRoute>
                    <AcademicPeriodManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.ROOMS}
                element={
                  <ProtectedRoute>
                    <RoomManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.CLASSES}
                element={
                  <ProtectedRoute>
                    <ModuleManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.SCHEDULES}
                element={
                  <ProtectedRoute>
                    <ScheduleManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.TEACHER_DISCIPLINES}
                element={
                  <ProtectedRoute>
                    <TeacherDisciplineManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.DISCIPLINES}
                element={
                  <ProtectedRoute>
                    <DisciplineManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.AVAILABILITIES}
                element={
                  <ProtectedRoute>
                    <TeacherAvailabilityManagement />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CalendarProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
