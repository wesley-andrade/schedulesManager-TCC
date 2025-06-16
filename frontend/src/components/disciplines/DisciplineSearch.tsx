import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface DisciplineSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  className?: string;
}

export const DisciplineSearch = ({
  searchTerm,
  onSearchChange,
}: DisciplineSearchProps) => {
  return (
    <div className="mb-6">
      <div className="relative max-w-md">
        <Search className="absolute left-2 top-2.5 h-5 w-5 text-gray-400" />
        <Input
          placeholder="Buscar disciplinas..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 border-gray-300 w-full"
        />
      </div>
    </div>
  );
};
