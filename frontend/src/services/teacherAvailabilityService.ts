import { api } from "./api";

export interface TeacherAvailability {
  id: number;
  teacherId: number;
  scheduleId: number;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTeacherAvailabilityData {
  teacherId: number;
  scheduleId: number;
  status: boolean;
}

export interface UpdateTeacherAvailabilityData {
  teacherId?: number;
  scheduleId?: number;
  status?: boolean;
}

class TeacherAvailabilityService {
  async getAllTeacherAvailability(): Promise<TeacherAvailability[]> {
    const response = await api.get<TeacherAvailability[]>(
      "/teacher-availability"
    );
    return response.data;
  }

  async getTeacherAvailabilityById(id: number): Promise<TeacherAvailability> {
    const response = await api.get<TeacherAvailability>(
      `/teacher-availability/${id}`
    );
    return response.data;
  }

  async createTeacherAvailability(
    teacherId: number,
    scheduleId: number,
    status: boolean
  ): Promise<TeacherAvailability> {
    const response = await api.post<TeacherAvailability>(
      "/teacher-availability",
      {
        teacherId,
        scheduleId,
        status,
      }
    );
    return response.data;
  }

  async updateTeacherAvailability(
    id: number,
    data: UpdateTeacherAvailabilityData
  ): Promise<TeacherAvailability> {
    const response = await api.put<TeacherAvailability>(
      `/teacher-availability/${id}`,
      data
    );
    return response.data;
  }

  async deleteTeacherAvailability(id: number): Promise<void> {
    await api.delete(`/teacher-availability/${id}`);
  }

  async getTeacherAvailabilityByTeacherId(
    teacherId: number
  ): Promise<TeacherAvailability[]> {
    const response = await api.get<TeacherAvailability[]>(
      `/teacher-availability/teacher/${teacherId}`
    );
    return response.data;
  }

  async getTeacherAvailabilityByScheduleId(
    scheduleId: number
  ): Promise<TeacherAvailability[]> {
    const response = await api.get<TeacherAvailability[]>(
      `/teacher-availability/schedule/${scheduleId}`
    );
    return response.data;
  }
}

export const teacherAvailabilityService = new TeacherAvailabilityService();
