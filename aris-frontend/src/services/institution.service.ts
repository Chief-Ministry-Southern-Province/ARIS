import api from "./api";
import type { Institution,createInstitutionRequest,updateInstitutionRequest } from "../types/Institution.type";

export const getInstitutions = async (): Promise<Institution[]> => {
  const response = await api.get("/institutions");
  return response.data;
};

export const getInstitutionById = async (id: number): Promise<Institution> => {
  const response = await api.get(`/institutions/${id}`);
  return response.data;
};

export const createInstitution = async (institutionData: createInstitutionRequest): Promise<Institution> => {
  const response = await api.post("/institutions", institutionData);
  return response.data;
};

export const updateInstitution = async (id: number, institutionData: updateInstitutionRequest): Promise<Institution> => {
  const response = await api.put(`/institutions/${id}`, institutionData);
  return response.data;
};

export const deleteInstitution = async (id: number): Promise<void> => {
  await api.delete(`/institutions/${id}`);
};

export const getAllowedInstitutionTypes = async (): Promise<string[]> => {
  const response = await api.get("/institution-types");
  return response.data.types;
}