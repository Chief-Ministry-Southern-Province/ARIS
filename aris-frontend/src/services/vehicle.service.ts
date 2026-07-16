import api from "./api";
import type {PaginatedResponse} from "@/types/Pagination.type";

import type {VehicleResponse,CreateVehicleRequest,UpdateVehicleRequest,} from "@/types/vehicle.type";

export const getVehicles = async (page: number = 1,search: string = "") : Promise<PaginatedResponse<VehicleResponse>> => {

    const response = await api.get("/vehicles", {
        params: {
            page,
            search
        }
    });

    return response.data;
};

export const getVehicle = async (id: number) => {

  const response = await api.get<VehicleResponse>(
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
