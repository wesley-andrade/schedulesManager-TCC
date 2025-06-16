import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, ClipboardList, DoorOpen, Link } from "lucide-react";
import {
  Calendar,
  BookOpen,
  Clock,
  CalendarCheck,
  UserCog,
} from "lucide-react";
import { ROUTES } from "@/config/routes";

const managementOptions = [
  {
    title: "Períodos Acadêmicos",
    icon: <Calendar className="h-5 w-5" />,
    path: ROUTES.ACADEMIC_PERIODS,
  },
  {
    title: "Disciplinas",
    icon: <BookOpen className="h-5 w-5" />,
    path: ROUTES.DISCIPLINES,
  },
  {
    title: "Horários",
    icon: <Clock className="h-5 w-5" />,
    path: ROUTES.SCHEDULES,
  },
  {
    title: "Vincular Professores",
    icon: <Link className="h-5 w-5" />,
    path: ROUTES.TEACHER_DISCIPLINES,
  },
  {
    title: "Disponibilidades",
    icon: <CalendarCheck className="h-5 w-5" />,
    path: ROUTES.AVAILABILITIES,
  },
  {
    title: "Salas",
    icon: <DoorOpen className="h-5 w-5" />,
    path: ROUTES.ROOMS,
  },
  {
    title: "Turmas",
    icon: <ClipboardList className="h-5 w-5" />,
    path: ROUTES.CLASSES,
  },
  {
    title: "Usuários",
    icon: <UserCog className="h-5 w-5" />,
    path: ROUTES.USERS,
  },
];

export const ManagementMenu = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-700 px-1">Gerenciamento</h3>
      {managementOptions.map((option, index) => (
        <Card
          key={index}
          className="shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-200 hover:border-blue-300 hover:bg-blue-50"
          onClick={() => navigate(option.path)}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-full text-blue-500">
                  {option.icon}
                </div>
                <span className="font-medium text-gray-700">
                  {option.title}
                </span>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-500" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
