import ProductsTable from "@/components/Dashboard/Products/ProductsTable";
import StockTableBody from "@/components/Dashboard/Stock/StockTableBody";
import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/lib/db";
import { getStockData } from "@/lib/queries";
import { StockData } from "@/lib/types";
import { FC } from "react";

interface pageProps {}
interface StockStats {
  productCode: string;
  productname: string;
  inwardTotal: number;
  outwardTotal: number;
  inStock: number;
}

interface ProductData {
  productCode: string;
  productname: string;
  inwardTotal: number;
  outwardTotal: number;
  inStock: number;
}

const page: FC<pageProps> = async ({}) => {
  const data = await getStockData();

  if (!data?.success || !data) return;
  const stockData: StockData[] = data?.success;

  if (!stockData) return;

  const productDataMap: { [key: string]: ProductData } = {};

  stockData.forEach((entry) => {
    const { StoreProductId, name } = entry.storeProduct!;
    const { status, quantity } = entry;

    // If the product isn't already in the productData object, initialize it
    if (!productDataMap[StoreProductId]) {
      productDataMap[StoreProductId] = {
        productname: name,
        productCode: StoreProductId,
        inwardTotal: 0,
        outwardTotal: 0,
        inStock: 0,
      };
    }

    // Update the inward and outward quantities based on the status
    if (status === "IN") {
      productDataMap[StoreProductId].inwardTotal += Number(quantity);
    } else if (status === "OUT") {
      productDataMap[StoreProductId].outwardTotal += Number(quantity);
    }

    // Update the total stock
    productDataMap[StoreProductId].inStock =
      productDataMap[StoreProductId].inwardTotal -
      productDataMap[StoreProductId].outwardTotal;
  });

  const result: ProductData[] = Object.values(productDataMap).sort((a, b) =>
    a.productCode > b.productCode ? 1 : -1
  );

  return (
    <div className="">
      <div className="flex items-center justify-between">
        <div className="">Stock</div>
      </div>
      <div className="mt-4">
        <Card>
          <CardContent>
            <ProductsTable
              columns={
                <>
                  <div className="flex items-center border-b  p-4 ">
                    <h1 className=" px-4 text-left align-middle font-medium text-muted-foreground  w-40">
                      Code
                    </h1>
                    <h1 className=" px-4 text-left align-middle font-medium text-muted-foreground  w-[50%]">
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default page;
