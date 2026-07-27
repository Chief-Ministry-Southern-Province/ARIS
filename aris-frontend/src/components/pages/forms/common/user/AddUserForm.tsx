import { InputField } from "@/components/atoms/InputField";
import { FormField } from "@/components/molecules/FormField";
import { useTranslation } from "react-i18next";
import type {createUserRequest} from "@/types/User.type"
import { useState } from "react";
import { rolesForInstitution, formatRole } from "@/utils/formatRole"
import { useVisibleInstitutions } from "@/hooks/queries/useInstitutionQueries"
import { useCreateUserMutation } from "@/hooks/mutations/useResourceMutations"

export default function AddUserForm({onSuccess}:{onSuccess:()=>void}) {
  const { t } = useTranslation();
  const [user,setUser] = useState<createUserRequest>({
    name: "",
    nic: "",
    role: "",
    institution_id: 0,
    password: "",
    mobile: "",
    districts: [],
  });

  const [seePassword, setSeePassword] = useState(false);

  const { data: institutions = [], isLoading: loading } = useVisibleInstitutions();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => {
      const updatedValue = name === "institution_id" ? Number(value) : value;
      const updatedUser = { ...prevUser, [name]: updatedValue };

      // Clear districts if the conditions are no longer met
      const selectedInst = institutions.find(inst => inst.id === Number(updatedUser.institution_id));
      const isMinistry = selectedInst?.type === "MINISTRY";
      const isSubjectOfficer = updatedUser.role === "subject_officer";
      if (!isMinistry || !isSubjectOfficer) {
        updatedUser.districts = [];
      }
      return updatedUser;
    }); 
  };

  const { mutateAsync: createUserData, isPending: createUserLoading, error: createUserMutationError } = useCreateUserMutation();
  const createUserError = createUserMutationError instanceof Error ? createUserMutationError.message : "";

  const handleCreateUser = async () => {
    if (createUserLoading) return;
    try {
      await createUserData(user);
      onSuccess();
    } catch (e) {
      // Handled by hook
    }
  };
  
  console.log(createUserError);

  const selectedInstitution = institutions.find(inst => inst.id === Number(user.institution_id));
  const roleList = rolesForInstitution(selectedInstitution?.type);
  const isMinistry = selectedInstitution?.type === "MINISTRY";
  const isSubjectOfficer = user.role === "subject_officer";
  const showDistrictSelection = isMinistry && isSubjectOfficer;

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200">
      <h2 className="text-lg font-semibold mb-6">
        {t("adminPanel.users.addUser")}
      </h2>

      <div className="grid md:grid-cols-2 gap-4">
        <FormField
          label={t("adminPanel.users.user")}
          required
        >
          <InputField placeholder="John Doe" onChange={handleInputChange} name="name" />
        </FormField>

        <FormField
          label="NIC"
          required
        >
          <InputField placeholder="199912345678" onChange={handleInputChange} name="nic" />
        </FormField>

        <FormField
          label={t("adminPanel.users.role")}
          required
        >
          <select className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" onChange={handleInputChange} name="role">
            <option value="">Select Role</option>
            {roleList.map((role) => (
              <option key={role} value={role}>{formatRole(role)}</option>
            ))}
          </select>
        </FormField>

        <FormField
          label={t("adminPanel.users.institution")}
          required
        >
          <select className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" onChange={handleInputChange} name="institution_id">
            <option value={0}>Select Institution</option>
            {loading ? <option>Loading...</option> : institutions.map((institution) => (
              <option key={institution.id} value={institution.id}>
                {institution.name}
              </option>
            ))}
          </select>
        </FormField>

        <FormField
          label="Contact Number"
        >
          <InputField placeholder="0712345678" onChange={handleInputChange} name="mobile" />
        </FormField>

        <FormField label="Password" required>
          <div className="relative">
            <InputField
              type={seePassword ? "text" : "password"}
              placeholder="********"
              onChange={handleInputChange}
              name="password"
            />
            <button
              type="button"
              className="absolute right-3 top-2.5 text-gray-500"
              onClick={() => setSeePassword(!seePassword)}
            >
              {seePassword ? "Hide" : "Show"}
            </button>
          </div>
        </FormField>

        {showDistrictSelection && (
          <div className="md:col-span-2">
            <FormField label={t("adminPanel.users.assignedDistricts")} required>
              <div className="flex gap-6 mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                {["Galle", "Matara", "Hambantota"].map((district) => (
                  <label key={district} className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
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

      <div className="flex justify-end gap-3 mt-6">
        <button className="px-5 py-2 border border-gray-300 rounded-lg">
          Cancel
        </button>

        <button className="px-5 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800"
          onClick={handleCreateUser}
        >
          {createUserLoading ? "Creating..." : "Create User"}
        </button>
      </div>
    </div>
  );
}
