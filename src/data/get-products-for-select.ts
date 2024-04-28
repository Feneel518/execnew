import { fetchProductsForSelect } from "@/lib/queries";
import { useQuery } from "@tanstack/react-query";

export function useGetProductsForSelect() {
  return useQuery({
    queryFn: async () => fetchProductsForSelect(),
    queryKey: ["productsForSelect"],
  });
}
