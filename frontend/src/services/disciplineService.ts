import { api } from "./api";
import { RoomType } from "./roomService";

export interface Discipline {
  id: number;
  name: string;
  totalHours: number;
  requiredRoomType: RoomType;
  disciplineCourses?: {
    id: number;
    course: {
      id: number;
      name: string;
    };
  }[];
}

export interface DisciplinePayload {
  name: string;
  totalHours: number;
  requiredRoomType: RoomType;
  courseId?: number;
}

export const disciplineService = {
  async getAllDisciplines(): Promise<Discipline[]> {
    const { data } = await api.get<Discipline[]>("/disciplines");
    return data;
  },

  async createDiscipline(disciplineData: DisciplinePayload): Promise<Discipline> {
    const { data } = await api.post<Discipline>(
      "/disciplines",
      disciplineData,
    );
    return data;
  },

  async updateDiscipline(
    id: number,
    disciplineData: DisciplinePayload,
  ): Promise<Discipline> {
    const { data } = await api.put<Discipline>(
      `/disciplines/${id}`,
      disciplineData,
    );
    return data;
  },

  async deleteDiscipline(id: number): Promise<void> {
    await api.delete(`/disciplines/${id}`);
  },
};
