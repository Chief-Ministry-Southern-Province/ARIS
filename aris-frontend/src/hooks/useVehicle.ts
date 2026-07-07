import { useState } from "react";
import type {CreateVehicleRequest, UpdateVehicleRequest, VehicleResponse } from "@/types/vehicle.type";
import { getVehicles, getVehicle, createVehicle, updateVehicle, deleteVehicle } from "@/services/vehicle.service";

export const useGetVehicles = () => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [vehicles, setVehicles] = useState<VehicleResponse[]>([]);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getVehicles();
      setVehicles(response);
      return response;
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to fetch vehicles";

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchVehicles,
    vehicles,
    loading,
    error,
  };
};

export const useGetVehicle = () => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [vehicle, setVehicle] = useState<VehicleResponse | null>(null);

  const fetchVehicle = async (id: number) => {
    try {
      setLoading(true);
      setError("");

      const response = await getVehicle(id);
      setVehicle(response);
      return response;
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to fetch vehicle";

      setError(message);
      throw err;
    } 
    finally {
      setLoading(false);
    }
  };

  return {
    fetchVehicle,
    vehicle,
    loading,
    error,
  };
};

export const useCreateVehicle = () => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const createVehicleData = async (vehicle: CreateVehicleRequest) => {
    try {
      setLoading(true);
      setError("");

      const response = await createVehicle(vehicle);
      return response;
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to create vehicle";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createVehicleData,
    loading,
    error,
  };
};

export const useUpdateVehicle = () => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateVehicleData = async (id: number, vehicle: UpdateVehicleRequest) => {
    try {
      setLoading(true);
      setError("");

      const response = await updateVehicle(id, vehicle);
      return response;
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to update vehicle";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateVehicleData,
    loading,
    error,
  };
};

export const useDeleteVehicle = () => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const deleteVehicleData = async (id: number) => {
    try {
      setLoading(true);
      setError("");

      const response = await deleteVehicle(id);
      return response;
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to delete vehicle";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteVehicleData,
    loading,
    error,
  };
};