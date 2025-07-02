import { getSuppliers } from "@/lib/aluminumQueries";
import { useQuery } from "@tanstack/react-query";

export function useGetSuppliersForSelect() {
  return useQuery({
    queryFn: async () => getSuppliers(),
    queryKey: ["Suppliers"],
  });
}
