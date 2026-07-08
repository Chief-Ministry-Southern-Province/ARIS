import { Search, Plus, Edit2, Trash2, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import AddUserForm from "@/components/pages/forms/common/user/AddUserForm";
import Modal from "@/components/molecules/Modal";
import { useTranslation } from "react-i18next";
import { useGetAllUsers } from "@/hooks/useUser";
import Loader from "@/components/atoms/Loader";
import { formatRole } from "@/utils/formatRole";
import { toast } from "react-toastify";
import ViewUserForm from "@/components/pages/forms/common/user/ViewUserForm";
import type { User } from "@/types/User.type";
import EditUserForm from "@/components/pages/forms/common/user/EditUserForm";
import Pagination from "@/components/molecules/Pagination";
import {useDeleteUser} from "@/hooks/useUser";
import {swalConfirm} from "@/utils/swal";

const UserTab = () => {
  const [showAddUser, setShowAddUser] = useState(false);
  const [showViewUser, setShowViewUser] = useState(false);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [showEditUser, setShowEditUser] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const {t} = useTranslation();

  const {fetchAllUsers,users,currentPage,lastPage,total,loading } = useGetAllUsers();

  const {deleteUserData} = useDeleteUser();

  const handleDeleteUser = async (userId: string) => {
    const confirmed = await swalConfirm(t("adminPanel.users.deleteConfirmationTitle"), t("adminPanel.users.deleteConfirmationText"));
    if (confirmed) {
      await deleteUserData(Number(userId));
      await fetchAllUsers(page,search);
    }
  }

  const onSuccess = async () => {
    setShowAddUser(false);
    toast.success("User created successfully");
    await fetchAllUsers(page,search);
  }

  const onSuccessUpdate = async () => {
    setShowEditUser(false);
    toast.success("User updated successfully");
    await fetchAllUsers(page,search);
  }

  const onClose = () => {
    setShowViewUser(false);
    setViewingUser(null);
  }


  useEffect(() => {
    fetchAllUsers(page,search);
  }, [page,search]);

  

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

      <div className="overflow-x-auto border border-gray-200 rounded-xl">
        {loading ? <Loader text="Loading..." /> :<table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {["User", "Role", "Institution",  "Actions"].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t(`adminPanel.users.${h.toLowerCase()}`)}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {(users ?? []).map(user => (
                <tr key={user.id} className="hover:bg-blue-50/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        style={{ background: "#1E40AF" }}>{user.name.charAt(0).toUpperCase()+ user.name.charAt(1).toUpperCase()}</div>
                      <div>
                        <div className="font-medium text-gray-800 text-xs">{user.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">{formatRole(user.roles[0].name)}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600">{user.institution.name}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">

                      <button className="p-1.5 rounded hover:bg-blue-50 text-blue-600 cursor-pointer" onClick={() => {
                        setViewingUser(user);
                        setShowViewUser(true);
                      }}><Eye className="w-3.5 h-3.5" /></button>

                      <button className="p-1.5 rounded hover:bg-blue-50 text-blue-600 cursor-pointer"
                        onClick={() => {
                          setEditingUser(user);
                          setShowEditUser(true);
                        }}
                      ><Edit2 className="w-3.5 h-3.5" /></button>

                      <button className="p-1.5 rounded hover:bg-red-50 text-red-500 cursor-pointer"
                        onClick={() => handleDeleteUser(String(user.id))}
                      ><Trash2 className="w-3.5 h-3.5" /></button>
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
    </div>
  )
}

export default UserTab