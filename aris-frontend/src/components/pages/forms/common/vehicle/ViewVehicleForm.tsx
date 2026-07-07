import { FormField } from "@/components/molecules/FormField";
import type { Vehicle } from "@/types/vehicle.type";
import { useTranslation } from "react-i18next";

type ViewVehicleFormProps = {
  vehicle: Vehicle;
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

export default function ViewVehicleForm({
  vehicle,
}: ViewVehicleFormProps) {
  const { t } = useTranslation();

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <h2 className="mb-6 text-lg font-semibold">
        {t("adminPanel.vehicles.viewVehicle")}
      </h2>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Registration */}

        <FormField label={t("adminPanel.vehicles.registrationNumber")}>
          <FieldValue value={vehicle.vehicle_number} />
        </FormField>

        <FormField label={t("adminPanel.vehicles.registeredDate")}>
          <FieldValue value={vehicle.registered_date} />
        </FormField>

        {/* Vehicle */}

        <FormField label={t("adminPanel.vehicles.type")}>
          <FieldValue value={vehicle.vehicle_type} />
        </FormField>

        <FormField label={t("adminPanel.vehicles.brand")}>
          <FieldValue value={vehicle.brand} />
        </FormField>

        <FormField label={t("adminPanel.vehicles.model")}>
          <FieldValue value={vehicle.model} />
        </FormField>

        <FormField label={t("adminPanel.vehicles.manufacturedYear")}>
          <FieldValue value={vehicle.manufactured_year} />
        </FormField>

        {/* Technical */}

        <FormField label={t("adminPanel.vehicles.engineNumber")}>
          <FieldValue value={vehicle.engine_number} />
        </FormField>

        <FormField label={t("adminPanel.vehicles.chassisNumber")}>
          <FieldValue value={vehicle.chassis_number} />
        </FormField>

        {/* Insurance */}

        <FormField label={t("adminPanel.vehicles.insuranceNumber")}>
          <FieldValue value={vehicle.insurance_number} />
        </FormField>

        <FormField label={t("adminPanel.vehicles.insuranceExpiry")}>
          <FieldValue value={vehicle.insurance_expiry_date} />
        </FormField>

        {/* Ownership */}

        {/* Uncomment if your Vehicle type includes institution */}
        {/*
        <FormField label={t("adminPanel.users.institution")}>
          <FieldValue value={vehicle.institution?.name} />
        </FormField>
        */}

        <FormField label={t("adminPanel.vehicles.registeredOwner")}>
          <FieldValue value={vehicle.registered_owner} />
        </FormField>

        <FormField label={t("adminPanel.vehicles.vehicleValue")}>
          <FieldValue
            value={
              vehicle.value
                ? `Rs. ${Number(vehicle.value).toLocaleString()}`
                : "-"
            }
          />
        </FormField>

        {/* Fuel */}

        <FormField label={t("adminPanel.vehicles.fuelType")}>
          <FieldValue value={vehicle.fuel_type} />
        </FormField>

        {/* Status */}

        <FormField label={t("adminPanel.vehicles.status")}>
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
        >
          {t("common.close")}
        </button>
      </div>
    </div>
  );
}