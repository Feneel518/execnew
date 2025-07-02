import { fetchDocketForSelect } from "@/lib/aluminumQueries";
import { useQuery } from "@tanstack/react-query";

export function useGetDocketNumberForSelect(id?: string, enable?: boolean) {
  return useQuery({
    queryFn: async () => fetchDocketForSelect(id),
    queryKey: ["docketForSelect", id],

    enabled: enable,
  });
}
