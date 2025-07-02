import { fetchPreviousPerfomaNumber } from "@/lib/queries";
import { useQuery } from "@tanstack/react-query";

export function useGetPerfomaNumber() {
  return useQuery({
    queryFn: async () => fetchPreviousPerfomaNumber(),
    queryKey: ["quotationNumber"],
  });
}
