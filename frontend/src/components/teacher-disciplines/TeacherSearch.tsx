import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface TeacherSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const TeacherSearch = ({
  searchTerm,
  onSearchChange,
}: TeacherSearchProps) => {
  return (
    <div className="mb-6">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Buscar professor..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
    </div>
  );
};
