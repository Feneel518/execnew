import { fetchPendingProductsQuantity } from "@/lib/queries";
import { useQuery } from "@tanstack/react-query";

export function useGetPendingProductQuantity(id: string) {
  return useQuery({
    queryFn: async () => fetchPendingProductsQuantity(id),
    queryKey: ["productsForSelect"],
  });
}
