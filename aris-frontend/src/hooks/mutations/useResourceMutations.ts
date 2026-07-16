import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAccident, deleteAccident, updateAccident } from "@/services/accident.service";
import { createInstitution, deleteInstitution, updateInstitution } from "@/services/institution.service";
import { createUser, deleteUser, updateUser } from "@/services/user.service";
import { createVehicle, deleteVehicle, updateVehicle } from "@/services/vehicle.service";
import { queryKeys } from "@/hooks/queryKeys";
import type { CreateAccidentRequest, UpdateAccidentRequest } from "@/types/accident.type";
import type { createInstitutionRequest, updateInstitutionRequest } from "@/types/Institution.type";
import type { createUserRequest, updateUserRequest } from "@/types/User.type";
import type { CreateVehicleRequest, UpdateVehicleRequest } from "@/types/vehicle.type";

const invalidate = (queryClient: ReturnType<typeof useQueryClient>, key: readonly unknown[]) =>
  queryClient.invalidateQueries({ queryKey: key });

// ---------- Accidents ----------

export const useCreateAccidentMutation = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: createAccident,
    onSuccess: () => invalidate(client, queryKeys.accidents.all),
  });
};

export const useUpdateAccidentMutation = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateAccidentRequest }) => updateAccident(id, data),
    onSuccess: (data, { id }) => {
      client.setQueryData(queryKeys.accidents.detail(id), data);
      invalidate(client, queryKeys.accidents.all);
    },
  });
};

export const useDeleteAccidentMutation = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: deleteAccident,
    onSuccess: () => invalidate(client, queryKeys.accidents.all),
  });
};

// ---------- Vehicles ----------

export const useCreateVehicleMutation = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: createVehicle,
    onSuccess: () => invalidate(client, queryKeys.vehicles.all),
  });
};

export const useUpdateVehicleMutation = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateVehicleRequest }) => updateVehicle(id, data),
    onSuccess: (data, { id }) => {
      client.setQueryData(queryKeys.vehicles.detail(id), data);
      invalidate(client, queryKeys.vehicles.all);
    },
  });
};

export const useDeleteVehicleMutation = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: deleteVehicle,
    onSuccess: (_, id) => {
      client.removeQueries({ queryKey: queryKeys.vehicles.detail(id) });
      invalidate(client, queryKeys.vehicles.all);
    },
  });
};

// ---------- Users ----------

export const useCreateUserMutation = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: createUser,
    onSuccess: () => invalidate(client, queryKeys.users.all),
  });
};

export const useUpdateUserMutation = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: updateUserRequest }) => updateUser(id, data),
    onSuccess: (data, { id }) => {
      client.setQueryData(queryKeys.users.detail(id), data);
      invalidate(client, queryKeys.users.all);
    },
  });
};

export const useDeleteUserMutation = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: (_, id) => {
      client.removeQueries({ queryKey: queryKeys.users.detail(id) });
      invalidate(client, queryKeys.users.all);
    },
  });
};

// ---------- Institutions ----------

export const useCreateInstitutionMutation = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: createInstitution,
    onSuccess: () => invalidate(client, queryKeys.institutions.all),
  });
};

export const useUpdateInstitutionMutation = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: updateInstitutionRequest }) => updateInstitution(id, data),
    onSuccess: (data, { id }) => {
      client.setQueryData(queryKeys.institutions.detail(id), data);
      invalidate(client, queryKeys.institutions.all);
    },
  });
};

export const useDeleteInstitutionMutation = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: deleteInstitution,
    onSuccess: () => invalidate(client, queryKeys.institutions.all),
  });
};

export type { CreateAccidentRequest, createInstitutionRequest, createUserRequest, CreateVehicleRequest };