import { Search, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import AddInstitutionForm from "@/components/pages/forms/common/institution/AddInstitutionForm";
import Modal from "@/components/molecules/Modal";
import { useInstitutions } from "@/hooks/queries/useInstitutionQueries"
import type { Institution } from "@/types/Institution.type";
import Loader from "@/components/atoms/Loader";
import {formatInstitutionType} from "@/utils/formatInstitution";
import EditInstitutionForm from "@/components/pages/forms/common/institution/EditInstitutionForm";
import ViewInstitutionForm from "@/components/pages/forms/common/institution/ViewInstitutionForm";
//import { Trash2 } from "lucide-react";
//import {swalConfirm} from "@/utils/swal";

const InstitutionTab = () => {

  const [showAddInstitution, setShowAddInstitution] = useState(false);
  const [showEditInstitution, setShowEditInstitution] = useState(false);
  const [showViewInstitution, setShowViewInstitution] = useState(false);
  const [selectedInstitution, setSelectedInstitution] = useState<number | null>(null);
  //const { deleteInstitutionData } = useDeleteInstitution();
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

  // const  handleDeleteInstitution = async (institutionId: string) => {
  //   const confirmed = await swalConfirm("Are you sure?", "This action cannot be undone.");
  //   if (confirmed) {
  //     await deleteInstitutionData(institutionId);
  //     await fetchInstitutions();
  //   }
  // };

  const handleSuccess = async () => {
      setShowAddInstitution(false);
      setShowEditInstitution(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 1000);

    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search institutions..."
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
          />
        </div>
        <button 
         onClick={() => setShowAddInstitution(true)} 
         className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90" style={{ background: "#1E40AF" }}>
          <Plus className="w-4 h-4" />Add Institution
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {loading ?<div className="col-span-2"> <Loader /> </div> : institutions.map((inst: Institution) => (
          <div key={inst.id} className="p-4 border border-gray-200 rounded-xl hover:border-blue-200 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-800 truncate">
                  {inst.name}
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  {formatInstitutionType(inst.type)}
                </p>
              </div>
              <div className="ml-4 flex items-center gap-2">
                <span className="rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 whitespace-nowrap">
                  {inst.province}
                </span>

                {/* <button
                  className="rounded border border-red-200 p-1.5 text-red-600 transition-colors hover:bg-red-50"
                  onClick={() => handleDeleteInstitution(String(inst.id))}
                >
                  <Trash2 className="h-4 w-4" />
                </button> */}
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-500 space-y-0.5">
              <div>District: <span className="font-medium text-gray-700">{inst.district}</span></div>
              <div>Head of Institution: <span className="font-medium text-gray-700">{inst.head_of_institution}</span></div>
            </div>
            <div className="flex gap-2 mt-3">

              <button 
                className="flex-1 py-1.5 border border-gray-200 rounded text-xs text-gray-600 hover:bg-gray-50"
                onClick={() => {
                  setShowEditInstitution(true);
                  setSelectedInstitution(inst.id);
                }}
              >
                Edit
              </button>

              <button 
                className="flex-1 py-1.5 border border-gray-200 rounded text-xs text-gray-600 hover:bg-gray-50"
                onClick={() => {
                  setShowViewInstitution(true);
                  setSelectedInstitution(inst.id);
                }}
              >
                View
              </button>

              <button className="flex-1 py-1.5 border border-blue-200 rounded text-xs text-blue-600 hover:bg-blue-50">View Cases</button>

            </div>
          </div>
        ))}
      </div>

      {pagination.last_page > 1 && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3">
          <div className="text-xs text-gray-500">
            Page {pagination.current_page} of {pagination.last_page} · {pagination.total} total
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
              disabled={page === 1 || loading}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
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
                    : "border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {pageNumber}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setPage((currentPage) => Math.min(pagination.last_page, currentPage + 1))}
              disabled={page === pagination.last_page || loading}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
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
          <EditInstitutionForm onSuccess={handleSuccess} institutionId={String(selectedInstitution) } setShowEditInstitution={setShowEditInstitution} />
        </Modal>
      )}

      {showViewInstitution && (
        <Modal onClose={() => setShowViewInstitution(false)}>
          <ViewInstitutionForm institutionId={String(selectedInstitution)} setShowViewInstitution={setShowViewInstitution} />
        </Modal>
      )}

    </div>
  )
}

export default InstitutionTab
