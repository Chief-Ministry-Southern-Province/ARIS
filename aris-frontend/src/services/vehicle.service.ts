import api from "./api";
import type {PaginatedResponse} from "@/types/Pagination.type";

import type {VehicleResponse,CreateVehicleRequest,UpdateVehicleRequest,VehicleDriverHistory} from "@/types/vehicle.type";

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

export const activateVehicleDriver = async (
    id: number,
    driverId: number | null
) => {
    const response = await api.post(
        `/vehicles/${id}/activate-driver`,
        { driver_id: driverId }
    );

    return response.data;
};

export const syncVehicleDrivers = async (
    id: number,
    driverIds: number[],
    activeDriverId?: number | null
) => {
    const response = await api.post(
        `/vehicles/${id}/drivers`,
        { driver_ids: driverIds, active_driver_id: activeDriverId }
    );

    return response.data;
};

export const getVehicleDriverHistory = async (
    id: number
): Promise<VehicleDriverHistory[]> => {
    const response = await api.get<VehicleDriverHistory[]>(
        `/vehicles/${id}/driver-history`
    );

    return response.data;
};


