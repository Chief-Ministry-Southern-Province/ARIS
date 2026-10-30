export const formatRole = (role: string) => {
  if (role === "system_admin") {
    return "System Administrator";
  }
  if (role === "ministry_account_subject_officer") {
    return "Ministry Account Subject Officer";
  }

  const formattedRole = role.replaceAll("_", " ");
  return formattedRole.charAt(0).toUpperCase() + formattedRole.slice(1);
};

export const rolesForInstitution = (institutionType?: string, allowSystemAdmin: boolean = false) => {
  switch (institutionType) {
    case "MINISTRY":
      return [
        ...(allowSystemAdmin ? ["system_admin"] : []),
        "subject_officer",
        "ministry_account_subject_officer",
        "chief_accountant",
        "secretary",
        "assistant_secretary",
        "senior_assistant_secretary",
        "chief_secretary",
        "administrative_officer",
        "driver",
      ];
    case "PDHS":
      return ["subject_officer", "administrative_officer", "deputy_director", "chief_accountant", "provincial_director", "driver"];
    case "RDHS":
      return ["subject_officer", "administrative_officer", "accountant", "regional_director", "driver"];
    case "BASE_HOSPITAL":
      return ["subject_officer", "administrative_officer", "accountant", "medical_superintendent", "driver"];
    default:
      return [];
  }
};

export const selectRoleBaseOnUserInstitutionType = (institutionType?: string | null, allowSystemAdmin: boolean = false) =>
  rolesForInstitution(institutionType ?? undefined, allowSystemAdmin);
