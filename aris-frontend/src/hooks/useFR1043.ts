import { useState } from "react";
import type { FR1043FormData,FR1043Response,FR1043Status } from "@/types/form_104_3_types";
import {createFR1043,getFR1043,submitFR1043,updateFR1043} from "@/services/fr1043.service";

const getErrorMessage = (err: unknown, fallback: string) =>
  (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
  fallback;

export const useGetFR1043 = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fr1043, setFR1043] = useState<FR1043Response | null>(null);

  const fetchFR1043 = async (caseId: number) => {
    try {
      setLoading(true);
      setError("");

      const response = await getFR1043(caseId);
      setFR1043(response);
      return response;
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to fetch FR104(3) form"));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { fetchFR1043, fr1043, loading, error };
};

export const useSaveFR1043 = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const saveFR1043 = async (
    caseId: number,
    formId: number | null,
    status: FR1043Status | null,
    data: FR1043FormData
  ) => {
    try {
      setLoading(true);
      setError("");

      if (formId) {
        return await updateFR1043(
          formId,
          status === "CHANGES_REQUESTED" ? "CHANGES_REQUESTED" : "DRAFT",
          data
        );
      }

      return await createFR1043(caseId, data);
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to save FR104(3) form"));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { saveFR1043, loading, error };
};

export const useSubmitFR1043 = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submitFR1043Data = async (id: number) => {
    try {
      setLoading(true);
      setError("");

      return await submitFR1043(id);
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to submit FR104(3) form"));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { submitFR1043Data, loading, error };
};
