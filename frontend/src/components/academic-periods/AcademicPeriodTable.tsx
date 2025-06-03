import { AcademicPeriod } from "@/services/academicPeriodService";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";

interface AcademicPeriodTableProps {
  periods: AcademicPeriod[];
  isLoading: boolean;
  onEdit: (period: AcademicPeriod) => void;
  onDelete: (period: AcademicPeriod) => void;
}

export const AcademicPeriodTable = ({
  periods,
  isLoading,
  onEdit,
  onDelete,
}: AcademicPeriodTableProps) => {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof AcademicPeriod;
    direction: "asc" | "desc";
  } | null>(null);

  const handleSort = (key: keyof AcademicPeriod) => {
    setSortConfig((prev) => {
      if (prev && prev.key === key) {
        if (prev.direction === "asc") return { key, direction: "desc" };
        if (prev.direction === "desc") return null;
      }
      return { key, direction: "asc" };
    });
  };

  const getSortIcon = (key: keyof AcademicPeriod) => {
    if (!sortConfig || sortConfig.key !== key)
      return <span style={{ visibility: "hidden" }}>↑</span>;
    return sortConfig.direction === "asc" ? "↑" : "↓";
  };

  const sortedPeriods = (() => {
    if (!sortConfig) return periods;
    const sorted = [...periods];
    sorted.sort((a, b) => {
      const { key, direction } = sortConfig;
      let aValue = a[key];
      let bValue = b[key];
      if (key === "startDate" || key === "endDate") {
        aValue = new Date(aValue as string).getTime();
        bValue = new Date(bValue as string).getTime();
      } else if (typeof aValue === "string" && typeof bValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      if (aValue < bValue) return direction === "asc" ? -1 : 1;
      if (aValue > bValue) return direction === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  })();

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead
              className="text-gray-700 font-bold cursor-pointer select-none"
              onClick={() => handleSort("name")}
            >
              Nome {getSortIcon("name")}
            </TableHead>
            <TableHead
              className="text-gray-700 font-bold cursor-pointer select-none"
              onClick={() => handleSort("startDate")}
            >
              Data de Início {getSortIcon("startDate")}
            </TableHead>
            <TableHead
              className="text-gray-700 font-bold cursor-pointer select-none"
              onClick={() => handleSort("endDate")}
            >
              Data de Término {getSortIcon("endDate")}
            </TableHead>
            <TableHead className="text-gray-700 font-bold text-right">
              Ações
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                Carregando...
              </TableCell>
            </TableRow>
          ) : sortedPeriods.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                Nenhum período acadêmico encontrado.
              </TableCell>
            </TableRow>
          ) : (
            sortedPeriods.map((period) => (
              <TableRow
                key={period.id}
                className="hover:bg-blue-50 transition-colors border-t border-gray-200"
              >
                <TableCell>{period.name}</TableCell>
                <TableCell>
                  {format(new Date(period.startDate), "dd/MM/yyyy", {
                    locale: ptBR,
                  })}
                </TableCell>
                <TableCell>
                  {format(new Date(period.endDate), "dd/MM/yyyy", {
                    locale: ptBR,
                  })}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(period)}
                    className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 mr-1"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(period)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
