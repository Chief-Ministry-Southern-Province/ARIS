import api from "./api";
import type { PaginatedResponse } from "@/types/Pagination.type";

import type {
  AccidentResponse,
  CreateAccidentRequest,
  UpdateAccidentRequest,
} from "@/types/accident.type";

export const getAccidents = async (
  page: number = 1,
  search: string = "",
  status: string = "",
  severity: string = ""
): Promise<PaginatedResponse<AccidentResponse>> => {

  const response = await api.get("/accidents", {
    params: {
      page,
      search,
      status: status || undefined,
      severity: severity || undefined,
    },
  });

  return response.data;
};

export const getAccident = async (id: number) => {

  const response = await api.get<AccidentResponse>(
    `/accidents/${id}`
  );

  return response.data;
};

export const createAccident = async (
  data: CreateAccidentRequest
) => {

  const response = await api.post(
    "/accidents",
    data
  );

  return response.data;
};

export const updateAccident = async (
  id: number,
  data: UpdateAccidentRequest
) => {

  const response = await api.put<{ accident: AccidentResponse }>(
    `/accidents/${id}`,
    data
  );

  return response.data.accident;
};

export const deleteAccident = async (
  id: number
) => {

  const response = await api.delete(
    `/accidents/${id}`
  );

  return response.data;
};
