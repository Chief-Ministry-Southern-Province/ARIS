import api from "./api";

import type {Vehicle,CreateVehicleRequest,UpdateVehicleRequest,} from "@/types/vehicle.type";

export const getVehicles = async () => {

    const response = await api.get<Vehicle[]>("/vehicles");

    return response.data;
};

export const getVehicle = async (id: number) => {

    const response = await api.get<Vehicle>(
        `/vehicles/${id}`
    );

    return response.data;
};

export const createVehicle = async (
    data: CreateVehicleRequest
) => {

    const response = await api.post(
        "/vehicles",
        data
    );

    return response.data;
};

export const updateVehicle = async (
    id: number,
    data: UpdateVehicleRequest
) => {

    const response = await api.put(
        `/vehicles/${id}`,
        data
    );

    return response.data;
};

export const deleteVehicle = async (
    id: number
) => {

    const response = await api.delete(
        `/vehicles/${id}`
    );

    return response.data;
};