import { useEffect, useState } from "react";

import VehicleForm from "./VehicleForm";

import { useVehicle } from "@/hooks/queries/useVehicleQueries";
import { useUpdateVehicleMutation } from "@/hooks/mutations/useResourceMutations";

import { useVisibleInstitutions } from "@/hooks/queries/useInstitutionQueries";
import { initialValues } from "@/constants/vehicle";
import { useAvailableDrivers } from "@/hooks/queries/useUserQueries";

import type {CreateVehicleRequest} from "@/types/vehicle.type";

import {toast} from "react-toastify";

type EditVehicleFormProps = {
  vehicleId: number;
  onSuccess?: () => void;
};


export default function EditVehicleForm({vehicleId,onSuccess}: EditVehicleFormProps) {

  const [values, setValues] = useState<CreateVehicleRequest>(initialValues);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: vehicle, isLoading: loadingVehicle } = useVehicle(vehicleId);
  const { mutateAsync: updateVehicleData, isPending: loading } = useUpdateVehicleMutation();
  const { data: institutions = [], isLoading: loadingInstitutions } = useVisibleInstitutions();
  const { data: drivers = [], isLoading: loadingDrivers } = useAvailableDrivers();

  useEffect(() => {

  }, []);

  useEffect(() => {

    if (!vehicle) return;
 
    setValues({

      vehicle_number: vehicle.vehicle_number,

      registered_date:
        vehicle.registered_date ?? "",

      vehicle_type: vehicle.vehicle_type,

      brand: vehicle.brand,

      model: vehicle.model,

      manufactured_year:
        vehicle.manufactured_year,

      engine_number:
        vehicle.engine_number,

      chassis_number:
        vehicle.chassis_number,

      insurance_number:
        vehicle.insurance_number,

      insurance_expiry_date:
        vehicle.insurance_expiry_date,

      registered_owner:
        vehicle.registered_owner,

      value: vehicle.value ?? 0,

      fuel_type: vehicle.fuel_type,

      status: vehicle.status,

      institution_id:
        vehicle.institution_id,

      driver_id: vehicle.driver_id ?? undefined,
    });

  }, [vehicle]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {

    const { name, value } = e.target;

    setValues((prev) => ({
      ...prev,

      [name]:
        name === "institution_id" ||
        name === "value" ||
        name === "manufactured_year" ||
        name === "driver_id"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    try {

      setErrors({});

      await updateVehicleData({ id: vehicleId, data: values });

      toast.success("Vehicle updated successfully.");

      onSuccess?.();

    } catch (error: unknown) {

      if (error instanceof Object && "response" in error && (error as { response?: { status?: number; data?: { message?: string; errors?: Record<string, string[]> } } }).response?.status === 422) {

        const validationErrorResponse = error as {
          response?: { status?: number; data?: { message?: string; errors?: Record<string, string[]> } };
        };

        const errorsObj = validationErrorResponse.response?.data?.errors ?? {};

        const formattedErrors: Record<string, string> = {};

        Object.keys(errorsObj).forEach((key) => {
          const messages = errorsObj[key];
          if (Array.isArray(messages) && messages.length > 0) {
            formattedErrors[key] = messages[0];
          }
        });

        setErrors(formattedErrors);

        return;
      }

      const errAny =  error as { response?: { status?: number; data?: { message?: string; errors?: Record<string, string[]> } } };

      toast.error(
        errAny?.response?.data?.message ??
        "Something went wrong."
      );

    }

  };

  if (loadingVehicle) {

    return (
      <div className="flex justify-center p-10">
        Loading vehicle...
      </div>
    );

  }

  return (

    <form onSubmit={handleSubmit}>

      <VehicleForm
        values={values}
        institutions={institutions}
        institutionsLoading={loadingInstitutions}
        drivers={drivers}
        driversLoading={loadingDrivers}
        errors={errors}
        onChange={handleChange}
      />

      <div className="flex justify-end gap-3 mt-8">

        <button
          type="button"
          className="rounded-lg border border-gray-300 px-5 py-2"
          onClick={() => window.history.back()}
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-700 px-5 py-2 text-white hover:bg-blue-800 disabled:opacity-50"
        >
          {loading
            ? "Updating..."
            : "Update Vehicle"}
        </button>

      </div>

    </form>

  );

}
