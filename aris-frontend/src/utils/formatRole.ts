export const formatRole = (role: string) => {
  const formattedRole = role.replaceAll("_", " ");
  return formattedRole.charAt(0).toUpperCase() + formattedRole.slice(1);
};

export const rolesForInstitution = (institutionType?: string) => {
  switch (institutionType) {
    case "MINISTRY":
      return ["subject_officer", "secretary", "assistant_secretary", "senior_assistant_secretary", "treasury_secretary", "administrative_officer", "driver"];
    case "PDHS":
      return ["administrative_officer", "deputy_director", "provincial_director", "driver"];
    case "RDHS":
      return ["administrative_officer", "regional_director", "driver"];
    case "BASE_HOSPITAL":
      return ["administrative_officer", "medical_superintendent", "driver"];
    default:
      return [];
  }
};

export const selectRoleBaseOnUserInstitutionType = () =>
  rolesForInstitution(localStorage.getItem("institutionType") ?? undefined);
