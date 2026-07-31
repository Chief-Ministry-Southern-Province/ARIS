import api, { API_ORIGIN } from "./api";
import type{ProfileResponse} from '../types/User.type';

export interface LoginResponse {
  role: string[];
  id: number;
  name?: string;
  institutionType?: string;
}

export const login = async (nic: string, password: string): Promise<LoginResponse> => {
  await api.get("/sanctum/csrf-cookie", { baseURL: API_ORIGIN });
  const response = await api.post("/login", { 
    nic, 
    password 
  });

  return response.data;
};  

export const getProfile = async (): Promise<ProfileResponse> => {
  const response = await api.get("/profile");
  return response.data;
}

export const logout = async () => {
  const response = await api.post("/logout");
  return response.data;
}



export const changePassword = async (current_password: string, new_password: string, new_password_confirmation: string) => {
  const response = await api.post("/change-password", {
    current_password,
    new_password,
    new_password_confirmation
  });

  return response.data;
}

export const sendOtp = async (nic: string) => {
  const response = await api.post("/forgot-password/send-otp", {
    nic
  });

  return response.data;
}

export const verifyOtp = async (mobile: string,otp: string) => {
  return api.post("/forgot-password/verify-otp", {
    mobile,
    otp,
  });
};

export const resetPassword = async (mobile: string,otp: string,password: string,password_confirmation: string) => {
  return api.post("/forgot-password/reset-password", {
    mobile,
    otp,
    new_password: password,
    new_password_confirmation: password_confirmation,
  });
};
