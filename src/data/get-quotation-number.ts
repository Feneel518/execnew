import { fetchPreviousQuotationNumber } from "@/lib/queries";
import { useQuery } from "@tanstack/react-query";

export function useGetQuotationNumber() {
  return useQuery({
    queryFn: async () => fetchPreviousQuotationNumber(),
    queryKey: ["quotationNumber"],
  });
}
