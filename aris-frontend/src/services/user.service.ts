import api from "./api";
import type{User,createUserRequest,updateUserRequest} from '../types/User.type';

export const getAllUsers = async (): Promise<User[]> => {
  const response = await api.get("/users");
  return response.data;
};

export const createUser = async (userData: createUserRequest): Promise<User> => {
  const response = await api.post("/users", userData);
  return response.data;
};

export const updateUser = async (userId: number, userData: updateUserRequest): Promise<User> => {
  const response = await api.put(`/users/${userId}`, userData);
  return response.data;
};

export const deleteUser = async (userId: number): Promise<void> => {
  await api.delete(`/users/${userId}`);
};

export const getUserById = async (userId: number): Promise<User> => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};