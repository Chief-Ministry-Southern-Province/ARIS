import { Search, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AddInstitutionForm from "@/components/pages/forms/common/institution/AddInstitutionForm";
import Modal from "@/components/molecules/Modal";
import { useInstitutions } from "@/hooks/queries/useInstitutionQueries";
import type { Institution } from "@/types/Institution.type";
import Loader from "@/components/atoms/Loader";
import { formatInstitutionType } from "@/utils/formatInstitution";
import EditInstitutionForm from "@/components/pages/forms/common/institution/EditInstitutionForm";
import ViewInstitutionForm from "@/components/pages/forms/common/institution/ViewInstitutionForm";
import { swalConfirm } from "@/utils/swal";
import { useDeleteInstitutionMutation } from "@/hooks/mutations/useResourceMutations";
import { toast } from "react-toastify";
import { useAuth } from "@/context/auth/AuthContext";

const InstitutionTab = () => {
  const { t } = useTranslation();
  const { role: currentUserRoles, institutionId: currentInstitutionId } = useAuth();
  const isSystemAdmin = currentUserRoles?.includes("system_admin");
  const isSubjectOfficer = currentUserRoles?.includes("subject_officer");

  const [showAddInstitution, setShowAddInstitution] = useState(false);
  const [showEditInstitution, setShowEditInstitution] = useState(false);
  const [showViewInstitution, setShowViewInstitution] = useState(false);
  const [selectedInstitution, setSelectedInstitution] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const { data, isLoading: loading } = useInstitutions(page, debouncedSearch);
  const institutions = data?.data ?? [];
  const pagination = {
    current_page: data?.current_page ?? page,
    last_page: data?.last_page ?? 1,
    per_page: data?.per_page ?? 10,
    total: data?.total ?? 0,
  };

  const { mutateAsync: deleteInstitutionData, isPending: deleteLoading } = useDeleteInstitutionMutation();

  const canDeleteInstitution = (inst: Institution): boolean => {
    // Root Ministry can never be deleted
    if (inst.type === "MINISTRY" || !inst.parent_institution_id) {
      return false;
    }

    if (isSystemAdmin) {
      return true;
    }

    if (isSubjectOfficer) {
      // Subject officers cannot delete their own institution
      if (inst.id === currentInstitutionId) {
        return false;
      }
      // Subject officers can only delete child institutions under their own institution
      return inst.parent_institution_id === currentInstitutionId;
    }

    return false;
  };

  const handleDeleteInstitution = async (inst: Institution) => {
    const confirmed = await swalConfirm(
      t("adminPanel.institutions.deleteConfirmationTitle", "Delete Institution"),
      t(
        "adminPanel.institutions.deleteConfirmationText",
        `Are you sure you want to delete "${inst.name}"? This action cannot be undone.`
      )
    );

    if (confirmed) {
      try {
        await deleteInstitutionData(inst.id);
        toast.success(t("adminPanel.institutions.deleteSuccess", "Institution deleted successfully"));
      } catch (err: unknown) {
        const error = err as { response?: { data?: { message?: string } } };
        toast.error(error.response?.data?.message || "Failed to delete institution.");
      }
    }
  };

  const handleSuccess = async () => {
    setShowAddInstitution(false);
    setShowEditInstitution(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div className="relative flex-1 max-w-sm min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={t("adminPanel.institutions.searchPlaceholder", "Search institutions...")}
            className="w-full pl-9 pr-3 py-2 border border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
          />
        </div>
        {(isSystemAdmin || isSubjectOfficer) && (
          <button
            onClick={() => setShowAddInstitution(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90 transition cursor-pointer"
            style={{ background: "#1E40AF" }}
          >
            <Plus className="w-4 h-4" />
            {t("adminPanel.institutions.addInstitution", "Add Institution")}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {loading ? (
          <div className="col-span-2">
            <Loader />
          </div>
        ) : institutions.length === 0 ? (
          <div className="col-span-2 py-8 text-center text-sm text-gray-500 dark:text-slate-400">
            {t("common.noRecordsFound", "No institutions found")}
          </div>
        ) : (
          institutions.map((inst: Institution) => {
            const hasDeleteAccess = canDeleteInstitution(inst);

            return (
              <div
                key={inst.id}
                className="p-4 border border-gray-200 dark:border-slate-800 rounded-xl hover:border-blue-200 dark:hover:border-slate-700 bg-white dark:bg-slate-900 transition-colors shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-100 truncate">
                      {inst.name}
                    </h3>
                    <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">
                      {formatInstitutionType(inst.type)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {inst.province && (
                      <span className="whitespace-nowrap rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-950/80 dark:text-blue-200">
                        {inst.province}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-3 text-xs text-gray-500 dark:text-slate-400 space-y-0.5">
                  <div>
                    {t("adminPanel.institutions.district", "District")}:{" "}
                    <span className="font-medium text-gray-700 dark:text-slate-200">{inst.district || "-"}</span>
                  </div>
                  <div>
                    {t("adminPanel.institutions.headOfInstitution", "Head of Institution")}:{" "}
                    <span className="font-medium text-gray-700 dark:text-slate-200">
                      {inst.head_of_institution || "-"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100 dark:border-slate-800">
                  <button
                    className="flex-1 py-1.5 border border-gray-200 dark:border-slate-700 rounded-lg text-xs font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    onClick={() => {
                      setSelectedInstitution(inst.id);
                      setShowEditInstitution(true);
                    }}
                  >
                    {t("adminPanel.institutions.edit", "Edit")}
                  </button>

                  <button
                    className="flex-1 py-1.5 border border-gray-200 dark:border-slate-700 rounded-lg text-xs font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    onClick={() => {
                      setSelectedInstitution(inst.id);
                      setShowViewInstitution(true);
                    }}
                  >
                    {t("adminPanel.institutions.view", "View")}
                  </button>

                  {hasDeleteAccess && (
                    <button
                      type="button"
                      title={t("adminPanel.institutions.delete", "Delete Institution")}
                      disabled={deleteLoading}
                      onClick={() => handleDeleteInstitution(inst)}
                      className="p-1.5 border border-red-200 dark:border-red-900/60 rounded-lg text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer disabled:opacity-50 shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {pagination.last_page > 1 && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3">
          <div className="text-xs text-gray-500 dark:text-slate-400">
            Page {pagination.current_page} of {pagination.last_page} · {pagination.total} total
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
              disabled={page === 1 || loading}
              className="rounded-lg border border-gray-200 dark:border-slate-700 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-slate-300 transition-colors hover:bg-gray-50 dark:hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>

            {Array.from({ length: pagination.last_page }, (_, index) => index + 1).map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                onClick={() => setPage(pageNumber)}
                disabled={loading}
                className={`min-w-9 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors disabled:cursor-not-allowed ${
                  pageNumber === page
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800"
                }`}
              >
                {pageNumber}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setPage((currentPage) => Math.min(pagination.last_page, currentPage + 1))}
              disabled={page === pagination.last_page || loading}
              className="rounded-lg border border-gray-200 dark:border-slate-700 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-slate-300 transition-colors hover:bg-gray-50 dark:hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {showAddInstitution && (
        <Modal onClose={() => setShowAddInstitution(false)}>
          <AddInstitutionForm onSuccess={handleSuccess} setShowAddInstitution={setShowAddInstitution} />
        </Modal>
      )}

      {showEditInstitution && (
        <Modal onClose={() => setShowEditInstitution(false)}>
          <EditInstitutionForm
            onSuccess={handleSuccess}
            institutionId={String(selectedInstitution)}
            setShowEditInstitution={setShowEditInstitution}
          />
        </Modal>
      )}

      {showViewInstitution && (
        <Modal onClose={() => setShowViewInstitution(false)}>
          <ViewInstitutionForm
            institutionId={String(selectedInstitution)}
            setShowViewInstitution={setShowViewInstitution}
          />
        </Modal>
      )}
    </div>
  );
};

export default InstitutionTab;
