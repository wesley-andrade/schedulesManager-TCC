import { Module } from "../types";
import { modules } from "../data/mockData";

const getAllModules = (): Module[] => {
  return modules;
};

const getModuleById = (id: number): Module | undefined => {
  return modules.find((m) => m.id === id);
};

const create = (name: string, totalStudents: number): Module => {
  const newModule: Module = {
    id: Math.floor(Math.random() * 9999),
    name,
    totalStudents,
  };
  modules.push(newModule);
  return newModule;
};

const update = (
  id: number,
  updates: Partial<Omit<Module, "id">>
): Module | undefined => {
  const index = modules.findIndex((m) => m.id === id);
  if (index === -1) return undefined;

  modules[index] = { ...modules[index], ...updates };
  return modules[index];
};

const deleteModule = (id: number): boolean => {
  const index = modules.findIndex((m) => m.id === id);
  if (index === -1) return false;

  modules.splice(index, 1);
  return true;
};

export default {
  getAllModules,
  getModuleById,
  create,
  update,
  delete: deleteModule,
};
