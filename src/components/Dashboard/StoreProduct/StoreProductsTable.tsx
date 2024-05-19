import { StoreProduct } from "@prisma/client";
import Image from "next/image";
import { FC } from "react";

interface StoreProductsTableProps {
  product: StoreProduct[];
}

const StoreProductsTable: FC<StoreProductsTableProps> = ({ product }) => {
  return (
    <div className="grid grid-cols-2 items-center justify-center">
      {product.map((prod) => {
        return (
          <div className="flex flex-col items-center justify-center gap-6">
            <Image
              alt={prod.name}
              src={prod.qrCodeLink}
              width={300}
              height={300}
            ></Image>
            <h1 className="text-3xl">{prod.name}</h1>
          </div>
        );
      })}
    </div>
  );
};

export default StoreProductsTable;
