import { Card, CardContent } from "@/components/ui/card";
import { LayoutGrid } from "lucide-react";

interface DashboardStatsProps {
  totalRooms: number;
  totalDisciplines: number;
  totalTeachers: number;
}

export const DashboardStats = ({
  totalRooms,
  totalDisciplines,
  totalTeachers,
}: DashboardStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-none shadow-lg hover:shadow-xl transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total de Salas</p>
              <h3 className="text-3xl font-bold mt-1">{totalRooms}</h3>
            </div>
            <div className="bg-white/20 p-3 rounded-full">
              <LayoutGrid className="h-6 w-6" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-none shadow-lg hover:shadow-xl transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Total de Disciplinas</p>
              <h3 className="text-3xl font-bold mt-1">{totalDisciplines}</h3>
            </div>
            <div className="bg-white/20 p-3 rounded-full">
              <LayoutGrid className="h-6 w-6" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-none shadow-lg hover:shadow-xl transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Total de Professores</p>
              <h3 className="text-3xl font-bold mt-1">{totalTeachers}</h3>
            </div>
            <div className="bg-white/20 p-3 rounded-full">
              <LayoutGrid className="h-6 w-6" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
