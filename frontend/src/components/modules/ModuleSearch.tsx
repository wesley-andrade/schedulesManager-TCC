import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ModuleSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const ModuleSearch = ({
  searchTerm,
  onSearchChange,
}: ModuleSearchProps) => {
  return (
    <div className="mb-6">
      <div className="relative max-w-md">
        <Search className="absolute left-2 top-2.5 h-5 w-5 text-gray-400" />
        <Input
          placeholder="Buscar turmas..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 border-gray-300"
        />
      </div>
    </div>
  );
}; 