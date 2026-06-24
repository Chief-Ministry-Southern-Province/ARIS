import api from "./api";

export const login = async (nic: string, password: string) => {
  const response = await api.post("/login", { 
    nic, 
    password 
  });

  return response.data;
};  

export const getProfile = async () => {
  const response = await api.get("/profile");
  return response.data;
}

export const logout = async () => {
  const response = await api.post("/logout");
  localStorage.removeItem("token");
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

export const verifyOtp = async (nic: string,otp: string) => {
  return api.post("/forgot-password/verify-otp", {
    nic,
    otp,
  });
};

export const resetPassword = async (nic: string,otp: string,password: string) => {
  return api.post("/forgot-password/reset-password", {
    nic,
    otp,
    password,
    password_confirmation: password,
  });
};