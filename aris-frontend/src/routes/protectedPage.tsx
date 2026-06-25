import ProtectedRoute from "@/routes/ProtectedRoute";

export const protectedPage = (
  path: string,
  element: React.ReactNode,
  roles?: string[]
) => ({
  element: <ProtectedRoute allowedRoles={roles} />,
  children: [
    {
      path,
      element,
    },
  ],
});