import api from "./api";

export const validatePasswordSetupToken = async (token: string): Promise<void> => {
  await api.post("/auth/password/setup/validate", { token });
};

export const verifyPasswordSetupNic = async (token: string, nic: string): Promise<void> => {
  await api.post("/auth/password/setup/verify-nic", { token, nic });
};

export const completePasswordSetup = async (token: string, nic: string, password: string, passwordConfirmation: string): Promise<{ message: string }> => {
  const response = await api.post("/auth/password/setup", {
    token,
    nic,
    password,
    password_confirmation: passwordConfirmation,
  });

  return response.data;
};
