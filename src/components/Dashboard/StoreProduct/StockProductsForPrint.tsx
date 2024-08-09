"use client";

import A4Page from "@/components/Global/A4Page";
import { StoreProduct } from "@prisma/client";
import { FC, useState } from "react";
import StoreProductsTable from "./StoreProductsTable";
import SmallHeading from "@/components/Global/SmallHeading";

interface StockProductsForPrintProps {
  product: StoreProduct[];
}

const StockProductsForPrint: FC<StockProductsForPrintProps> = ({ product }) => {
  const [perPage, setPerPage] = useState([product.length]);

  let pages = perPage.map((amount, i) => {
    let offset = perPage
      .slice(0, i)
      .reduce((total, amount) => total + amount, 0);
    return product.slice(offset, offset + amount);
  });

  return (
    <div className="flex flex-col gap-4 print:gap-0">
      {pages.map((group, index, list) => {
        return (
          <A4Page
            onResize={() => {
              setPerPage((perPage) => {
                let clone = perPage.slice();
                clone[index] -= 1;
                clone[index + 1] = clone[index + 1] || 0;
                clone[index + 1] += 1;

                return clone;
              });
            }}
            key={index}
            table={<StoreProductsTable product={group}></StoreProductsTable>}
            heading={<div className="h-2 border"></div>}
            footer={<div className="h-0"></div>}
          ></A4Page>
        );
      })}
    </div>
  );
};

export default StockProductsForPrint;
