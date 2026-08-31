import axios, { type AxiosError } from "axios";

type ApiErrorPayload = {
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
};

const messagesByStatus: Record<number, string> = {
  400: "We could not process that request. Please check your details and try again.",
  401: "Your session has ended. Please log in again.",
  403: "You do not have permission to perform this action.",
  404: "The requested item could not be found.",
  409: "This action conflicts with existing information. Please refresh and try again.",
  419: "Your session has expired. Please refresh the page and try again.",
  422: "Please correct the highlighted fields and try again.",
  429: "Too many requests were made. Please wait a moment and try again.",
  500: "Something went wrong on our side. Please try again later.",
  502: "The service is temporarily unavailable. Please try again shortly.",
  503: "The service is temporarily unavailable. Please try again shortly.",
  504: "The request took too long. Please try again.",
};

export const getUserFriendlyErrorMessage = (
  error: unknown,
  fallback = "Something went wrong. Please try again."
): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorPayload>;
    const status = axiosError.response?.status;

    if (status && messagesByStatus[status]) return messagesByStatus[status];
    if (axiosError.code === "ERR_NETWORK") {
      return "We could not connect to the server. Please check your connection and try again.";
    }
    if (axiosError.code === "ECONNABORTED") return "The request took too long. Please try again.";
  }

  return fallback;
};

/** Keeps existing callers of response.data.message safe without changing their API contracts. */
export const normalizeApiError = (error: unknown): unknown => {
  if (!axios.isAxiosError(error) || !error.response) return error;

  const payload = error.response.data;
  if (payload && typeof payload === "object" && !Array.isArray(payload)) {
    (payload as ApiErrorPayload).message = getUserFriendlyErrorMessage(error);
    delete (payload as ApiErrorPayload).error;
  }

  return error;
};
