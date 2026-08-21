import Swal from "sweetalert2";
import type { AxiosError } from "axios";

const themedPopup = {
  background: "var(--card)",
  color: "var(--foreground)",
  customClass: {
    popup: "aris-swal-popup",
    title: "aris-swal-title",
    htmlContainer: "aris-swal-text",
  },
};

export const getErrorMessage = (
  error: unknown,
  fallback = "An unexpected error occurred"
): string => {
  if (!error) return fallback;

  if (typeof error === "object" && error !== null && "isAxiosError" in error) {
    const axiosError = error as AxiosError<{
      message?: string;
      error?: string;
    }>;
    const responseMessage =
      axiosError.response?.data?.message || axiosError.response?.data?.error;

    if (responseMessage) return responseMessage;

    if (axiosError.response?.status) {
      const status = axiosError.response.status;
      switch (status) {
        case 400:
          return "Invalid request. Please check your input and try again.";
        case 401:
          return "Authentication required. Please log in again.";
        case 403:
          return "You don't have permission to perform this action.";
        case 404:
          return "The requested resource was not found.";
        case 409:
          return "This operation conflicts with existing data.";
        case 422:
          return "The data provided is invalid.";
        case 500:
          return "Server error. Please try again later.";
        case 503:
          return "Service temporarily unavailable. Please try again later.";
        default:
          return `Request failed with status ${status}.`;
      }
    }

    if (axiosError.code === "ERR_NETWORK") {
      return "Network error. Please check your internet connection.";
    }

    if (axiosError.code === "ECONNABORTED") {
      return "Request timeout. Please try again.";
    }

    if (axiosError.message) return axiosError.message;
  }
  if (error instanceof Error) {
    return error.message || fallback;
  }

  if (typeof error === "string") {
    return error;
  }

  return fallback;
};

export const swalSuccess = (title: string, text?: string) =>
  Swal.fire({
    ...themedPopup,
    icon: "success",
    title,
    text,
    confirmButtonColor: "#16a34a",
  });

export const swalError = (title: string, text?: string) =>
  Swal.fire({
    ...themedPopup,
    icon: "error",
    title,
    text,
    confirmButtonColor: "#dc2626",
  });

export const swalConfirm = (title: string, text: string): Promise<boolean> =>
  Swal.fire({
    ...themedPopup,
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#2563eb",
    cancelButtonColor: "#6b7280",
  }).then((res) => res.isConfirmed);

export const swalLoading = (title = "Processing...") =>
  Swal.fire({
    ...themedPopup,
    title,
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
