import { useQuery } from "@tanstack/react-query";
import { getAccidentCase, getAccidentCases } from "@/services/accidentCase.service";
import { queryKeys } from "@/hooks/queryKeys";
import type { CaseStage, CaseStatus } from "@/types/AccidentCase.type";

export const useCases = (
  page = 1,
  caseNumber = "",
  status: CaseStatus | "" = "",
  stage: CaseStage | "" = "",
) =>
  useQuery({
    queryKey: queryKeys.cases.list(page, caseNumber, status, stage),
    queryFn: () => getAccidentCases(page, caseNumber, status, stage),
  });

export const useCase = (id?: number) =>
  useQuery({ queryKey: queryKeys.cases.detail(id ?? 0), queryFn: () => getAccidentCase(id as number), enabled: Boolean(id && id > 0) });
