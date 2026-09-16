import { getQueryFn } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";

export function useSessionUser() {
  const { data } = useQuery({
    queryKey: ["/api/quant/auth/me"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    retry: false,
  });
  return data && !(data as { error?: unknown }).error ? data : null;
}
