import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import { useUser } from "@/contexts/UserContext";

interface HeaderProps {
  showLogout?: boolean;
}

const Header = ({ showLogout = true }: HeaderProps) => {
  const navigate = useNavigate();
  const { currentUser } = useUser();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Logo size="md" variant="dark" />
        {showLogout && currentUser && (
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="text-gray-600 hover:text-gray-900"
          >
            Sair
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
