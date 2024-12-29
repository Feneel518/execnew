import { getMonthlyUsage } from "@/lib/aluminumQueries";
import { FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import ProductsTable from "../Dashboard/Products/ProductsTable";
import { format } from "date-fns";
import { object } from "zod";

interface UsageTableProps {
  userId: string;
}

const UsageTable: FC<UsageTableProps> = async ({ userId }) => {
  const usage = await getMonthlyUsage(userId);

  if (!usage || usage.error || !usage?.success || usage.success.length === 0) {
    return (
      <div className="p-8 text-center text-3xl">
        No Data found, select another user
      </div>
    );
  }

  const totals: Record<string, number> = usage.success.reduce((acc, item) => {
    // @ts-ignore
    if (!acc[item.status]) {
      // @ts-ignore
      acc[item.status] = 0;
    }
    // @ts-ignore
    acc[item.status] += item.weight;
    return acc;
  }, {});

  return (
    <Card className="mt-10">
      <CardHeader>
        <CardTitle className="px-8">
          <div className="flex items-center justify-between">
            <h1> {usage?.success[0]?.user?.name} usage this month</h1>
            <div className="flex items-center gap-8">
              {Object.entries(totals).map(([Status, a]) => {
                return (
                  <div className="" key={Status}>
                    {Status} - {a}kgs
                  </div>
                );
              })}
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={" lg:px-8 flex flex-col "}>
          <div className="border rounded-md ">
            <div className="grid grid-cols-4 p-4">
              <div className="px-4 text-left align-middle font-medium text-muted-foreground flex-1">
                Date
              </div>
              <div className="px-4 text-left align-middle font-medium text-muted-foreground flex-1">
                Status
              </div>
              <div className="px-4 text-left align-middle font-medium text-muted-foreground flex-1">
                Aluminum Type
              </div>
              <div className="px-4 text-left align-middle font-medium text-muted-foreground flex-1">
                Weight
              </div>
            </div>
          </div>
          <div className="border border-t-0">
            {usage.success.map((user) => {
              return (
                <div
                  key={user.id}
                  className="border-b transition-colors hover:bg-muted/50 "
                >
                  <div className="px-4 text-left align-middle font-medium flex items-center     ">
                    <div className="p-4 align-middle text-sm font-normal flex-1">
                      {format(user.createdAt, "PP")}
                    </div>
                    <div className="p-4 align-middle text-sm font-normal flex-1">
                      {user.status}
                    </div>
                    <div className="p-4 align-middle text-sm font-normal flex-1">
                      {user.status === "OUT" ? (
                        user.aluminumType
                      ) : (
                        <div className="">
                          {user.CastingForTransaction.map((cast) => {
                            return <div className="">{cast.casting.name}</div>;
                          })}
                        </div>
                      )}
                    </div>

                    <div className="p-4 align-middle text-sm font-normal flex-1">
                      {user.weight}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
    // <div>

    //   {usage?.success?.map((user) => {
    //     return (
    //       <div className="">
    //         {user.user?.name} {user.status} {user.aluminumType} {user.weight}
    //       </div>
    //     );
    //   })}
    // </div>
  );
};

export default UsageTable;
