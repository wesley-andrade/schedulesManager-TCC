import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import {
  Calendar,
  BookOpen,
  Clock,
  UserPlus,
  CalendarCheck,
  Building2,
  Users,
  UserCog,
} from "lucide-react";

const managementOptions = [
  {
    title: "Períodos Acadêmicos",
    icon: <Calendar className="h-5 w-5" />,
    path: "/academic-periods",
  },
  {
    title: "Disciplinas",
    icon: <BookOpen className="h-5 w-5" />,
    path: "/disciplines",
  },
  {
    title: "Horários",
    icon: <Clock className="h-5 w-5" />,
    path: "/schedules",
  },
  {
    title: "Vincular Professores",
    icon: <UserPlus className="h-5 w-5" />,
    path: "/teachers",
  },
  {
    title: "Disponibilidades",
    icon: <CalendarCheck className="h-5 w-5" />,
    path: "/availabilities",
  },
  {
    title: "Salas",
    icon: <Building2 className="h-5 w-5" />,
    path: "/rooms",
  },
  {
    title: "Turmas",
    icon: <Users className="h-5 w-5" />,
    path: "/classes",
  },
  {
    title: "Usuários",
    icon: <UserCog className="h-5 w-5" />,
    path: "/users",
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
