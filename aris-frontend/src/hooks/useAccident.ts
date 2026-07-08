import { useState } from "react";
import type {
  AccidentResponse,
  CreateAccidentRequest,
  UpdateAccidentRequest,
} from "@/types/accident.type";
import {
  getAccidents,
  getAccident,
  createAccident,
  updateAccident,
  deleteAccident,
} from "@/services/accident.service";

export const useGetAccidents = () => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [accidents, setAccidents] = useState<AccidentResponse[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchAccidents = async ({
    page,
    search,
    status,
    severity,
  }: {
    page: number;
    search?: string;
    status?: string;
    severity?: string;
  }) => {
    try {
      setLoading(true);
      setError("");

      const response = await getAccidents(page, search, status, severity);
      setAccidents(response.data);
      setCurrentPage(response.current_page ?? 1);
      setLastPage(response.last_page ?? 1);
      setTotal(response.total ?? response.data.length ?? 0);
      return response;
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to fetch accidents";

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchAccidents,
    accidents,
    loading,
    error,
    currentPage,
    setCurrentPage,
    lastPage,
    setLastPage,
    total,
    setTotal,
  };
};

export const useGetAccident = () => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [accident, setAccident] = useState<AccidentResponse | null>(null);

  const fetchAccident = async (id: number) => {
    try {
      setLoading(true);
      setError("");

      const response = await getAccident(id);
      setAccident(response);
      return response;
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to fetch accident";

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchAccident,
    accident,
    loading,
    error,
  };
};

export const useCreateAccident = () => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const createAccidentData = async (accident: CreateAccidentRequest) => {
    try {
      setLoading(true);
      setError("");

      const response = await createAccident(accident);
      return response;
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to create accident report";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createAccidentData,
    loading,
    error,
  };
};

export const useUpdateAccident = () => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateAccidentData = async (id: number, accident: UpdateAccidentRequest) => {
    try {
      setLoading(true);
      setError("");

      const response = await updateAccident(id, accident);
      return response;
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to update accident";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateAccidentData,
    loading,
    error,
  };
};

export const useDeleteAccident = () => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const deleteAccidentData = async (id: number) => {
    try {
      setLoading(true);
      setError("");

      const response = await deleteAccident(id);
      return response;
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to delete accident";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteAccidentData,
    loading,
    error,
  };
};
