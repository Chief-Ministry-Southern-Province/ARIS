import { useTranslation } from "react-i18next";

import { FormField } from "@/components/molecules/FormField";

import { useVehicle, useVehicleDriverHistory } from "@/hooks/queries/useVehicleQueries";
import { useVisibleInstitutions } from "@/hooks/queries/useInstitutionQueries";
import { useAvailableDrivers } from "@/hooks/queries/useUserQueries";

type ViewVehicleFormProps = {
  vehicleId: number;
  onClose?: () => void;
};

type FieldValueProps = {
  value?: string | number | null;
};

function FieldValue({ value }: FieldValueProps) {
  return (
    <div className="flex min-h-10.5 w-full items-center rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700">
      {value ?? "-"}
    </div>
  );
}

export default function ViewVehicleForm({vehicleId,onClose,}: ViewVehicleFormProps) {
  const { t } = useTranslation();

  const { data: vehicle, isLoading: loadingVehicle } = useVehicle(vehicleId);
  const { data: driverHistories = [] } = useVehicleDriverHistory(vehicleId);
  const { data: institutions = [] } = useVisibleInstitutions();
  const { data: drivers = [], isLoading: loadingDrivers } = useAvailableDrivers();

  if (loadingVehicle || !vehicle) {
    return (
      <div className="flex justify-center p-10">
        Loading vehicle...
      </div>
    );
  }

  const institutionName = institutions?.find(
    (inst) => inst.id === vehicle.institution_id
  )?.name;

  const driverName = drivers?.find(
    (driver) => driver.id === vehicle.driver_id
  )?.name;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <h2 className="mb-6 text-lg font-semibold">
        View Vehicle Details
      </h2>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Registration */}

        <FormField label='Registration Number'>
          <FieldValue value={vehicle.vehicle_number} />
        </FormField>

        <FormField label='Registered Date'>
          <FieldValue value={vehicle.registered_date} />
        </FormField>

        {/* Vehicle */}

        <FormField label='Vehicle Type'>
          <FieldValue value={vehicle.vehicle_type} />
        </FormField>

        <FormField label='Brand'>
          <FieldValue value={vehicle.brand} />
        </FormField>

        <FormField label='Model'>
          <FieldValue value={vehicle.model} />
        </FormField>

        <FormField label='Manufactured Year'>
          <FieldValue value={vehicle.manufactured_year} />
        </FormField>

        {/* Technical */}

        <FormField label='Engine Number'>
          <FieldValue value={vehicle.engine_number} />
        </FormField>

        <FormField label='Chassis Number'>
          <FieldValue value={vehicle.chassis_number} />
        </FormField>

        {/* Insurance */}

        <FormField label='Insurance Number'>
          <FieldValue value={vehicle.insurance_number} />
        </FormField>

        <FormField label='Insurance Expiry'>
          <FieldValue value={vehicle.insurance_expiry_date} />
        </FormField>

        {/* Ownership */}

        <FormField label='Institution'>
          <FieldValue value={institutionName ?? "-"} />
        </FormField>

        <FormField label='Registered Owner'>
          <FieldValue value={vehicle.registered_owner} />
        </FormField>

        <FormField label='Vehicle Value'>
          <FieldValue
            value={
              vehicle.value
                ? `Rs. ${Number(vehicle.value).toLocaleString()}`
                : "-"
            }
          />
        </FormField>

        {/* Driver */}

        <FormField label='Active Driver'>
          <div className="flex min-h-10.5 w-full items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700">
            <span>{loadingDrivers ? "Loading..." : driverName ?? "No Active Driver"}</span>
            {driverName && (
              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-green-100 text-green-700">
                Active
              </span>
            )}
          </div>
        </FormField>

        {vehicle.drivers && vehicle.drivers.length > 0 && (
          <div className="md:col-span-2">
            <FormField label={`Driver Pool (${vehicle.drivers.length})`}>
              <div className="flex flex-wrap gap-2 p-3 rounded-lg border border-gray-200 bg-gray-50/50">
                {vehicle.drivers.map((d) => (
                  <span
                    key={d.id}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs border ${
                      d.id === vehicle.driver_id
                        ? "bg-green-50 border-green-300 text-green-800 font-semibold"
                        : "bg-white border-gray-200 text-gray-700"
                    }`}
                  >
                    <span>{d.name}</span>
                    {d.id === vehicle.driver_id && (
                      <span className="text-[10px] bg-green-200 text-green-800 px-1.5 py-0.2 rounded font-bold">
                        ACTIVE
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </FormField>
          </div>
        )}

        {/* Fuel */}

        <FormField label='Fuel Type'>
          <FieldValue value={vehicle.fuel_type} />
        </FormField>

        {/* Status */}

        <FormField label='Status'>
          <div
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
              vehicle.status === "ACTIVE"
                ? "bg-green-100 text-green-700"
                : vehicle.status === "UNDER_MAINTENANCE"
                ? "bg-yellow-100 text-yellow-700"
                : vehicle.status === "OUT_OF_SERVICE"
                ? "bg-red-100 text-red-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {vehicle.status.replaceAll("_", " ")}
          </div>
        </FormField>

        {/* Driver Activation History */}
        {driverHistories.length > 0 && (
          <div className="md:col-span-2 mt-2">
            <FormField label={`Driver Activation History (${driverHistories.length})`}>
              <div className="space-y-2 max-h-56 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50/50 p-3">
                {driverHistories.map((h) => {
                  const isActivated = h.action === "ACTIVATED";
                  const dateStr = new Date(h.created_at).toLocaleString([], {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <div
                      key={h.id}
                      className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-2.5 text-xs"
                    >
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                            isActivated
                              ? "bg-green-100 text-green-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {h.action}
                        </span>
                        <span className="font-semibold text-gray-800">
                          {h.driver?.name ?? `Driver #${h.driver_id}`}
                        </span>
                        {h.notes && (
                          <span className="text-gray-500 italic">
                            ({h.notes})
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-gray-400">
                        {dateStr} • By {h.performer?.name ?? "Admin"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </FormField>
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          className="rounded-lg bg-blue-700 px-5 py-2 text-white transition hover:bg-blue-800"
          onClick={onClose}
        >
          {t("common.close")}
        </button>
      </div>
    </div>
  );
}
