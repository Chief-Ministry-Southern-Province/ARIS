import { useState } from "react";
import { useTranslation } from "react-i18next";
import { UserCheck, ShieldAlert, Plus, Trash2, CheckCircle2, AlertCircle, Loader2, History } from "lucide-react";
import { toast } from "react-toastify";
import type { VehicleResponse } from "@/types/vehicle.type";
import { useAvailableDrivers } from "@/hooks/queries/useUserQueries";
import { useActivateVehicleDriverMutation, useSyncVehicleDriversMutation } from "@/hooks/mutations/useResourceMutations";
import { useVehicle, useVehicleDriverHistory } from "@/hooks/queries/useVehicleQueries";

interface ManageVehicleDriversModalProps {
  vehicleId: number;
  initialVehicle?: VehicleResponse;
  onClose: () => void;
}

export default function ManageVehicleDriversModal({
  vehicleId,
  initialVehicle,
  onClose,
}: ManageVehicleDriversModalProps) {
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState<"pool" | "history">("pool");

  const { data: vehicleData, isLoading: vehicleLoading } = useVehicle(vehicleId);
  const vehicle = vehicleData ?? initialVehicle;

  const { data: driverHistories = [], isLoading: historyLoading } = useVehicleDriverHistory(vehicleId);

  const { data: allDrivers = [], isLoading: driversLoading } = useAvailableDrivers();

  const { mutateAsync: activateDriver, isPending: activating } = useActivateVehicleDriverMutation();
  const { mutateAsync: syncDrivers, isPending: syncing } = useSyncVehicleDriversMutation();

  const [selectedNewDriverId, setSelectedNewDriverId] = useState<number | "">("");

  const assignedDrivers = vehicle?.drivers ?? [];
  const activeDriverId = vehicle?.driver_id;

  // Drivers available to be added (not yet in vehicle's pool)
  const availableToAdd = allDrivers.filter(
    (driver) => !assignedDrivers.some((assigned) => assigned.id === driver.id)
  );

  const handleActivate = async (driverId: number | null) => {
    try {
      await activateDriver({ id: vehicleId, driverId });
      toast.success(
        driverId
          ? t("adminPanel.vehicles.driverActivatedSuccess", "Active driver updated successfully.")
          : t("adminPanel.vehicles.driverDeactivatedSuccess", "Driver deactivated successfully.")
      );
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        t("adminPanel.vehicles.driverActionFailed", "Failed to update driver status.");
      toast.error(message);
    }
  };

  const handleAddDriver = async (makeActive = false) => {
    if (!selectedNewDriverId) return;

    const currentIds = assignedDrivers.map((d) => d.id);
    const updatedIds = [...currentIds, Number(selectedNewDriverId)];
    const targetActive = makeActive ? Number(selectedNewDriverId) : activeDriverId;

    try {
      await syncDrivers({
        id: vehicleId,
        driverIds: updatedIds,
        activeDriverId: targetActive,
      });
      setSelectedNewDriverId("");
      toast.success(t("adminPanel.vehicles.driverAddedToPool", "Driver added to vehicle pool."));
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        t("adminPanel.vehicles.driverActionFailed", "Failed to add driver.");
      toast.error(message);
    }
  };

  const handleRemoveDriver = async (driverIdToRemove: number) => {
    const updatedIds = assignedDrivers
      .map((d) => d.id)
      .filter((id) => id !== driverIdToRemove);
    const targetActive = activeDriverId === driverIdToRemove ? null : activeDriverId;

    try {
      await syncDrivers({
        id: vehicleId,
        driverIds: updatedIds,
        activeDriverId: targetActive,
      });
      toast.success(t("adminPanel.vehicles.driverRemovedFromPool", "Driver removed from vehicle pool."));
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        t("adminPanel.vehicles.driverActionFailed", "Failed to remove driver.");
      toast.error(message);
    }
  };

  const busy = activating || syncing;

  return (
    <div className="bg-white rounded-2xl p-6 max-w-2xl w-full border border-gray-100 shadow-xl">
      {/* Header */}
      <div className="flex items-start justify-between pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-gray-900">
                {t("adminPanel.vehicles.manageDriversTitle", "Manage Vehicle Drivers")}
              </h2>
              <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 font-semibold">
                {vehicle?.vehicle_number}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              {vehicle?.brand} {vehicle?.model} • {vehicle?.institution?.name}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mt-4 mb-4 gap-6">
        <button
          type="button"
          onClick={() => setActiveTab("pool")}
          className={`flex items-center gap-2 pb-2.5 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === "pool"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>{t("adminPanel.vehicles.driverPoolTab", "Driver Pool")}</span>
          <span className="ml-1 px-1.5 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700">
            {assignedDrivers.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("history")}
          className={`flex items-center gap-2 pb-2.5 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === "history"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <History className="w-4 h-4" />
          <span>{t("adminPanel.vehicles.activationHistoryTab", "Activation History")}</span>
          {driverHistories.length > 0 && (
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-xs bg-blue-50 text-blue-700">
              {driverHistories.length}
            </span>
          )}
        </button>
      </div>

      {activeTab === "pool" ? (
        <>
          {/* Info notice about rule */}
          <div className="mb-4 p-3 rounded-lg bg-amber-50 border border-amber-200/80 flex items-start gap-2.5 text-xs text-amber-900">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">
                {t("adminPanel.vehicles.singleActiveRuleTitle", "Single Active Driver Rule:")}
              </span>{" "}
              {t(
                "adminPanel.vehicles.singleActiveRuleDesc",
                "A vehicle can have multiple assigned drivers in its pool, but only ONE driver can be active at a time. The active driver is the only driver permitted to report accidents for this vehicle."
              )}
            </div>
          </div>

          {vehicleLoading && !vehicle ? (
            <div className="py-12 flex justify-center items-center text-gray-400 gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Loading vehicle drivers...</span>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Assigned Pool Section */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    {t("adminPanel.vehicles.assignedDriverPool", "Assigned Driver Pool")} ({assignedDrivers.length})
                  </h3>
                </div>

                {assignedDrivers.length === 0 ? (
                  <div className="p-6 text-center rounded-xl border border-dashed border-gray-200 bg-gray-50/50">
                    <AlertCircle className="w-6 h-6 mx-auto text-gray-400 mb-1.5" />
                    <p className="text-xs text-gray-500">
                      {t("adminPanel.vehicles.noDriversInPool", "No drivers are currently assigned to this vehicle.")}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {assignedDrivers.map((driver) => {
                      const isActive = activeDriverId === driver.id;

                      return (
                        <div
                          key={driver.id}
                          className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                            isActive
                              ? "border-green-300 bg-green-50/50 shadow-xs"
                              : "border-gray-200 bg-white hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                                driver.name
                              )}&background=${isActive ? "16A34A" : "6B7280"}&color=fff`}
                              alt={driver.name}
                              className="w-9 h-9 rounded-full object-cover shrink-0 ring-2 ring-white"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-gray-900">{driver.name}</span>
                                {isActive ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-green-100 text-green-800">
                                    <CheckCircle2 className="w-3 h-3 text-green-600" />
                                    {t("adminPanel.vehicles.activeDriver", "Active Driver")}
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-600">
                                    {t("adminPanel.vehicles.inactiveInPool", "Pool Driver")}
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-gray-500 mt-0.5 flex gap-2">
                                <span>NIC: {driver.nic || "-"}</span>
                                <span>•</span>
                                <span>Mobile: {driver.mobile || "-"}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {isActive ? (
                              <button
                                type="button"
                                disabled={busy}
                                onClick={() => handleActivate(null)}
                                className="px-3 py-1.5 text-xs font-medium text-amber-700 bg-amber-100 hover:bg-amber-200 rounded-lg transition disabled:opacity-50 cursor-pointer"
                              >
                                {t("adminPanel.vehicles.deactivate", "Deactivate")}
                              </button>
                            ) : (
                              <button
                                type="button"
                                disabled={busy}
                                onClick={() => handleActivate(driver.id)}
                                className="px-3 py-1.5 text-xs font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-xs transition disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                {t("adminPanel.vehicles.setAsActive", "Set as Active")}
                              </button>
                            )}

                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => handleRemoveDriver(driver.id)}
                              title={t("adminPanel.vehicles.removeFromPool", "Remove from pool")}
                              className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition cursor-pointer disabled:opacity-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Add New Driver to Pool */}
              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  {t("adminPanel.vehicles.addDriverToPool", "Add Driver to Vehicle Pool")}
                </h3>

                <div className="flex flex-col sm:flex-row gap-2">
                  <select
                    value={selectedNewDriverId}
                    onChange={(e) => setSelectedNewDriverId(e.target.value ? Number(e.target.value) : "")}
                    disabled={busy || driversLoading || availableToAdd.length === 0}
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  >
                    <option value="">
                      {availableToAdd.length === 0
                        ? t("adminPanel.vehicles.noMoreDriversAvailable", "No other drivers available in institution")
                        : t("adminPanel.vehicles.selectDriverToAdd", "Select driver to add...")}
                    </option>
                    {availableToAdd.map((driver) => (
                      <option key={driver.id} value={driver.id}>
                        {driver.name} ({driver.mobile || driver.nic})
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    disabled={busy || !selectedNewDriverId}
                    onClick={() => handleAddDriver(false)}
                    className="px-3.5 py-2 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    {t("adminPanel.vehicles.addAsInactive", "Add to Pool")}
                  </button>

                  <button
                    type="button"
                    disabled={busy || !selectedNewDriverId}
                    onClick={() => handleAddDriver(true)}
                    className="px-3.5 py-2 text-xs font-medium text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {t("adminPanel.vehicles.addAndActivate", "Add & Activate")}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        /* History Tab */
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
              {t("adminPanel.vehicles.activationTimeline", "Driver Activation Timeline")} ({driverHistories.length})
            </h3>
          </div>

          {historyLoading ? (
            <div className="py-12 flex justify-center items-center text-gray-400 gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Loading history...</span>
            </div>
          ) : driverHistories.length === 0 ? (
            <div className="p-8 text-center rounded-xl border border-dashed border-gray-200 bg-gray-50/50">
              <History className="w-6 h-6 mx-auto text-gray-400 mb-1.5" />
              <p className="text-xs text-gray-500">
                {t("adminPanel.vehicles.noHistoryYet", "No activation or deactivation events recorded yet for this vehicle.")}
              </p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
              {driverHistories.map((item) => {
                const isActivated = item.action === "ACTIVATED";
                const dateStr = new Date(item.created_at).toLocaleString([], {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl border border-gray-200 bg-white hover:border-gray-300 transition-all text-xs"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div
                          className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                            isActivated
                              ? "bg-green-100 text-green-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {isActivated ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            <AlertCircle className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-gray-900">
                              {item.driver?.name ?? `Driver #${item.driver_id}`}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                isActivated
                                  ? "bg-green-100 text-green-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {item.action}
                            </span>
                          </div>

                          {item.notes && (
                            <p className="text-gray-600 mt-1 italic">
                              "{item.notes}"
                            </p>
                          )}

                          <div className="text-[11px] text-gray-400 mt-1.5 flex items-center gap-2 flex-wrap">
                            <span>
                              Changed by: <strong className="text-gray-600">{item.performer?.name ?? "System Administrator"}</strong>
                            </span>
                            <span>•</span>
                            <span>{dateStr}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition cursor-pointer"
        >
          {t("common.close", "Close")}
        </button>
      </div>
    </div>
  );
}
