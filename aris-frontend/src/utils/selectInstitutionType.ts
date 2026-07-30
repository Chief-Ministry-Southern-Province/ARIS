import { INSTITUTION_TYPE_OPTIONS } from "@/constants/institutionTypes";

export const selectInstitutionType = (role: string, institutionType?: string | null): string[] => {

  switch (role) {
    case "system_admin":
      return [...INSTITUTION_TYPE_OPTIONS.system_admin];

    case "subject_officer":
      if (!institutionType) return [];

      return [
        ...(
          INSTITUTION_TYPE_OPTIONS.subject_officer[
            institutionType as keyof typeof INSTITUTION_TYPE_OPTIONS.subject_officer
          ] ?? []
        ),
      ];

    default:
      return [];
  }
};
