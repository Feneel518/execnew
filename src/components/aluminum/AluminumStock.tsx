import { FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { getAluminumStock } from "@/lib/aluminumQueries";
import ProductsTable from "../Dashboard/Products/ProductsTable";

interface AluminumStockProps {}

const AluminumStock: FC<AluminumStockProps> = async ({}) => {
  const aluminum = await getAluminumStock();
  return (
    <Card className="">
      <div className="flex items-center justify-between">
        <div className="text-3xl px-8 py-4">Aluminum Stock</div>
      </div>
      <div className="">
        <Card>
          <CardContent>
            <ProductsTable
              className="lg:p-0"
              columns={
                <>
                  <div className="grid grid-cols-4 items-center border-b  p-4 ">
                    <h1 className=" px-4 text-left align-middle font-medium text-muted-foreground flex-1">
                      Aluminum
                    </h1>
                    <h1 className=" px-4 text-left align-middle font-medium text-muted-foreground flex-1">
                      IN
                    </h1>
                    <h1 className=" px-4 text-left align-middle font-medium text-muted-foreground flex-1">
                      OUT
                    </h1>
                    <h1 className=" px-4 text-left align-middle font-medium text-muted-foreground flex-1">
                      Stock
                    </h1>
                  </div>
                </>
              }
              body={
                <div className="">
                  {aluminum?.success?.map((alum, index) => {
                    return (
                      <div
                        key={index}
                        className="border-b transition-colors hover:bg-muted/50 "
                      >
                        <div className=" px-4 text-left align-middle font-medium grid grid-cols-4 items-center     ">
                          <div className="p-4 align-middle text-sm font-normal flex-1">
                            {alum.aluminumType}
                          </div>
                          <div className="p-4 align-middle text-sm font-normal flex-1">
                            {alum.in} kg
                          </div>
                          <div className="p-4 align-middle text-sm font-normal flex-1">
                            {alum.out} kg
                          </div>
                          <div className="p-4 align-middle text-sm font-normal flex-1">
                            {alum.stock} kg
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                // <CastingsTableBody castings={castings}></CastingsTableBody>
                // <CategoriesTableBody
                //   categories={categories}
                // ></CategoriesTableBody>
              }
            ></ProductsTable>
          </CardContent>
        </Card>
      </div>
    </Card>
  );
};

export default AluminumStock;
