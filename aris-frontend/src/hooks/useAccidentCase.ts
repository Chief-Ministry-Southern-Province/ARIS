import {getAccidentCases,getAccidentCase} from "../services/accidentCase.service";
import { useState } from "react";
import type { AccidentCase } from "../types/AccidentCase.type";

export const useAccidentCases = () => {
  const [accidentCases, setAccidentCases] = useState<AccidentCase[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchAccidentCases = async ({page,search}: {page: number; search?: string}) => {
    try {
      setLoading(true);
      setError("");

      const response = await getAccidentCases(page, search);
      setAccidentCases(response.data);
      setCurrentPage(response.current_page ?? 1);
      setLastPage(response.last_page ?? 1);
      setTotal(response.total ?? response.data.length ?? 0);
      return response;
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to fetch accident cases";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { accidentCases, currentPage, lastPage, total, loading, error, fetchAccidentCases };
};

export const useAccidentCase = () => {
  const [accidentCase, setAccidentCase] = useState<AccidentCase | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchAccidentCase = async (id: number) => {
    try {
      setLoading(true);
      setError("");

      const response = await getAccidentCase(id);
      setAccidentCase(response);
      return response;
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to fetch accident case";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { accidentCase, loading, error, fetchAccidentCase };
};