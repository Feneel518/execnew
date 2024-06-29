import { fetchPONumberBasedOnCustomer } from "@/lib/queries";
import { useQuery } from "@tanstack/react-query";

export function useGetPoNumberWithPendingOrdersForSelect(id: string) {
  return useQuery({
    queryFn: async () => fetchPONumberBasedOnCustomer(id),
    queryKey: ["fetchPONumberBasedOnCustomer"],
  });
}
