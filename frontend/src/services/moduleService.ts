import { api } from "./api";

export interface Module {
  id: number;
  name: string;
  totalStudents: number;
}

export const moduleService = {
  async getAllModules(): Promise<Module[]> {
    const { data } = await api.get<Module[]>("/modules");
    return data;
  },

  async createModule(moduleData: Omit<Module, "id">): Promise<Module> {
    const { data } = await api.post<Module>("/modules", moduleData);
    return data;
  },

  async updateModule(id: number, moduleData: Partial<Module>): Promise<Module> {
    const { data } = await api.put<Module>(`/modules/${id}`, moduleData);
    return data;
  },

  async deleteModule(id: number): Promise<void> {
    await api.delete(`/modules/${id}`);
  },
};
