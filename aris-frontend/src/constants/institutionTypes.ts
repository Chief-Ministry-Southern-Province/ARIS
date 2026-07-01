
export const INSTITUTION_TYPE_OPTIONS = {
  system_admin: [
    "PDHS",
    "RDHS",
    "BASE_HOSPITAL",
  ],

  subject_officer: {
    PDHS: [],
    RDHS: [
      "DIVISIONAL_HOSPITAL",
      "MOH",
      "PMCU",
      "UNITS",
    ],
  },
} as const;