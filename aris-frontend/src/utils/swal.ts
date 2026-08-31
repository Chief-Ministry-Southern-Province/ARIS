import Swal from "sweetalert2";
import { getUserFriendlyErrorMessage } from "@/utils/errorMessage";

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
  return getUserFriendlyErrorMessage(error, fallback);
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
