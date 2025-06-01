import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Room, RoomType, roomService } from "@/services/roomService";
import Header from "@/components/Header";
import { useUser } from "@/contexts/UserContext";
import { RoomTable } from "@/components/rooms/RoomTable";
import { RoomSearch } from "@/components/rooms/RoomSearch";
import { RoomDialog } from "@/components/rooms/RoomDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface RoomFormData {
  name: string;
  seatsAmount: string;
  type: RoomType;
}

interface RoomFormErrors {
  name?: string;
  seatsAmount?: string;
  type?: string;
}

const RoomManagement = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [formData, setFormData] = useState<RoomFormData>({
    name: "",
    seatsAmount: "",
    type: RoomType.Comum,
  });
  const [formErrors, setFormErrors] = useState<RoomFormErrors>({});
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser, logout } = useUser();

  useEffect(() => {
    document.title = "TimeWise - Gerenciar Salas";

    if (!currentUser) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para acessar esta página",
        variant: "destructive",
      });
      navigate("/");
      return;
    }

    if (currentUser.role !== "admin") {
      toast({
        title: "Erro",
        description: "Apenas administradores podem acessar esta página",
        variant: "destructive",
      });
      navigate("/dashboard");
      return;
    }

    loadRooms();
  }, [currentUser, navigate, toast]);

  const loadRooms = async () => {
    try {
      setIsLoading(true);
      const data = await roomService.getAllRooms();
      setRooms(Array.isArray(data) ? data : []);
    } catch (error) {
      if (
        error instanceof Error &&
        (error.message.includes("Sessão expirada") ||
          error.message.includes("Token de autenticação não encontrado"))
      ) {
        logout();
        navigate("/");
      }

      toast({
        title: "Erro",
        description:
          error instanceof Error
            ? error.message
            : "Erro ao carregar salas",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  const handleAddRoom = () => {
    setEditingRoom(null);
    setFormData({
      name: "",
      seatsAmount: "",
      type: RoomType.Comum,
    });
    setIsDialogOpen(true);
  };

  const handleEditRoom = (room: Room) => {
    setEditingRoom(room);
    setFormData({
      name: room.name,
      seatsAmount: room.seatsAmount.toString(),
      type: room.type,
    });
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (room: Room) => {
    setRoomToDelete(room);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!roomToDelete) return;

    try {
      await roomService.deleteRoom(roomToDelete.id);
      toast({
        title: "Sucesso",
        description: "Sala excluída com sucesso",
      });
      loadRooms();
    } catch (error) {
      toast({
        title: "Erro",
        description:
          error instanceof Error
            ? error.message
            : "Erro ao excluir sala",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setRoomToDelete(null);
    }
  };

  const validateForm = () => {
    const errors: RoomFormErrors = {};

    if (!formData.name) {
      errors.name = "Nome é obrigatório";
    }

    if (!formData.seatsAmount) {
      errors.seatsAmount = "Capacidade é obrigatória";
    } else {
      const seatsAmount = parseInt(formData.seatsAmount);
      if (isNaN(seatsAmount) || seatsAmount <= 0) {
        errors.seatsAmount = "Capacidade deve ser maior que zero";
      }
    }

    if (!formData.type) {
      errors.type = "Tipo é obrigatório";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const roomData = {
        name: formData.name,
        seatsAmount: parseInt(formData.seatsAmount),
        type: formData.type,
      };

      if (editingRoom) {
        await roomService.updateRoom(editingRoom.id, roomData);
        toast({
          title: "Sucesso",
          description: "Sala atualizada com sucesso",
        });
      } else {
        await roomService.createRoom(roomData);
        toast({
          title: "Sucesso",
          description: "Sala criada com sucesso",
        });
      }

      setIsDialogOpen(false);
      loadRooms();
    } catch (error) {
      toast({
        title: "Erro",
        description:
          error instanceof Error
            ? error.message
            : "Erro ao salvar sala",
        variant: "destructive",
      });
    }
  };

  const filteredRooms = (rooms ?? []).filter((room) =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />

      <div className="flex-1 container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <Button
              variant="ghost"
              className="mb-2 p-0 hover:bg-transparent text-blue-500 hover:text-blue-700"
              onClick={handleBackToDashboard}
            >
              &larr; Voltar ao Dashboard
            </Button>
            <h1 className="text-2xl font-bold text-gray-800">
              Gerenciar Salas
            </h1>
            <div className="h-1 w-24 bg-blue-500 mt-2 rounded-full"></div>
          </div>
          <Button
            onClick={handleAddRoom}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            <Plus className="h-5 w-5 mr-1" /> Adicionar Sala
          </Button>
        </div>

        <RoomSearch
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <RoomTable
          rooms={filteredRooms}
          isLoading={isLoading}
          onEdit={handleEditRoom}
          onDelete={handleDeleteClick}
        />

        <RoomDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          formData={formData}
          setFormData={setFormData}
          formErrors={formErrors}
          onSubmit={handleSubmit}
          isEditing={!!editingRoom}
        />

        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir a sala{" "}
                {roomToDelete?.name}? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default RoomManagement; 