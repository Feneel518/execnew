import SelectUserForUsage from "@/components/aluminum/SelectUserForUsage";
import UsageTable from "@/components/aluminum/UsageTable";
import { getMonthlyUsage } from "@/lib/aluminumQueries";
import { FC } from "react";

interface pageProps {
  searchParams: { user: string | undefined };
}

const page: FC<pageProps> = async ({ searchParams }) => {
  return (
    <div>
      <SelectUserForUsage></SelectUserForUsage>
      {searchParams.user && (
        <UsageTable userId={searchParams.user}></UsageTable>
      )}
    </div>
  );
};

export default page;
