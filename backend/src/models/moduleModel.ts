import { Module } from "../types";
import { module } from "../data/mockData";

const getAllModules = (): Module[] => {
  return module;
};

const getModuleById = (id: number): Module | undefined => {
  return module.find((m) => m.id === id);
};

const create = (name: string, totalStudents: number): Module => {
  const newModule: Module = {
    id: Math.floor(Math.random() * 9999),
    name,
    totalStudents,

  };
  module.push(newModule);
  return newModule;
};

const update = (
  id: number,
  updates: Partial<Omit<Module, "id">>
): Module | undefined => {
  const index = module.findIndex((m) => m.id === id);
  if (index === -1) return undefined;

  module[index] = { ...module[index], ...updates };
  return module[index];
};

const deleteModule = (id: number): boolean => {
  const index = module.findIndex((m) => m.id === id);
  if (index === -1) return false;

  module.splice(index, 1);
  return true;
};

export default {
  getAllModules,
  getModuleById,
  create,
  update,
  delete: deleteModule,
};


