import { FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { getAluminumStock } from "@/lib/queries";

interface AluminumStockProps {}

const AluminumStock: FC<AluminumStockProps> = async ({}) => {
  const aluminum = await getAluminumStock();

  console.log(aluminum);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aluminum Stock</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="">
          {aluminum?.success?.map((alum) => {
            return (
              <div className="">
                {alum.aluminumType} | {alum.status} | {alum.weight}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default AluminumStock;
