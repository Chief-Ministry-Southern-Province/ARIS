import { useQuery } from "@tanstack/react-query";
import { getAccidentCase, getAccidentCases } from "@/services/accidentCase.service";
import { queryKeys } from "@/hooks/queryKeys";

export const useCases = (page = 1, search = "") =>
  useQuery({ queryKey: queryKeys.cases.list(page, search), queryFn: () => getAccidentCases(page, search) });

export const useCase = (id?: number) =>
  useQuery({ queryKey: queryKeys.cases.detail(id ?? 0), queryFn: () => getAccidentCase(id as number), enabled: Boolean(id && id > 0) });
