import { InputField } from "@/components/atoms/InputField";
import { FormField } from "@/components/molecules/FormField";
import { useTranslation } from "react-i18next";
import type { createUserRequest, User } from "@/types/User.type";
import { useState, useEffect } from "react";
import { rolesForInstitution, formatRole } from "@/utils/formatRole";
import { useVisibleInstitutions } from "@/hooks/queries/useInstitutionQueries";
import { useCreateUserMutation } from "@/hooks/mutations/useResourceMutations";
import { useAuth } from "@/context/auth/AuthContext";
import { ShieldAlert, ShieldCheck } from "lucide-react";

interface AddUserFormProps {
  onSuccess: (user: User) => void;
  onCancel?: () => void;
  initialRole?: string;
}

export default function AddUserForm({ onSuccess, onCancel, initialRole }: AddUserFormProps) {
  const { t } = useTranslation();
  const { role: currentUserRoles } = useAuth();
  const isCurrentSystemAdmin = currentUserRoles?.includes("system_admin");

  const [user, setUser] = useState<createUserRequest>({
    name: "",
    nic: "",
    role: initialRole || "",
    institution_id: 0,
    mobile: "",
    districts: [],
  });

  const { data: institutions = [], isLoading: loading } = useVisibleInstitutions();

  // If initialRole is system_admin, auto-select the first MINISTRY institution once loaded
  useEffect(() => {
    if (initialRole === "system_admin" && user.institution_id === 0 && institutions.length > 0) {
      const ministryInst = institutions.find((inst) => inst.type === "MINISTRY");
      if (ministryInst) {
        setUser((prev) => ({
          ...prev,
          institution_id: ministryInst.id,
          role: "system_admin",
        }));
      }
    }
  }, [initialRole, institutions, user.institution_id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => {
      const updatedValue = name === "institution_id" ? Number(value) : value;
      const updatedUser = { ...prevUser, [name]: updatedValue };

      // Clear districts if the conditions are no longer met
      const selectedInst = institutions.find((inst) => inst.id === Number(updatedUser.institution_id));
      const isMinistry = selectedInst?.type === "MINISTRY";
      const isSubjectOfficer = updatedUser.role === "subject_officer";
      if (!isMinistry || !isSubjectOfficer) {
        updatedUser.districts = [];
      }
      return updatedUser;
    });
  };

  const {
    mutateAsync: createUserData,
    isPending: createUserLoading,
    error: createUserMutationError,
  } = useCreateUserMutation();

  const createUserError =
    createUserMutationError instanceof Error ? createUserMutationError.message : "";

  const handleCreateUser = async () => {
    if (createUserLoading) return;
    try {
      const createdUser = await createUserData(user);
      onSuccess(createdUser);
    } catch {
      // Handled by mutation hook & toast
    }
  };

  const selectedInstitution = institutions.find((inst) => inst.id === Number(user.institution_id));
  const roleList = rolesForInstitution(selectedInstitution?.type, isCurrentSystemAdmin);
  const isMinistry = selectedInstitution?.type === "MINISTRY";
  const isSubjectOfficer = user.role === "subject_officer";
  const isTargetSystemAdmin = user.role === "system_admin";
  const showDistrictSelection = isMinistry && isSubjectOfficer;

  // If user selected system_admin, they can only assign to MINISTRY institutions
  const displayedInstitutions = isTargetSystemAdmin
    ? institutions.filter((inst) => inst.type === "MINISTRY")
    : institutions;

  const isFormValid =
    user.name.trim() !== "" &&
    user.nic.trim() !== "" &&
    user.mobile.trim() !== "" &&
    user.role !== "" &&
    user.institution_id > 0;

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {isTargetSystemAdmin ? (
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-700">
              <ShieldCheck className="w-5 h-5" />
            </div>
          ) : null}
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {isTargetSystemAdmin
                ? t("adminPanel.users.addSystemAdmin", "Add System Administrator")
                : t("adminPanel.users.addUser", "Add User")}
            </h2>
            <p className="text-xs text-gray-500">
              {isTargetSystemAdmin
                ? t(
                    "adminPanel.users.systemAdminNotice",
                    "System administrators have full privileges across ARIS and must belong to a Ministry-level institution."
                  )
                : t("adminPanel.users.addUserSubtitle", "Create a new user account and dispatch password setup via SMS.")}
            </p>
          </div>
        </div>
      </div>

      {isTargetSystemAdmin && (
        <div className="mb-5 flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50/80 p-3 text-xs text-amber-900">
          <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
          <span>
            {t(
              "adminPanel.users.systemAdminNotice",
              "System administrators have full privileges across ARIS and must belong to a Ministry-level institution."
            )}
          </span>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <FormField label={t("adminPanel.users.user")} required>
          <InputField
            placeholder="John Doe"
            value={user.name}
            onChange={handleInputChange}
            name="name"
          />
        </FormField>

        <FormField label="NIC" required>
          <InputField
            placeholder="199912345678"
            value={user.nic}
            onChange={handleInputChange}
            name="nic"
          />
        </FormField>

        <FormField label={t("adminPanel.users.institution")} required>
          <select
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            value={user.institution_id}
            onChange={handleInputChange}
            name="institution_id"
          >
            <option value={0}>{t("common.selectInstitution", "Select Institution")}</option>
            {loading ? (
              <option disabled>Loading...</option>
            ) : (
              displayedInstitutions.map((institution) => (
                <option key={institution.id} value={institution.id}>
                  {institution.name} ({institution.type})
                </option>
              ))
            )}
          </select>
        </FormField>

        <FormField label={t("adminPanel.users.role")} required>
          <select
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            value={user.role}
            onChange={handleInputChange}
            name="role"
          >
            <option value="">{t("common.selectRole", "Select Role")}</option>
            {/* If initialRole was system_admin and roleList is not populated yet because institution not selected, show system_admin option */}
            {isCurrentSystemAdmin && !roleList.includes("system_admin") && (
              <option value="system_admin">{formatRole("system_admin")}</option>
            )}
            {roleList.map((role) => (
              <option key={role} value={role}>
                {formatRole(role)}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label={t("adminPanel.users.contactNumber")} required>
          <InputField
            placeholder="0712345678"
            value={user.mobile}
            onChange={handleInputChange}
            name="mobile"
          />
        </FormField>

        {showDistrictSelection && (
          <div className="md:col-span-2">
            <FormField label={t("adminPanel.users.assignedDistricts")} required>
              <div className="flex gap-6 mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                {["Galle", "Matara", "Hambantota"].map((district) => (
                  <label
                    key={district}
                    className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      value={district}
                      checked={user.districts?.includes(district) || false}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setUser((prev) => {
                          const currentDistricts = prev.districts || [];
                          const newDistricts = checked
                            ? [...currentDistricts, district]
                            : currentDistricts.filter((d) => d !== district);
                          return { ...prev, districts: newDistricts };
                        });
                      }}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    {district}
                  </label>
                ))}
              </div>
            </FormField>
          </div>
        )}
      </div>

      {createUserError && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
          {createUserError}
        </div>
      )}

      <p className="mt-4 text-xs text-gray-500">
        The user will receive a one-time password setup link by SMS. No initial password is set by the administrator.
      </p>

      <div className="flex justify-end gap-3 mt-6">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition"
          >
            {t("common.cancel", "Cancel")}
          </button>
        )}

        <button
          type="button"
          disabled={!isFormValid || createUserLoading}
          onClick={handleCreateUser}
          className={`px-5 py-2 text-white rounded-lg text-sm font-medium transition ${
            !isFormValid || createUserLoading
              ? "bg-gray-400 cursor-not-allowed"
              : isTargetSystemAdmin
              ? "bg-indigo-700 hover:bg-indigo-800"
              : "bg-blue-700 hover:bg-blue-800"
          }`}
        >
          {createUserLoading
            ? t("common.creating", "Creating...")
            : isTargetSystemAdmin
            ? t("adminPanel.users.createSystemAdmin", "Create System Administrator")
            : t("adminPanel.users.createUser", "Create User")}
        </button>
      </div>
    </div>
  );
}
