/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { InputField } from "@/components/atoms/InputField";
import { FormField } from "@/components/molecules/FormField";
import Loader from "@/components/atoms/Loader";

import type { updateUserRequest } from "@/types/User.type";

import {formatRole,selectRoleBaseOnUserInstitutionType,} from "@/utils/formatRole";

import { useGetVisibleInstitutionsForUser } from "@/hooks/useInstitution";
import { useGetUserById,useUpdateUser,} from "@/hooks/useUser";

interface EditUserFormProps {
  userId: string;
  onSuccess: () => void;
  onClose: () => void;
}

export default function EditUserForm({userId,onSuccess,onClose,}: EditUserFormProps) {
  const { t } = useTranslation();

  const roleList = selectRoleBaseOnUserInstitutionType();

  const [user, setUser] = useState<updateUserRequest>({
    name: "",
    nic: "",
    role: "",
    institution_id: 0,
    mobile: "",
  });

  const {fetchVisibleInstitutions,institutions,loading: institutionLoading,} = useGetVisibleInstitutionsForUser();

  const {fetchUserById,user: userData,loading: userLoading,} = useGetUserById();

  const {updateUserData,loading: updateLoading, } = useUpdateUser();

  useEffect(() => {
    fetchVisibleInstitutions();
    fetchUserById(Number(userId));
  }, [userId]);

  useEffect(() => {
    if (!userData) return;

    setUser({
      name: userData.name,
      nic: userData.nic,
      mobile: userData.mobile,
      role: userData.roles[0]?.name ?? "",
      institution_id: userData.institution_id,
    });
  }, [userData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setUser((prev) => ({
      ...prev,
      [name]:
        name === "institution_id"
          ? Number(value)
          : value,
    }));
  };

  const handleUpdateUser = async () => {
    await updateUserData(Number(userId), user);
    onSuccess();
  };

  if (userLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loader />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">

      <h2 className="text-xl font-semibold mb-6">
        {t("adminPanel.users.editUser")}
      </h2>

      <div className="grid md:grid-cols-2 gap-5">

        <FormField
          label={t("adminPanel.users.user")}
          required
        >
          <InputField
            name="name"
            value={user.name}
            onChange={handleInputChange}
            placeholder="John Doe"
          />
        </FormField>

        <FormField
          label="NIC"
          required
        >
          <InputField
            name="nic"
            value={user.nic}
            onChange={handleInputChange}
            placeholder="200012345678"
          />
        </FormField>

        <FormField
          label={t("adminPanel.users.role")}
          required
        >
          <select
            name="role"
            value={user.role}
            onChange={handleInputChange}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="">
              {t("common.select")}
            </option>

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

        <FormField
          label={t("adminPanel.users.institution")}
          required
        >
          <select
            name="institution_id"
            value={user.institution_id}
            onChange={handleInputChange}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value={0}>
              {t("common.select")}
            </option>

            {institutionLoading ? (
              <option>Loading...</option>
            ) : (
              institutions.map((institution) => (
                <option
                  key={institution.id}
                  value={institution.id}
                >
                  {institution.name}
                </option>
              ))
            )}
          </select>
        </FormField>

        <FormField
          label={t("adminPanel.users.contactNumber")}
        >
          <InputField
            name="mobile"
            value={user.mobile}
            onChange={handleInputChange}
            placeholder="0712345678"
          />
        </FormField>

      </div>

      <div className="flex justify-end gap-3 mt-8">

        <button
          type="button"
          onClick={onClose}
          className="px-5 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
        >
          {t("common.cancel")}
        </button>

        <button
          type="button"
          onClick={handleUpdateUser}
          disabled={updateLoading}
          className="px-5 py-2 rounded-lg bg-blue-700 text-white hover:bg-blue-800 disabled:opacity-50"
        >
          {updateLoading
            ? t("common.updating")
            : t("adminPanel.users.updateUser")}
        </button>

      </div>

    </div>
  );
}