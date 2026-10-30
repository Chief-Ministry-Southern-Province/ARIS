import { InputField } from "@/components/atoms/InputField";
import { SelectField } from "@/components/atoms/SelectField";
import { FormField } from "@/components/molecules/FormField";

import type { CreateVehicleRequest } from "@/types/vehicle.type";
import type { Institution } from "@/types/Institution.type";

import {VEHICLE_TYPES, FUEL_TYPES,VEHICLE_STATUS,} from "@/constants/vehicle";
import type { User } from "@/types/User.type";

type VehicleFormProps = {
  values: CreateVehicleRequest;
  institutions: Institution[];
  institutionsLoading: boolean;
  drivers: User[];
  driversLoading: boolean;
  errors?: Record<string, string>;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onDriverPoolToggle?: (driverId: number) => void;
  onActiveDriverChange?: (driverId: number | null) => void;
};

export default function VehicleForm({
  values,
  institutions,
  institutionsLoading,
  drivers,
  driversLoading,
  errors = {},
  onChange,
  onDriverPoolToggle,
  onActiveDriverChange,
}: VehicleFormProps) {

  return (
    <div className="space-y-8">
      {/* Vehicle Registration */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-6 text-lg font-semibold">Vehicle Registration</h2>

        <div className="grid gap-4 p-2 md:grid-cols-2">
          <FormField
            label="Registration Number"
            required
            error={errors.vehicle_number}
          >
            <InputField
              name="vehicle_number"
              value={values.vehicle_number}
              onChange={onChange}
              placeholder="WP-CAB-1234"
            />
          </FormField>

          <FormField label="Registered Date" error={errors.registered_date}>
            <InputField
              type="date"
              name="registered_date"
              value={values.registered_date ?? ""}
              onChange={onChange}
            />
          </FormField>

          <FormField
            label="Vehicle Type"
            required
            error={errors.vehicle_type}
          >
            <SelectField
              name="vehicle_type"
              value={values.vehicle_type}
              onChange={onChange}
              options={VEHICLE_TYPES}
            />
          </FormField>

          <FormField
            label="Institution"
            required
            error={errors.institution_id}
          >
            <SelectField
              name="institution_id"
              value={values.institution_id?.toString() ?? ""}
              onChange={onChange}
              options={
                institutionsLoading
                  ? [{ value: "", label: "Loading institutions..." }]
                  : institutions.map((institution) => ({
                      value: institution.id.toString(),
                      label: institution.name,
                    }))
              }
              disabled={institutionsLoading}
            />
          </FormField>
        </div>
      </div>

      {/* Vehicle Details */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-6 text-lg font-semibold">Vehicle Details</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Brand" required error={errors.brand}>
            <InputField
              name="brand"
              value={values.brand}
              onChange={onChange}
              placeholder="Toyota"
            />
          </FormField>

          <FormField label="Model" required error={errors.model}>
            <InputField
              name="model"
              value={values.model}
              onChange={onChange}
              placeholder="Corolla"
            />
          </FormField>

          <FormField
            label="Manufactured Year"
            required
            error={errors.manufactured_year}
          >
            <InputField
              type="number"
              name="manufactured_year"
              value={values.manufactured_year}
              onChange={onChange}
              placeholder="2023"
            />
          </FormField>

          <FormField label="Fuel Type" required error={errors.fuel_type}>
            <SelectField
              name="fuel_type"
              value={values.fuel_type}
              onChange={onChange}
              options={FUEL_TYPES}
            />
          </FormField>
        </div>
      </div>

      {/* Technical Information */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-6 text-lg font-semibold">Technical Information</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            label="Engine Number"
            required
            error={errors.engine_number}
          >
            <InputField
              name="engine_number"
              value={values.engine_number}
              onChange={onChange}
              placeholder="ENG123456"
            />
          </FormField>

          <FormField
            label="Chassis Number"
            required
            error={errors.chassis_number}
          >
            <InputField
              name="chassis_number"
              value={values.chassis_number}
              onChange={onChange}
              placeholder="CHS123456"
            />
          </FormField>
        </div>
      </div>

      {/* Insurance Information */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-6 text-lg font-semibold">Insurance Information</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            label="Insurance Number"
            required
            error={errors.insurance_number}
          >
            <InputField
              name="insurance_number"
              value={values.insurance_number}
              onChange={onChange}
              placeholder="INS123456"
            />
          </FormField>

          <FormField
            label="Insurance Expiry Date"
            required
            error={errors.insurance_expiry_date}
          >
            <InputField
              type="date"
              name="insurance_expiry_date"
              value={values.insurance_expiry_date}
              onChange={onChange}
            />
          </FormField>
        </div>
      </div>

      {/* Ownership Information */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-6 text-lg font-semibold">Ownership Information</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            label="Registered Owner"
            required
            error={errors.registered_owner}
          >
            <InputField
              name="registered_owner"
              value={values.registered_owner}
              onChange={onChange}
              placeholder="Provincial Department of Health"
            />
          </FormField>

          <FormField label="Vehicle Value (Rs.)" error={errors.value}>
            <InputField
              type="number"
              min="1"
              step="0.01"
              name="value"
              value={values.value ?? ""}
              onChange={onChange}
              placeholder="5000000"
            />
          </FormField>
        </div>
      </div>

      {/* Vehicle Status */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-6 text-lg font-semibold">Vehicle Status</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Status" required error={errors.status}>
            <SelectField
              name="status"
              value={values.status}
              onChange={onChange}
              options={VEHICLE_STATUS}
            />
          </FormField>
        </div>
      </div>

      {/* Driver Assignment */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Driver Assignment</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Assign multiple drivers to this vehicle's pool and designate one as the currently active driver.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Active Driver" error={errors.driver_id || errors.active_driver_id}>
            <SelectField
              name="driver_id"
              value={values.driver_id?.toString() ?? ""}
              onChange={(e) => {
                const val = e.target.value ? Number(e.target.value) : null;
                if (onActiveDriverChange) {
                  onActiveDriverChange(val);
                } else {
                  onChange(e);
                }
              }}
              options={[
                { value: "", label: "No Active Driver (Unassigned)" },
                ...drivers.map((driver) => ({
                  value: driver.id.toString(),
                  label: `${driver.name} ${driver.mobile ? `(${driver.mobile})` : ""}`,
                })),
              ]}
              disabled={driversLoading}
            />
          </FormField>
        </div>

        {/* Multiple Driver Pool Selection */}
        <div className="pt-3 border-t border-gray-100">
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
            Driver Pool (Select all drivers authorized for this vehicle)
          </label>

          {driversLoading ? (
            <p className="text-xs text-gray-400">Loading drivers...</p>
          ) : drivers.length === 0 ? (
            <p className="text-xs text-gray-400 italic">No drivers found in this institution.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto p-2 border border-gray-100 rounded-lg bg-gray-50/50">
              {drivers.map((driver) => {
                const isSelected =
                  values.driver_ids?.includes(driver.id) || values.driver_id === driver.id;
                const isActive = values.driver_id === driver.id;

                return (
                  <label
                    key={driver.id}
                    className={`flex items-center gap-2.5 p-2 rounded-lg border text-xs cursor-pointer transition ${
                      isActive
                        ? "bg-green-50 border-green-300 font-semibold text-green-900"
                        : isSelected
                        ? "bg-blue-50 border-blue-200 text-blue-900"
                        : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected || false}
                      onChange={() => {
                        if (onDriverPoolToggle) {
                          onDriverPoolToggle(driver.id);
                        }
                      }}
                      className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-medium">{driver.name}</div>
                      {driver.mobile && <div className="text-[10px] text-gray-400">{driver.mobile}</div>}
                    </div>
                    {isActive && (
                      <span className="shrink-0 px-1.5 py-0.2 rounded text-[9px] font-bold bg-green-200 text-green-800">
                        Active
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}