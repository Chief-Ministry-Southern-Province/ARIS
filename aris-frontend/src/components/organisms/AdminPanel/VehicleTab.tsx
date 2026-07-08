import { Search, Plus, Edit2, Trash2, Eye } from "lucide-react";
import { useEffect, useState } from "react";

import AddVehicleForm from "@/components/pages/forms/common/vehicle/AddVehicleForm";
import Modal from "@/components/molecules/Modal";

import EditVehicleForm  from "@/components/pages/forms/common/vehicle/EditVehicleForm";
import {useGetVehicles} from "@/hooks/useVehicle";

import ViewVehicleForm from "@/components/pages/forms/common/vehicle/ViewVehicleForm";
import {useDeleteVehicle} from "@/hooks/useVehicle";
import {swalConfirm} from "@/utils/swal";
import {toast} from "react-toastify";

import Loader from "@/components/atoms/Loader";
import Pagination from "@/components/molecules/Pagination";

const VehicleTab = () => {

  const [showAddVehicle, setShowAddVehicle] = useState(false);

  const [showEditVehicle, setShowEditVehicle] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<number | null>(null);

  const [viewingVehicle, setViewingVehicle] = useState<number | null>(null);
  const [showViewVehicle, setShowViewVehicle] = useState(false);
  
  const {vehicles, fetchVehicles, loading,lastPage, total} = useGetVehicles();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { deleteVehicleData } = useDeleteVehicle();

  const handleDeleteVehicle = async (vehicleId: number) => {
    const confirmed = await swalConfirm("Are you sure?", "This action cannot be undone.");
    if (confirmed) {
      await deleteVehicleData(vehicleId);
      toast.success("Vehicle deleted successfully");
      await fetchVehicles({page, search});
    }
  }

  useEffect(() => {
    fetchVehicles({page, search});
  }, [page, search]);

  const createOnSuccess = () => {
    setShowAddVehicle(false);
    fetchVehicles({page, search});
  };

  const updateOnSuccess = () => {
    setShowEditVehicle(false);
    setSelectedVehicle(null);
    fetchVehicles({page, search});
  }

  const viewOnSuccess = () => {
    setShowViewVehicle(false);
    setViewingVehicle(null);
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

          <input
            type="text"
            placeholder="Search vehicles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={() => setShowAddVehicle(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-white text-sm font-medium hover:opacity-90"
          style={{ background: "#1E40AF" }}
        >
          <Plus className="w-4 h-4" />
          Register Vehicle
        </button>
      </div>

      {/* Vehicle Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-xl bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {[
                "Reg. No.",
                "Type",
                "Institution",
                "Incidents",
                "Assigned Driver",
                "Status",
                "Actions",
              ].map((header) => (
                <th
                  key={header}
                  className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-8">
                  <Loader text="loading vehicles..." />
                </td>
              </tr>
            ) : (
              vehicles.map((vehicle) => (
                <tr
                  key={vehicle.id}
                  className="hover:bg-blue-50/20 transition-colors"
                >
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-blue-700">
                    {vehicle.vehicle_number}
                  </td>

                  <td className="px-4 py-3 text-xs text-gray-700">
                    {vehicle.vehicle_type}
                  </td>

                  <td className="px-4 py-3 text-xs text-gray-600">
                    {vehicle.institution?.name}
                  </td>

                  <td className="px-4 py-3 ">
                    {/* <span
                      className={`font-bold text-sm items-center ${
                        vehicle.incidents >= 5
                          ? "text-red-600"
                          : vehicle.incidents >= 3
                          ? "text-orange-600"
                          : "text-green-600"
                      }`}
                    >
                      {vehicle.incidents}
                    </span> */}
                    3
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <img
                        src={vehicle.driver?.name ? `https://ui-avatars.com/api/?name=${encodeURIComponent(vehicle.driver.name)}&background=1E40AF&color=fff` : "https://ui-avatars.com/api/?name=No+Driver&background=1E40AF&color=fff"}
                        alt={vehicle.driver?.name}
                        className="w-7 h-7 rounded-full object-cover"
                      />

                      <div>
                        <p className="text-xs font-medium text-gray-800">
                          {vehicle.driver?.name}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        vehicle.status === "ACTIVE"
                          ? "bg-green-100 text-green-700"
                          : vehicle.status === "UNDER_MAINTENANCE"
                          ? "bg-yellow-100 text-yellow-700"
                          : vehicle.status === "OUT_OF_SERVICE"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {vehicle.status.replace(/_/g, " ")}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <button
                      className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors cursor-pointer"
                      title="View Vehicle"
                      onClick={() => {
                        setViewingVehicle(Number(vehicle.id));
                        setShowViewVehicle(true);
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors cursor-pointer"
                      title="Edit Vehicle"
                      onClick={() => {
                        setSelectedVehicle(Number(vehicle.id));
                        setShowEditVehicle(true);
                      }}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors cursor-pointer"
                      title="Delete Vehicle"
                      onClick={()=> handleDeleteVehicle(Number(vehicle.id))}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <Pagination
          currentPage={page}
          lastPage={lastPage}
          total={total}
          onPageChange={(page) => setPage(page)}
        />
      </div>

      {/* Register Vehicle Modal */}
      {showAddVehicle && (
        <Modal onClose={() => setShowAddVehicle(false)}>
          <div className="w-full max-w-5xl">
            <AddVehicleForm onSuccess={createOnSuccess} />
          </div>
        </Modal>
      )}

      {/* Edit Vehicle Modal */}
      {showEditVehicle && selectedVehicle !== null && (
        <Modal onClose={() => setShowEditVehicle(false)}>
          <div className="w-full max-w-5xl">
            <EditVehicleForm vehicleId={Number(selectedVehicle)} onSuccess={updateOnSuccess} />
          </div>
        </Modal>
      )}

      {/* View Vehicle Modal */}
      {showViewVehicle && viewingVehicle !== null && (
        <Modal onClose={() => setShowViewVehicle(false)}>
          <div className="w-full max-w-5xl">
            <ViewVehicleForm vehicleId={Number(viewingVehicle)} onClose={viewOnSuccess} />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default VehicleTab;