import { useTranslation } from "react-i18next";

import { InputField } from "@/components/atoms/InputField";
import { FormField } from "@/components/molecules/FormField";
import { useUser } from "@/hooks/queries/useUserQueries";
import {formatRole,selectRoleBaseOnUserInstitutionType,} from "@/utils/formatRole";
import Loader from "@/components/atoms/Loader";

interface ViewUserFormProps {
  onClose: () => void;
  userId: string;
}

export default function ViewUserForm({onClose,userId}: ViewUserFormProps) {
  const { t } = useTranslation();

  const roleList = selectRoleBaseOnUserInstitutionType();

  const { data: user, isLoading: loading, error: queryError } = useUser(Number(userId));
  const error = queryError instanceof Error ? queryError.message : "";

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <p className="text-center text-gray-500">Loading user...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <p className="text-center text-red-500">{error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <p className="text-center text-gray-500">User not found.</p>
      </div>
    );
  }

  return (
    <>
      {loading ? (
        <Loader text="Loading user..." />
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

          {/* Header */}
          <div className="bg-blue-50 border-b border-blue-100 px-6 py-4">
            <h2 className="text-xl font-semibold text-blue-900">
              {t("adminPanel.users.viewUser")}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              View user information.
            </p>
          </div>

          {/* Body */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Name */}
              <FormField
                label={t("adminPanel.users.user")}
                required
              >
                <InputField
                  value={user.name}
                  readOnly
                  className="bg-gray-50 border-gray-200 cursor-default"
                />
              </FormField>

              {/* NIC */}
              <FormField
                label="NIC"
                required
              >
                <InputField
                  value={user.nic}
                  readOnly
                  className="bg-gray-50 border-gray-200 cursor-default"
                />
              </FormField>

              {/* Role */}
              <FormField
                label={t("adminPanel.users.role")}
                required
              >
                <select
                  value={user.roles[0]?.name ?? ""}
                  disabled
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700 cursor-not-allowed"
                >
                  {roleList.map((role) => (
                    <option
                      key={role}
                      value={role}
                    >
                      {formatRole(role)}
                    </option>
                  ))}
                </select>
              </FormField>

              {/* Institution */}
              <FormField
                label={t("adminPanel.users.institution")}
                required
              >
                <InputField
                  value={user.institution?.name ?? ""}
                  readOnly
                  className="bg-gray-50 border-gray-200 cursor-default"
                />
              </FormField>

              {/* Mobile */}
              <FormField label={t("adminPanel.users.contactNumber")}>
                <InputField
                  value={user.mobile}
                  readOnly
                  className="bg-gray-50 border-gray-200 cursor-default"
                />
              </FormField>

              {/* Assigned Districts */}
              {user.roles[0]?.name === "subject_officer" && user.institution?.type === "MINISTRY" && (
                <FormField label={t("adminPanel.users.assignedDistricts")}>
                  <InputField
                    value={user.districts?.map((d) => d.district).join(", ") || "None"}
                    readOnly
                    className="bg-gray-50 border-gray-200 cursor-default"
                  />
                </FormField>
              )}

            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">

            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-colors"
            >
              {t("common.close")}
            </button>

          </div>
        </div>
      )}
    </>
  );
}
