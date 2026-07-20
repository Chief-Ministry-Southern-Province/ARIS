import { useQuery } from "@tanstack/react-query";
import { getAllowedInstitutionTypes, getInstitutionById, getInstitutions, getParentInstitutions, getVisibleInstitutionsForUser } from "@/services/institution.service";
import { queryKeys } from "@/hooks/queryKeys";

export const useInstitutions = (page = 1, search = "") => useQuery({ queryKey: queryKeys.institutions.list(page, search), queryFn: () => getInstitutions({ page, search }) });
export const useInstitution = (id?: number) => useQuery({ queryKey: queryKeys.institutions.detail(id ?? 0), queryFn: () => getInstitutionById(id as number), enabled: Boolean(id && id > 0) });
export const useInstitutionTypes = () => useQuery({ queryKey: queryKeys.institutions.types, queryFn: getAllowedInstitutionTypes });
export const useParentInstitutions = () => useQuery({ queryKey: queryKeys.institutions.parents, queryFn: getParentInstitutions });
export const useVisibleInstitutions = () => useQuery({ queryKey: queryKeys.institutions.visible, queryFn: getVisibleInstitutionsForUser });
