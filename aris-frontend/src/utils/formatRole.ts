export const formatRole = (role: string) => {
  const formattedRole = role.replace('_', ' ');
  return formattedRole.charAt(0).toUpperCase() + formattedRole.slice(1);
};

export const selectRoleBaseOnUserInstitutionType = ()=>{

  const userInstitutionType = localStorage.getItem('institutionType');

  switch (userInstitutionType) {
    case "MINISTRY":
      return ["subject_officer", "secretary", "assistant_secretary", "senior_assistant_secretary","administrative_officer","driver"];
      break;

    case "PDHS":
      return ["administrative_officer","deputy_director", "provincial_director","driver"];
      break;

    case "RDHS":
      return ["administrative_officer", "regional_director","driver"];
      break;

    case "BASE_HOSPITAL":
      return ["administrative_officer","medical_superintendent","driver"];
      break;
  
    default:
      return [];
  }

}