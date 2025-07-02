import { fetchStoreProductsForSelect } from "@/lib/queries";
import { useQuery } from "@tanstack/react-query";

export function useGetStoreProductsForSelect() {
  return useQuery({
    queryFn: async () => fetchStoreProductsForSelect(),
    queryKey: ["storeProductsForSelect"],
  });
}
