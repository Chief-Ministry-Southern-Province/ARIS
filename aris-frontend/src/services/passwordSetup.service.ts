import api from "./api";

export const validatePasswordSetupToken = async (token: string): Promise<void> => {
  await api.post("/auth/password/setup/validate", { token });
};

export const completePasswordSetup = async (token: string, password: string, passwordConfirmation: string): Promise<{ message: string }> => {
  const response = await api.post("/auth/password/setup", {
    token,
    password,
    password_confirmation: passwordConfirmation,
  });

  return response.data;
};
