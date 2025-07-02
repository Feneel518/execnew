import { fetchCategoryForSelect } from "@/lib/queries";
import { useQuery } from "@tanstack/react-query";

export function useGetCategoriesForSelect() {
  return useQuery({
    queryFn: async () => fetchCategoryForSelect(),
    queryKey: ["categoryForSelect"],
  });
}
