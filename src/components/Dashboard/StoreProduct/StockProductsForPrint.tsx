"use client";

import A4Page from "@/components/Global/A4Page";
import { StoreProduct } from "@prisma/client";
import { FC, useState } from "react";
import StoreProductsTable from "./StoreProductsTable";
import SmallHeading from "@/components/Global/SmallHeading";
import Image from "next/image";

interface StockProductsForPrintProps {
  product: StoreProduct[];
}

const StockProductsForPrint: FC<StockProductsForPrintProps> = ({ product }) => {
  return (
    <div className="w-[210mm] min-h-[297mm] print:size-[A4] bg-white text-black shadow-[rgba(0,_0,_0,_0.4)_0px_30px_90px] flex flex-col">
      <div className="flex flex-col gap-4  ">
        <div className="grid grid-cols-2 gap-8 items-center justify-center ">
          {product.map((prod) => {
            return (
              <div className="flex flex-col items-center justify-center gap-6 border">
                <Image
                  className="pt-4"
                  alt={prod.name}
                  src={prod.qrCodeLink}
                  width={200}
                  height={200}
                ></Image>
                <div className="text-center">
                  <h1 className="text-xl text-center">{prod.name}</h1>
                  {prod.description && (
                    <p className="text-sm text-center">{prod.description}</p>
                  )}
                  <p>{prod.StoreProductId}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StockProductsForPrint;
