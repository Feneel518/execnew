import {
  fetchPreviousChallanNumber,
  fetchPreviousOrderNumber,
} from "@/lib/queries";
import { useQuery } from "@tanstack/react-query";

export function useGetChallanNumber() {
  return useQuery({
    queryFn: async () => fetchPreviousChallanNumber(),
    queryKey: ["challanNumber"],
  });
}
