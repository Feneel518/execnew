import ProductsTable from "@/components/Dashboard/Products/ProductsTable";
import StockData from "@/components/Dashboard/Stock/StockData";
import StockTableBody from "@/components/Dashboard/Stock/StockTableBody";
import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/lib/db";
import { getStockData } from "@/lib/queries";
import { FC } from "react";

interface pageProps {}
interface StockStats {
  productname: string;
  inwardTotal: number;
  outwardTotal: number;
  inStock: number;
}

const page: FC<pageProps> = async ({}) => {
  // const data = await getStockData();

  const stockData = await db.inventory.findMany({
    select: {
      status: true,
      quantity: true,
      storeProduct: {
        select: {
          StoreProductId: true,
        },
      },
    },
  });

  let inward: Record<string, number> = {};
  let inStock: Record<string, number> = {};
  let outward: Record<string, number> = {};
  const abc = stockData.forEach((transaction) => {
    const { quantity, status, storeProduct } = transaction;

    if (status === "IN") {
      inward[storeProduct?.StoreProductId!] =
        (inward[storeProduct?.StoreProductId!] || 0) + Number(quantity);
      inStock[storeProduct?.StoreProductId!] =
        (inStock[storeProduct?.StoreProductId!] || 0) + Number(quantity);
    } else if (status === "OUT") {
      outward[storeProduct?.StoreProductId!] =
        (outward[storeProduct?.StoreProductId!] || 0) + Number(quantity);
      inStock[storeProduct?.StoreProductId!] =
        (inStock[storeProduct?.StoreProductId!] || 0) - Number(quantity);
    }
  });

  const result: StockStats[] = Object.keys(inStock).map((productname) => ({
    productname,
    inwardTotal: inward[productname] || 0,
    outwardTotal: outward[productname] || 0,
    inStock: inStock[productname],
  }));

  console.log(result);

  return (
    <div className="">
      <div className="flex items-center justify-between">
        <div className="">Stock</div>
      </div>
      <div className="mt-4">
        <Card>
          <CardContent></CardContent>
          <ProductsTable
            columns={
              <>
                <div className="flex items-center border-b  p-4 ">
                  <h1 className=" px-4 text-left align-middle font-medium text-muted-foreground flex-1">
                    Name
                  </h1>
                  <h1 className=" px-4 text-left align-middle font-medium text-muted-foreground flex-1">
                    Inward
                  </h1>
                  <h1 className=" px-4 text-left align-middle font-medium text-muted-foreground flex-1">
                    outward
                  </h1>
                  <h1 className=" px-4 text-left align-middle font-medium text-muted-foreground flex-1">
                    In Stock
                  </h1>
                </div>
              </>
            }
            body={<StockTableBody items={result}></StockTableBody>}
          ></ProductsTable>
        </Card>
      </div>
    </div>
  );
};

export default page;
