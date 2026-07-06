import { InputField } from "@/components/atoms/InputField";
import { FormField } from "@/components/molecules/FormField";
import { useTranslation } from "react-i18next";
import type {createUserRequest} from "@/types/User.type"
import { useState,useEffect } from "react";
import {selectRoleBaseOnUserInstitutionType,formatRole} from "@/utils/formatRole"
import {useGetVisibleInstitutionsForUser} from "@/hooks/useInstitution"
import {useCreateUser} from "@/hooks/useUser"
import Loader from "@/components/atoms/Loader";

export default function AddUserForm({onSuccess}:{onSuccess:()=>void}) {
  const { t } = useTranslation();
  const roleList = selectRoleBaseOnUserInstitutionType();

  const [user,setUser] = useState<createUserRequest>({
    name: "",
    nic: "",
    role: "",
    institution_id: 0,
    password: "",
    mobile: "",
  });

  const [seePassword, setSeePassword] = useState(false);

  const { fetchVisibleInstitutions,institutions,loading} = useGetVisibleInstitutionsForUser();

  useEffect(() => {
    fetchVisibleInstitutions();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value })); 
  };

  const { createUserData,loading:createUserLoading,error:createUserError } = useCreateUser();

  const handleCreateUser = ()=>{
    if(createUserLoading) return <Loader text="Creating user..." />;
    createUserData(user);
    onSuccess();
  }
  
  console.log(createUserError);

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
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button className="px-5 py-2 border border-gray-300 rounded-lg">
          Cancel
        </button>

        <button className="px-5 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800"
          onClick={handleCreateUser}
        >
          Create User
        </button>
      </div>
    </div>
  );
}