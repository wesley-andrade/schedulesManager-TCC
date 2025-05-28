import { User } from "@/services/userService";
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
import { formatPhoneNumber } from "@/utils/formatters";

interface UserTableProps {
  users: User[];
  isLoading: boolean;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export const UserTable = ({
  users,
  isLoading,
  onEdit,
  onDelete,
}: UserTableProps) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="text-gray-700 font-bold">Nome</TableHead>
            <TableHead className="text-gray-700 font-bold">Email</TableHead>
            <TableHead className="text-gray-700 font-bold">Telefone</TableHead>
            <TableHead className="text-gray-700 font-bold">Tipo</TableHead>
            <TableHead className="text-gray-700 font-bold text-right">
              Ações
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                Carregando...
              </TableCell>
            </TableRow>
          ) : users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                Nenhum usuário encontrado.
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow
                key={user.id}
                className="hover:bg-blue-50 transition-colors border-t border-gray-200"
              >
                <TableCell>{user.name}</TableCell>
                <TableCell className="text-gray-600">{user.email}</TableCell>
                <TableCell>{formatPhoneNumber(user.phone)}</TableCell>
                <TableCell>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.role === "admin"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {user.role === "admin" ? "Administrador" : "Padrão"}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(user)}
                    className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 mr-1"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(user)}
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
