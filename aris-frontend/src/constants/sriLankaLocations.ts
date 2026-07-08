export const SRI_LANKA_PROVINCES = [
  "Central",
  "Eastern",
  "North Central",
  "Northern",
  "North Western",
  "Sabaragamuwa",
  "Southern",
  "Uva",
  "Western",
] as const;

export type Province = (typeof SRI_LANKA_PROVINCES)[number];

export const DISTRICTS_BY_PROVINCE: Record<Province, string[]> = {
  Central: [
    "Kandy",
    "Matale",
    "Nuwara Eliya",
  ],

  Eastern: [
    "Ampara",
    "Batticaloa",
    "Trincomalee",
  ],

  "North Central": [
    "Anuradhapura",
    "Polonnaruwa",
  ],

  Northern: [
    "Jaffna",
    "Kilinochchi",
    "Mannar",
    "Mullaitivu",
    "Vavuniya",
  ],

  "North Western": [
    "Kurunegala",
    "Puttalam",
  ],

  Sabaragamuwa: [
    "Kegalle",
    "Ratnapura",
  ],

  Southern: [
    "Galle",
    "Hambantota",
    "Matara",
  ],

  Uva: [
    "Badulla",
    "Monaragala",
  ],

  Western: [
    "Colombo",
    "Gampaha",
    "Kalutara",
  ],
};

export const getDistrictsByProvince = (
  province?: string
): string[] => {
  if (!province) return [];
  return DISTRICTS_BY_PROVINCE[province as Province] ?? [];
};