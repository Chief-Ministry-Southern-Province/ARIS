import api from "./api";
import type { PaginatedResponse } from "@/types/Pagination.type";

import type { AccidentCase, CaseStage, CaseStatus } from "@/types/AccidentCase.type";

export const getAccidentCases = async (
  page: number = 1,
  caseNumber: string = "",
  status: CaseStatus | "" = "",
  stage: CaseStage | "" = "",
): Promise<PaginatedResponse<AccidentCase>> => {

  const response = await api.get("/cases", {
    params: {
      page,
      case_number: caseNumber || undefined,
      status: status || undefined,
      stage: stage || undefined,
    },
  });

  return response.data;
};

export const getAccidentCase = async (id: number) => {

  const response = await api.get<{ data: AccidentCase }>(
    `/cases/${id}`
  );

  return response.data.data;
}
