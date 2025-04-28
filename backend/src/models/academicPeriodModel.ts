import { AcademicPeriod } from "../types";
import { academicPeriod } from "../data/mockData";

const getAllAcademicPeriods = (): AcademicPeriod[] => {
  return academicPeriod;
};

const getAcademicPeriodById = (id: number): AcademicPeriod | undefined => {
  return academicPeriod.find((ap) => ap.id === id);
};

const createAcademicPeriod = (
  name: string,
  startDate: string,
  endDate: string
): AcademicPeriod => {
  const newAcademicPeriod: AcademicPeriod = {
    id: Math.floor(Math.random() * 9999),
    name,
    startDate,
    endDate,
  };
  academicPeriod.push(newAcademicPeriod);
  return newAcademicPeriod;
};

const updateAcademicPeriod = (
  id: number,
  updates: Partial<Omit<AcademicPeriod, "id">>
): AcademicPeriod | undefined => {
  const index = academicPeriod.findIndex((ap) => ap.id === id);
  if (index === -1) return undefined;

  academicPeriod[index] = { ...academicPeriod[index], ...updates };
  return academicPeriod[index];
};

const deleteAcademicPeriod = (id: number): boolean => {
  const index = academicPeriod.findIndex((ap) => ap.id === id);
  if (index === -1) return false;

  academicPeriod.splice(index, 1);
  return true;
};

export default {
  getAllAcademicPeriods,
  getAcademicPeriodById,
  createAcademicPeriod,
  updateAcademicPeriod,
  deleteAcademicPeriod,
};
