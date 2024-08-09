"use client";

import { FC } from "react";
import { useRouter } from "next/navigation";

interface StockTableBodyProps {
  items: {
    productCode: string;
    productname: string;
    inwardTotal: number;
    outwardTotal: number;
    inStock: number;
  }[];
}

const StockTableBody: FC<StockTableBodyProps> = ({ items }) => {
  const router = useRouter();
  return (
    <div>
      {items.map((prod) => {
        return (
          <div
            key={prod.productname}
            className={`border-b transition-colors hover:bg-muted/50 ${
              prod.inStock === 0 || prod.inStock < 50 ? "bg-red-100" : ""
            }`}
          >
            <div className="px-4 text-left align-middle font-medium flex items-center     ">
              <div className="p-4 align-middle text-sm font-normal w-40">
                {prod.productCode}
              </div>
              <div className="p-4 align-middle text-sm font-normal  w-[50%]">
                {prod.productname}
              </div>
              <div className="p-4 align-middle text-sm font-normal flex-1">
                {prod.inwardTotal}
              </div>
              <div className="p-4 align-middle text-sm font-normal flex-1">
                {prod.outwardTotal}
              </div>
              <div className="p-4 align-middle text-sm font-normal flex-1">
                {prod.inStock}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StockTableBody;
