import type{User,createUserRequest,updateUserRequest} from '../types/User.type';
import {getAllUsers,createUser,updateUser,deleteUser,getUserById} from '../services/user.service';
import { useState } from 'react';

export const useGetAllUsers = () => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [users, setUsers] = useState<User[]>([]);

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAllUsers();
      setUsers(response);
      console.log(response);
      return response;
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to fetch users";

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchAllUsers,
    users,
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