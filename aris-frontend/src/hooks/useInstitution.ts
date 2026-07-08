import { useState } from "react";
import type{ Institution, PaginatedInstitutionsResponse,createInstitutionRequest,updateInstitutionRequest } from "@/types/Institution.type";
import {getInstitutions,getInstitutionById,createInstitution,updateInstitution,deleteInstitution, getAllowedInstitutionTypes,getParentInstitutions } from "@/services/institution.service";

export const useGetInstitutions = ({page,search}: {page: number;search: string;}) => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [pagination, setPagination] = useState<Pick<PaginatedInstitutionsResponse, "current_page" | "last_page" | "per_page" | "total">>({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  });

  const fetchInstitutions = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getInstitutions({page,search});
      setInstitutions(response.data);
      setPagination({
        current_page: response.current_page,
        last_page: response.last_page,
        per_page: response.per_page,
        total: response.total,
      });
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
    pagination,
    loading,
    error,
  };
};

export const useGetInstitutionById = () => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [institution, setInstitution] = useState<Institution>();

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

export const useGetAllowedInstitutionTypes = () => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [institutionTypes, setInstitutionTypes] = useState<string[]>([]);

  const fetchAllowedInstitutionTypes = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAllowedInstitutionTypes();
      setInstitutionTypes(response);
      return response;
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to fetch allowed institution types";

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchAllowedInstitutionTypes,
    institutionTypes,
    loading,
    error,
  };
};

export const useGetParentInstitutions = () => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [parentInstitutions, setParentInstitutions] = useState<Institution[]>([]);

  const fetchParentInstitutions = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getParentInstitutions();
      setParentInstitutions(response);
      return response;
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to fetch parent institutions";

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchParentInstitutions,
    parentInstitutions,
    loading,
    error,
  };
};
