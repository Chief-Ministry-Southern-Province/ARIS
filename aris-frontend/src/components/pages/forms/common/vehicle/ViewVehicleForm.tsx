import { useTranslation } from "react-i18next";

import { FormField } from "@/components/molecules/FormField";

import { useVehicle } from "@/hooks/queries/useVehicleQueries";
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

        <FormField label='Driver'>
          <FieldValue value={loadingDrivers ? "Loading..." : driverName} />
        </FormField>

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
