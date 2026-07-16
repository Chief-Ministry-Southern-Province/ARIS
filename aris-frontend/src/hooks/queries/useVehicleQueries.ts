import { useQuery } from "@tanstack/react-query";
import { getVehicle, getVehicles } from "@/services/vehicle.service";
import { queryKeys } from "@/hooks/queryKeys";

export const useVehicles = (page = 1, search = "") =>
  useQuery({ queryKey: queryKeys.vehicles.list(page, search), queryFn: () => getVehicles(page, search) });

export const useVehicle = (id?: number) =>
  useQuery({ queryKey: queryKeys.vehicles.detail(id ?? 0), queryFn: () => getVehicle(id as number), enabled: Boolean(id && id > 0) });
