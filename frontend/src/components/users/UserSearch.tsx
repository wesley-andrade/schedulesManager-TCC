import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface UserSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const UserSearch = ({ searchTerm, onSearchChange }: UserSearchProps) => {
  return (
    <div className="mb-6">
      <div className="relative max-w-md">
        <Search className="absolute left-2 top-2.5 h-5 w-5 text-gray-400" />
        <Input
          placeholder="Buscar usuários..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 border-gray-300"
        />
      </div>
    </div>
  );
};
