import { fetchPreviousStoreProductId } from "@/lib/queries";
import { useQuery } from "@tanstack/react-query";

export function useGetStoreProductNumber() {
  return useQuery({
    queryFn: async () => fetchPreviousStoreProductId(),
    queryKey: ["storeProductId"],
  });
}
