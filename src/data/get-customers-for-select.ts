import { fetchCustomersForSelect } from "@/lib/queries";
import { useQuery } from "@tanstack/react-query";

export function useGetCustomersForSelect() {
  return useQuery({
    queryFn: async () => fetchCustomersForSelect(),
    queryKey: ["customersForSelect"],
  });
}
