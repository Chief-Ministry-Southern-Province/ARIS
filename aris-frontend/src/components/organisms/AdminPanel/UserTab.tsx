import { Search, Plus, Edit2, Trash2, Eye, Send, ShieldCheck, UserCheck } from "lucide-react";
import { useState } from "react";
import AddUserForm from "@/components/pages/forms/common/user/AddUserForm";
import Modal from "@/components/molecules/Modal";
import { useTranslation } from "react-i18next";
import { useUsers } from "@/hooks/queries/useUserQueries";
import Loader from "@/components/atoms/Loader";
import { formatRole } from "@/utils/formatRole";
import { toast } from "react-toastify";
import ViewUserForm from "@/components/pages/forms/common/user/ViewUserForm";
import type { User } from "@/types/User.type";
import EditUserForm from "@/components/pages/forms/common/user/EditUserForm";
import Pagination from "@/components/molecules/Pagination";
import { useDeleteUserMutation } from "@/hooks/mutations/useResourceMutations";
import {swalConfirm} from "@/utils/swal";
import { resendPasswordSetup } from "@/services/user.service";
import UserHandoverModal from "./UserHandoverModal";
import DelegationModal from "./DelegationModal";
import { useQueryClient } from "@tanstack/react-query";

const UserTab = () => {
  const [showAddUser, setShowAddUser] = useState(false);
  const [showViewUser, setShowViewUser] = useState(false);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [showEditUser, setShowEditUser] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [resendingUserId, setResendingUserId] = useState<number | null>(null);
  const [handoverUser, setHandoverUser] = useState<User | null>(null);
  const [delegatingUser, setDelegatingUser] = useState<User | null>(null);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const {t} = useTranslation();
  const queryClient = useQueryClient();

  const { data, isLoading: loading } = useUsers(page, search);
  const users = data?.data ?? [];
  const currentPage = data?.current_page ?? page;
  const lastPage = data?.last_page ?? 1;
  const total = data?.total ?? 0;
  const { mutateAsync: deleteUserData } = useDeleteUserMutation();

  const handleDeleteUser = async (user: User) => {
    const confirmed = await swalConfirm(t("adminPanel.users.deleteConfirmationTitle"), t("adminPanel.users.deleteConfirmationText"));
    if (confirmed) {
      try {
        await deleteUserData(user.id);
      } catch (err: unknown) {
        const error = err as { response?: { data?: { requires_handover?: boolean; message?: string } } };
        if (error.response?.data?.requires_handover) {
          toast.error(error.response.data.message);
          setHandoverUser(user);
        } else {
          toast.error(error.response?.data?.message || "Failed to delete user.");
        }
      }
    }
  }

  const onSuccess = async (user: User) => {
    setShowAddUser(false);
    if (user.setup_sms_sent === false) {
      toast.error(user.message || "User created, but the password setup SMS could not be sent.");
      return;
    }
    toast.success(user.message || "User created and password setup SMS sent.");
  }

  const handleResendSetup = async (user: User) => {
    if (resendingUserId !== null) return;

    const confirmed = await swalConfirm(
      "Resend password setup link?",
      `Send a new password setup link to ${user.name}. Any earlier unused link will stop working.`
    );

    if (!confirmed) return;

    try {
      setResendingUserId(user.id);
      const response = await resendPasswordSetup(user.id);
      toast.success(response.message);
    } catch (error) {
      const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(message || "Could not send the password setup SMS.");
    } finally {
      setResendingUserId(null);
    }
  };

  const onSuccessUpdate = async () => {
    setShowEditUser(false);
    toast.success("User updated successfully");
  }

  const onClose = () => {
    setShowViewUser(false);
    setViewingUser(null);
  }


  

  return (
    <div className="space-y-4">

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder={t("adminPanel.users.searchPlaceholder")}
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <button
          onClick={() => setShowAddUser(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90"
          style={{ background: "#1E40AF" }}
        >
          <Plus className="w-4 h-4" />
          {t("adminPanel.users.addUser")}
        </button>
      </div>

      <div className="overflow-x-auto border border-gray-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900">
        {loading ? <Loader text="Loading..." /> : <table className="w-full text-sm">
          <thead className="bg-gray-50/90 dark:bg-slate-800/80 border-b border-gray-100 dark:border-slate-800">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                {t("adminPanel.users.user")}
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                {t("adminPanel.users.role")}
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                {t("adminPanel.users.institution")}
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">
                {t("adminPanel.users.status")}
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">
                {t("adminPanel.users.duties")}
              </th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap pr-6">
                {t("adminPanel.users.actions")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
            {(users ?? []).map(user => (
                <tr key={user.id} className="hover:bg-blue-50/20 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                        style={{ background: "#1E40AF" }}
                      >
                        {user.name.charAt(0).toUpperCase() + (user.name.charAt(1) || "").toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-gray-900 dark:text-slate-100 text-xs">
                          {user.name}
                        </div>
                        {user.nic && (
                          <div className="text-[11px] text-gray-500 dark:text-slate-400">
                            {user.nic}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-950/80 dark:text-blue-200">
                      {formatRole(user.roles[0]?.name ?? "")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600 dark:text-slate-300">
                    {user.institution?.name || "-"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {user.is_active === false ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 dark:bg-red-950/50 px-2.5 py-0.5 text-[11px] font-medium text-red-700 dark:text-red-300 border border-red-200/60 dark:border-red-900/60">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                        {t("adminPanel.users.inactive")}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-900/60">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        {t("adminPanel.users.active")}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setDelegatingUser(user)}
                        title={t("adminPanel.users.appointActingOfficer")}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200/80 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800/60 dark:hover:bg-purple-900/50 transition-colors cursor-pointer"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                        <span>{t("adminPanel.users.acting")}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setHandoverUser(user)}
                        title={t("adminPanel.users.workloadHandover")}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800/60 dark:hover:bg-amber-900/50 transition-colors cursor-pointer"
                      >
                        <UserCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                        <span>{t("adminPanel.users.handover")}</span>
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/40 text-blue-600 dark:text-blue-400 cursor-pointer transition-colors"
                        onClick={() => {
                          setViewingUser(user);
                          setShowViewUser(true);
                        }}
                        title={t("adminPanel.users.viewUser")}
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/40 text-blue-600 dark:text-blue-400 cursor-pointer transition-colors"
                        onClick={() => {
                          setEditingUser(user);
                          setShowEditUser(true);
                        }}
                        title={t("adminPanel.users.editUser")}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        className="p-1.5 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-950/40 text-amber-600 dark:text-amber-400 cursor-pointer disabled:opacity-50 transition-colors"
                        onClick={() => handleResendSetup(user)}
                        disabled={resendingUserId === user.id}
                        title={t("adminPanel.users.resendPasswordSetup")}
                      >
                        <Send className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 text-red-500 dark:text-red-400 cursor-pointer transition-colors"
                        onClick={() => handleDeleteUser(user)}
                        title={t("adminPanel.users.delete")}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
            ))}
          </tbody>
        </table>}
      </div>

      {lastPage > 1 && (
        <Pagination
          currentPage={currentPage}
          lastPage={lastPage}
          total={total}
          loading={loading}
          itemName="users"
          onPageChange={setPage}
        />
      )}

      {showAddUser && (
        <Modal onClose={() => setShowAddUser(false)}>
          <AddUserForm onSuccess={onSuccess} />
        </Modal>
      )}

      {showViewUser && (
        <Modal onClose={onClose}>
          <ViewUserForm onClose={onClose} userId={viewingUser?.id?.toString() ?? ""} />
        </Modal>
      )}

      {showEditUser && (
        <Modal onClose={() => setShowEditUser(false)}>
          <EditUserForm onClose={() => setShowEditUser(false)} userId={editingUser?.id?.toString() ?? ""} onSuccess={onSuccessUpdate} />
        </Modal>
      )}

      {handoverUser && (
        <UserHandoverModal
          user={handoverUser}
          availableUsers={users}
          onClose={() => setHandoverUser(null)}
          onSuccess={() => queryClient.invalidateQueries()}
        />
      )}

      {delegatingUser && (
        <DelegationModal
          officer={delegatingUser}
          availableUsers={users}
          onClose={() => setDelegatingUser(null)}
          onSuccess={() => queryClient.invalidateQueries()}
        />
      )}
    </div>
  )
}

export default UserTab
