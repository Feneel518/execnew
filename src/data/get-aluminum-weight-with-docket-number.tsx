import { useQuery } from "@tanstack/react-query";

export function useGetAluminumWeightBasedOnDocket(
  docketNumber: string,
  supplierId?: string
) {
  return useQuery({
    // queryFn: async () => getSupplierAluminumStock(docketNumber, supplierId),
    queryKey: ["AluminumWeightOnSupplier"],
  });
}
