import { fetchPreviousOrderNumber } from "@/lib/queries";
import { useQuery } from "@tanstack/react-query";

export function useGetOrderNumber() {
  return useQuery({
    queryFn: async () => fetchPreviousOrderNumber(),
    queryKey: ["orderNumber"],
  });
}
