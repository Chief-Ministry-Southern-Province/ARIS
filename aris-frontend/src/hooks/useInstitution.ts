import { useState } from "react";
import type{ Institution,createInstitutionRequest,updateInstitutionRequest } from "@/types/Institution.type";
import {getInstitutions,getInstitutionById,createInstitution,updateInstitution,deleteInstitution } from "@/services/institution.service";

export const useGetInstitutions = () => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [institutions, setInstitutions] = useState<Institution[]>([]);

  const fetchInstitutions = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getInstitutions();
      setInstitutions(response);
      return response;
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to fetch institutions";

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchInstitutions,
    institutions,
    loading,
    error,
  };
};

export const useGetInstitutionById = () => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [institution, setInstitution] = useState<Institution | null>(null);

  const fetchInstitutionById = async (id: string) => {
    try {
      setLoading(true);
      setError("");
      const response = await getInstitutionById(Number(id));
      setInstitution(response);
      return response;
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to fetch institution";

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchInstitutionById,
    institution,
    loading,
    error,
  };


}

export const useCreateInstitution = () => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const createNewInstitution = async (institutionData: createInstitutionRequest) => {
    try {
      setLoading(true);
      setError("");

      const response = await createInstitution(institutionData);
      return response;
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to create institution";

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createNewInstitution,
    loading,
    error,
  };
};

export const useUpdateInstitution = () => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateInstitutionData = async (id:string,institutionData: updateInstitutionRequest) => {
    try {
      setLoading(true);
      setError("");

      const response = await updateInstitution(Number(id), institutionData);
      return response;
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to update institution";

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateInstitutionData,
    loading,
    error,
  };
};

export const useDeleteInstitution = () => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const deleteInstitutionData = async (id:string) => {
    try {
      setLoading(true);
      setError("");

      const response = await deleteInstitution(Number(id));
      return response;
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to delete institution";

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteInstitutionData,
    loading,
    error,
  };
};
