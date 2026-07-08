import type{User,createUserRequest,updateUserRequest} from '../types/User.type';
import {getAllUsers,createUser,updateUser,deleteUser,getUserById,getAvailableDrivers} from '../services/user.service';
import { useState } from 'react';

export const useGetAllUsers = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchAllUsers = async (page: number = 1,search: string = "") => {
    try {
      setLoading(true);
      setError("");

      const response = await getAllUsers(page,search);

      setUsers(response.data);
      setCurrentPage(response.current_page);
      setLastPage(response.last_page);
      setTotal(response.total);

      return response;
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to fetch users";

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchAllUsers,
    users,
    currentPage,
    lastPage,
    total,
    loading,
    error,
  };
};

export const useCreateUser = () => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const createUserData = async (userData:createUserRequest) => {
    try {
      setLoading(true);
      setError("");

      const response = await createUser(userData);
      return response;
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to create user";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createUserData,
    loading,
    error,
  };
};

export const useUpdateUser = () => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateUserData = async (userId:number,userData:updateUserRequest) => {
    try {
      setLoading(true);
      setError("");

      const response = await updateUser(userId,userData);
      return response;
    }
    catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to update user";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateUserData,
    loading,
    error,
  };
};

export const useDeleteUser = () => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const deleteUserData = async (userId:number) => {
    try {
      setLoading(true);
      setError("");

      await deleteUser(userId);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to delete user";

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteUserData,
    loading,
    error,
  };
};

export const useGetUserById = () => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState<User | null>(null);

  const fetchUserById = async (userId:number) => {
    try {
      setLoading(true);
      setError("");

      const response = await getUserById(userId);
      setUser(response);
      return response;
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to fetch user";

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchUserById,
    user,
    loading,
    error,
  };
};

export const useGetAvailableDrivers = () => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [drivers, setDrivers] = useState<User[]>([]);

  const fetchAvailableDrivers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAvailableDrivers();
      setDrivers(response);
      return response;
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to fetch available drivers";

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchAvailableDrivers,
    drivers,
    loading,
    error,
  };
};