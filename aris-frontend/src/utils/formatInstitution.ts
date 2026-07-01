export const formatInstitutionType = (type: string): string => {
  switch (type) {
    case "MINISTRY":
      return "Ministry";
    case "PDHS":
      return "PDHS";
    case "RDHS":
      return "RDHS";
    case "BASE_HOSPITAL":
      return "Base Hospital";
    case "DIVISIONAL_HOSPITAL":
      return "Divisional Hospital";
    case "MOH":
      return "MOH";
    case "PMCU":
      return "PMCU";
    case "UNITS":
      return "Units";
    default:
      return type;
  }
}
