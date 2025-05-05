import { availabilityExceptions, teacherAvailability } from "../data/mockData";
import { TeacherAvailability } from "../types";

const getAllTeacherAvailability = (): TeacherAvailability[] => {
  return teacherAvailability.map((avaivability) => ({
    ...avaivability,
    exceptionDates: availabilityExceptions
      .filter(
        (exceptions) => exceptions.teacherAvailabilityId === avaivability.id
      )
      .map((exceptions) => exceptions.exceptionDate),
  }));
};

const getTeacherAvailabilityById = (
  id: number
): TeacherAvailability | undefined => {
  const availability = teacherAvailability.find(
    (availability) => availability.id === id
  );
  if (!availability) return undefined;

  const exceptions = availabilityExceptions
    .filter(
      (exceptions) => exceptions.teacherAvailabilityId === availability.id
    )
    .map((exceptions) => exceptions.exceptionDate);

  return {
    ...availability,
    exceptionDates: exceptions,
  };
};

const createTeacherAvailability = (
  teacherId: number,
  scheduleId: number,
  status: boolean,
  exceptionDates: string[] = []
): TeacherAvailability => {
  const newAvailability: TeacherAvailability = {
    id: Math.floor(Math.random() * 9999),
    teacherId,
    scheduleId,
    status,
  };
  teacherAvailability.push(newAvailability);

  exceptionDates.forEach((date) => {
    availabilityExceptions.push({
      id: Math.floor(Math.random() * 9999),
      teacherAvailabilityId: newAvailability.id,
      exceptionDate: date,
    });
  });

  return newAvailability;
};

const updateTeacherAvailability = (
  id: number,
  updates: Partial<Omit<TeacherAvailability, "id">> & {
    exceptionDates?: string[];
  }
): TeacherAvailability | undefined => {
  const index = teacherAvailability.findIndex(
    (availability) => availability.id === id
  );
  if (index === -1) return undefined;

  teacherAvailability[index] = {
    ...teacherAvailability[index],
    ...updates,
  };

  if (updates.exceptionDates) {
    for (let i = availabilityExceptions.length - 1; i >= 0; i--) {
      if (availabilityExceptions[i].teacherAvailabilityId === id) {
        availabilityExceptions.splice(i, 1);
      }
    }

    updates.exceptionDates.forEach((date) => {
      availabilityExceptions.push({
        id: Math.floor(Math.random() * 9999),
        teacherAvailabilityId: id,
        exceptionDate: date,
      });
    });
  }

  return getTeacherAvailabilityById(id);
};

const deleteTeacherAvailability = (id: number): boolean => {
  const index = teacherAvailability.findIndex(
    (availability) => availability.id === id
  );
  if (index === -1) return false;

  teacherAvailability.splice(index, 1);

  for (let i = availabilityExceptions.length - 1; i >= 0; i--) {
    if (availabilityExceptions[i].teacherAvailabilityId === id) {
      availabilityExceptions.splice(i, 1);
    }
  }

  return true;
};

export default {
  getAllTeacherAvailability,
  getTeacherAvailabilityById,
  createTeacherAvailability,
  updateTeacherAvailability,
  deleteTeacherAvailability,
};
