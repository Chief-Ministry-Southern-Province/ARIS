import ProtectedRoute from "@/routes/ProtectedRoute";

export const protectedPage = (
  path: string,
  element: React.ReactNode,
  roles?: string[],
  options?: {
    allowedInstitutionTypes?: string[];
    institutionTypeBypassRoles?: string[];
  },
) => ({
  element: <ProtectedRoute allowedRoles={roles} {...options} />,
  children: [
    {
      path,
      element,
    },
  ],
});
