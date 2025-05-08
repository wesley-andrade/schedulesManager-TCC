import { AcademicPeriod } from "../types";
import { academicPeriods } from "../data/mockData";

const getAllAcademicPeriods = (): AcademicPeriod[] => {
  return academicPeriods;
};

const getAcademicPeriodById = (id: number): AcademicPeriod | undefined => {
  return academicPeriods.find((ap) => ap.id === id);
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
  academicPeriods.push(newAcademicPeriod);
  return newAcademicPeriod;
};

const updateAcademicPeriod = (
  id: number,
  updates: Partial<Omit<AcademicPeriod, "id">>
): AcademicPeriod | undefined => {
  const index = academicPeriods.findIndex((ap) => ap.id === id);
  if (index === -1) return undefined;

  academicPeriods[index] = { ...academicPeriods[index], ...updates };
  return academicPeriods[index];
};

const deleteAcademicPeriod = (id: number): boolean => {
  const index = academicPeriods.findIndex((ap) => ap.id === id);
  if (index === -1) return false;

  academicPeriods.splice(index, 1);
  return true;
};

export default {
  getAllAcademicPeriods,
  getAcademicPeriodById,
  createAcademicPeriod,
  updateAcademicPeriod,
  deleteAcademicPeriod,
};
