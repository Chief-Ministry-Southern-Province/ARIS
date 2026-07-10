import {getEvidence,downloadEvidence} from "../services/evidence.service";
import { useState } from "react";
import type { EvidenceResponse } from "../types/evidence.type";

export const useGetEvidence = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [evidence, setEvidence] = useState<EvidenceResponse[]>([]);

  const fetchEvidence = async (accidentId: number) => {
    try {
      setLoading(true);
      setError("");

      const response = await getEvidence(accidentId);
      setEvidence(response);
      return response;
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to fetch evidence";

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchEvidence,
    evidence,
    loading,
    error,
  };
};

export const useDownload = () => {
  const [loading, setLoading] = useState(false);

  const downloadFile = async (accidentId: number,evidenceId: number,accidentReferenceNumber: string) => {
    try {
      setLoading(true);
      const response = await downloadEvidence(accidentId, evidenceId);

      const disposition = (response as { headers?: Record<string, string> }).headers?.[
        "content-disposition"
      ];

      let filename = accidentReferenceNumber + "_evidence_" ;

      if (disposition) {
        const match = disposition.match(/filename="?(.+?)"?$/);
        if (match) {
          filename = match[1];
        }
      }

      let blob: Blob;
      if (response instanceof Blob) {
        blob = response;
      } else if ((response as { data?: any }).data instanceof Blob) {
        blob = (response as { data: Blob }).data;
      } else if ((response as { data?: any }).data instanceof ArrayBuffer) {
        blob = new Blob([(response as { data: ArrayBuffer }).data]);
      } else {
 
        blob = new Blob([ (response as { data?: any }).data ?? response ]);
      }

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = filename;

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);

      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return { downloadFile, loading };
};