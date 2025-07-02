import { fetchCategoryForCatalog } from "@/lib/queries";
import { useQuery } from "@tanstack/react-query";

export function useGetCategoriesForCatalog() {
  return useQuery({
    queryFn: async () => fetchCategoryForCatalog(),
    queryKey: ["categoryForCatalog"],
  });
}
