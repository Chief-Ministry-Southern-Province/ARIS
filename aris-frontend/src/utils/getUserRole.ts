export const getUserRole = (role: string): string => {
  switch (role) {
    case "system_admin":
      return "System Admin";
    case "driver":
      return "Driver";
    case "subject_officer":
      return "Subject Officer";
    case "administrative_officer":
      return "Administrative Officer";
    case "medical_superintendent":
      return "Medical Superintendent";
    case "regional_director":
      return "Regional Director";
    case "provincial_director":
      return "Provincial Director";
    case "deputy_director":
      return "Deputy Director";
    case "secretary":
      return "Secretary";
    case "assistant_secretary":
      return "Assistant Secretary";
    case "senior_assistant_secretary":
      return "Senior Assistant Secretary";
    case "chief_secretary":
      return "Chief Secretary";
    case "chief_accountant":
      return "Chief Accountant";
    case "accountant":
      return "Accountant";
    case "ministry_account_subject_officer":
      return "Ministry Account Subject Officer";
    default:
      return role;
  }
};
