import { useQuery } from "@tanstack/react-query";
import { getAllUsers, getAvailableDrivers, getUserById } from "@/services/user.service";
import { queryKeys } from "@/hooks/queryKeys";

export const useUsers = (page = 1, search = "") => useQuery({ queryKey: queryKeys.users.list(page, search), queryFn: () => getAllUsers(page, search) });
export const useUser = (id?: number) => useQuery({ queryKey: queryKeys.users.detail(id ?? 0), queryFn: () => getUserById(id as number), enabled: Boolean(id && id > 0) });
export const useAvailableDrivers = () => useQuery({ queryKey: queryKeys.users.drivers, queryFn: getAvailableDrivers });
