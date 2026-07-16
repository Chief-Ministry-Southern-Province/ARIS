import { useQuery } from "@tanstack/react-query";
import { getAccident, getAccidents } from "@/services/accident.service";
import { queryKeys } from "@/hooks/queryKeys";

export const useAccidents = (page = 1, search = "", status = "", severity = "") =>
  useQuery({ queryKey: queryKeys.accidents.list(page, search, status, severity), queryFn: () => getAccidents(page, search, status, severity) });

export const useAccident = (id?: number) =>
  useQuery({ queryKey: queryKeys.accidents.detail(id ?? 0), queryFn: () => getAccident(id as number), enabled: Boolean(id && id > 0) });
