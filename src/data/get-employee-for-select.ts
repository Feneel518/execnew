import { fetchEmployeeForSelect } from "@/lib/queries";
import { useQuery } from "@tanstack/react-query";

export function useGetEmployeeForSelect() {
  return useQuery({
    queryFn: async () => fetchEmployeeForSelect(),
    queryKey: ["employeeForSelect"],
  });
}
