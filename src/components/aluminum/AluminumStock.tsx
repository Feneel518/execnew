import { FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface AluminumStockProps {}

const AluminumStock: FC<AluminumStockProps> = async ({}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Aluminum Stock</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="">
          {/* {aluminum?.success?.map((alum) => {
            return (
              <div className="">
                {alum.aluminumType} | {alum.status} | {alum.weight}
              </div>
            );
          })} */}
        </div>
      </CardContent>
    </Card>
  );
};

export default AluminumStock;
