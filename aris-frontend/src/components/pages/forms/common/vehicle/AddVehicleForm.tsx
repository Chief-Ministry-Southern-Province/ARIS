import { useState } from "react";
import VehicleForm from "./VehicleForm";

import { useCreateVehicleMutation } from "@/hooks/mutations/useResourceMutations";
import { useVisibleInstitutions } from "@/hooks/queries/useInstitutionQueries";

import type { CreateVehicleRequest } from "@/types/vehicle.type";
import { toast } from "react-toastify";
import {initialValues} from "@/constants/vehicle";

import { useAvailableDrivers } from "@/hooks/queries/useUserQueries";

export default function AddVehicleForm({onSuccess}: {onSuccess: () => void}) {

  const [values, setValues] = useState<CreateVehicleRequest>(initialValues);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const { mutateAsync: createVehicleData, isPending: loading } = useCreateVehicleMutation();
  const { data: institutions = [], isLoading: loadingInstitutions } = useVisibleInstitutions();
  const { data: drivers = [], isLoading: loadingDrivers } = useAvailableDrivers();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {

    const { name, value } = e.target;

    setValues((prev) => ({
      ...prev,

      [name]:
        name === "institution_id"
          ? Number(value)
          : name === "value"
          ? Number(value)
          : name === "manufactured_year"
          ? Number(value)
          : name === "driver_id"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async ( e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();

    try {

      setErrors({});
      //console.log(values);
      await createVehicleData(values);
      
      toast.success("Vehicle registered successfully.");
      onSuccess();

      setValues(initialValues);

    } catch (error: unknown) {
      const err = error as { response?: { status?: number; data?: { message?: string; errors?: Record<string, string[]> } } };

      if (err?.response?.status === 422) {
        const validationErrors = err.response?.data?.errors as
          | Record<string, string[]>
          | undefined;

        if (!validationErrors) {
          toast.error(
            err?.response?.data?.message || "Failed to register vehicle."
          );
          return;
        }

        const formattedErrors: Record<string, string> = {};

        Object.keys(validationErrors).forEach((key) => {
          formattedErrors[key] = validationErrors[key][0];
        });

        setErrors(formattedErrors);

        return;
      }

      toast.error(
        err?.response?.data?.message ||
          "Failed to register vehicle."
      );
    }
  };

  const handleDriverPoolToggle = (driverId: number) => {
    setValues((prev) => {
      const current = prev.driver_ids ?? (prev.driver_id ? [prev.driver_id] : []);
      const exists = current.includes(driverId);
      const updated = exists ? current.filter((id) => id !== driverId) : [...current, driverId];
      const newActive = prev.driver_id === driverId && exists ? undefined : prev.driver_id;
      return {
        ...prev,
        driver_ids: updated,
        driver_id: newActive,
        active_driver_id: newActive,
      };
    });
  };

  const handleActiveDriverChange = (driverId: number | null) => {
    setValues((prev) => {
      const current = prev.driver_ids ?? [];
      const updatedIds =
        driverId && !current.includes(driverId) ? [...current, driverId] : current;
      return {
        ...prev,
        driver_id: driverId ?? undefined,
        active_driver_id: driverId ?? undefined,
        driver_ids: updatedIds,
      };
    });
  };

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
        onDriverPoolToggle={handleDriverPoolToggle}
        onActiveDriverChange={handleActiveDriverChange}
      />

      <div className="flex justify-end gap-3 mt-8">

        <button
          type="button"
          className="rounded-lg border border-gray-300 px-5 py-2"
          onClick={() => setValues(initialValues)}
        >
          Reset
        </button>

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-700 px-5 py-2 text-white hover:bg-blue-800 disabled:opacity-50"
        >
          {loading
            ? "Registering..."
            : "Register Vehicle"}
        </button>

      </div>

    </form>
  );
}
