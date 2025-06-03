import { Room } from "@/services/roomService";
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
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface RoomTableProps {
  rooms: Room[];
  isLoading: boolean;
  onEdit: (room: Room) => void;
  onDelete: (room: Room) => void;
}

export const RoomTable = ({
  rooms,
  isLoading,
  onEdit,
  onDelete,
}: RoomTableProps) => {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Room;
    direction: "asc" | "desc";
  } | null>(null);

  const getTypeColor = (type: Room["type"]) => {
    switch (type) {
      case "Comum":
        return "bg-blue-100 text-blue-800";
      case "Laboratório":
        return "bg-green-100 text-green-800";
      case "Auditório":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleSort = (key: keyof Room) => {
    setSortConfig((prev) => {
      if (prev && prev.key === key) {
        if (prev.direction === "asc") return { key, direction: "desc" };
        if (prev.direction === "desc") return null;
      }
      return { key, direction: "asc" };
    });
  };

  const getSortIcon = (key: keyof Room) => {
    if (!sortConfig || sortConfig.key !== key)
      return <span style={{ visibility: "hidden" }}>↑</span>;
    return sortConfig.direction === "asc" ? "↑" : "↓";
  };

  const sortedRooms = (() => {
    if (!sortConfig) return rooms;
    const sorted = [...rooms];
    sorted.sort((a, b) => {
      const { key, direction } = sortConfig;
      let aValue = a[key];
      let bValue = b[key];
      if (typeof aValue === "string" && typeof bValue === "string") {
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
              onClick={() => handleSort("seatsAmount")}
            >
              Capacidade {getSortIcon("seatsAmount")}
            </TableHead>
            <TableHead
              className="text-gray-700 font-bold cursor-pointer select-none"
              onClick={() => handleSort("type")}
            >
              Tipo {getSortIcon("type")}
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
          ) : sortedRooms.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                Nenhuma sala encontrada.
              </TableCell>
            </TableRow>
          ) : (
            sortedRooms.map((room) => (
              <TableRow
                key={room.id}
                className="hover:bg-blue-50 transition-colors border-t border-gray-200"
              >
                <TableCell>{room.name}</TableCell>
                <TableCell>{room.seatsAmount} lugares</TableCell>
                <TableCell>
                  <Badge className={`${getTypeColor(room.type)} capitalize`}>
                    {room.type}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(room)}
                    className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 mr-1"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(room)}
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
