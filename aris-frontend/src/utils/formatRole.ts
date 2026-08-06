export const formatRole = (role: string) => {
  if (role === "ministry_account_subject_officer") {
    return "Ministry Account Subject Officer";
  }

  const formattedRole = role.replaceAll("_", " ");
  return formattedRole.charAt(0).toUpperCase() + formattedRole.slice(1);
};

export const rolesForInstitution = (institutionType?: string) => {
  switch (institutionType) {
    case "MINISTRY":
      return ["subject_officer", "ministry_account_subject_officer", "chief_accountant", "secretary", "assistant_secretary", "senior_assistant_secretary", "chief_secretary", "administrative_officer", "driver"];
    case "PDHS":
      return ["subject_officer", "administrative_officer", "deputy_director", "provincial_director", "driver"];
    case "RDHS":
      return ["subject_officer", "administrative_officer", "regional_director", "driver"];
    case "BASE_HOSPITAL":
      return ["subject_officer", "administrative_officer", "medical_superintendent", "driver"];
    default:
      return [];
  }
};

export const selectRoleBaseOnUserInstitutionType = (institutionType?: string | null) =>
  rolesForInstitution(institutionType ?? undefined);
