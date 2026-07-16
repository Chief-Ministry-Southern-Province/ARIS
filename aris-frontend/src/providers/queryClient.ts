import { QueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

const shouldRetry = (failureCount: number, error: unknown) => {
  const status = (error as AxiosError)?.response?.status;
  return !status || status >= 500 ? failureCount < 2 : false;
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 5 * 60_000,
      retry: shouldRetry,
      refetchOnWindowFocus: false,
    },
    mutations: { retry: false },
  },
});
