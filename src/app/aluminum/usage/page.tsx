import SelectUserForUsage from "@/components/aluminum/SelectUserForUsage";
import UsageTable from "@/components/aluminum/UsageTable";
import { getMonthlyUsage } from "@/lib/aluminumQueries";
import { FC } from "react";

interface pageProps {
  searchParams: {
    user: string | undefined;
    month: string | undefined;
    year: string | undefined;
  };
}

const page: FC<pageProps> = async ({ searchParams }) => {
  return (
    <div>
      <SelectUserForUsage></SelectUserForUsage>
      {searchParams.user && (
        <UsageTable
          userId={searchParams.user}
          month={searchParams.month}
          year={searchParams.year}
        ></UsageTable>
      )}
    </div>
  );
};

export default page;
