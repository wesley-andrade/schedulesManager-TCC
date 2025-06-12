import { api } from "./api";

export interface Course {
  id: number;
  name: string;
}

export const courseService = {
  async getAllCourses(): Promise<Course[]> {
    const response = await api.get("/courses");
    return response.data;
  },
};
