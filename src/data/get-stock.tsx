// import { getAluminumStock } from "@/lib/aluminumQueries";
import { useQuery } from "@tanstack/react-query";

export function useGetStock() {
  return useQuery({
    // queryFn: async () => getAluminumStock(),
    queryKey: ["AluminumStock"],
  });
}
