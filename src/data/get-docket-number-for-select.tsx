import { fetchDocketForSelect } from "@/lib/queries";
import { useQuery } from "@tanstack/react-query";

export function useGetDocketNumberForSelect(id?: string, enable?: boolean) {
  return useQuery({
    queryFn: async () => fetchDocketForSelect(id),
    queryKey: ["docketForSelect"],
    enabled: enable,
  });
}
