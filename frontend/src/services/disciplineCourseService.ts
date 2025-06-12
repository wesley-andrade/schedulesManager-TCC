import { api } from "./api";

export interface DisciplineCoursePayload {
  disciplineId: number;
  courseId: number;
}

export const disciplineCourseService = {
  async createDisciplineCourse(data: DisciplineCoursePayload) {
    const response = await api.post("/discipline-courses", data);
    return response.data;
  },
  async deleteDisciplineCourse(associationId: number) {
    await api.delete(`/discipline-courses/${associationId}`);
  },
};
