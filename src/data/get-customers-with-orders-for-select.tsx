import { fetchCustomersWithPenndingOrderForSelect } from "@/lib/queries";
import { useQuery } from "@tanstack/react-query";

export function useGetCustomersWithPendingOrdersForSelect() {
  return useQuery({
    queryFn: async () => fetchCustomersWithPenndingOrderForSelect(),
    queryKey: ["customersWithPendingOrderForSelect"],
  });
}
