import { fetchCastingForSelect } from "@/lib/aluminumQueries";
import { useQuery } from "@tanstack/react-query";

export function useGetCastingsForSelect(enable?: boolean) {
  return useQuery({
    queryFn: async () => fetchCastingForSelect(),
    queryKey: ["CastingForSelect"],
    enabled: enable,
  });
}
