import api from "./api";
import type { PaginatedResponse } from "@/types/Pagination.type";

import type {AccidentCase} from "@/types/AccidentCase.type";

export const getAccidentCases = async (
  page: number = 1,
  search: string = "",
): Promise<PaginatedResponse<AccidentCase>> => {

  const response = await api.get("/cases", {
    params: {
      page,
      search,
    },
  });

  return response.data;
};

export const getAccidentCase = async (id: number) => {

  const response = await api.get<AccidentCase>(
    `/cases/${id}`
  );

  return response.data;
}