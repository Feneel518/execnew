import { StoreProduct } from "@prisma/client";
import Image from "next/image";
import { FC } from "react";

interface StoreProductsTableProps {
  product: StoreProduct[];
}

const StoreProductsTable: FC<StoreProductsTableProps> = ({ product }) => {
  return (
    // <div className="grid grid-cols-2 gap-10 items-center justify-center ">
    //   {product.map((prod) => {
    //     return (
    //       <div className="flex flex-col items-center justify-center gap-6 border">
    //         <Image
    //           alt={prod.name}
    //           src={prod.qrCodeLink}
    //           width={200}
    //           height={200}
    //         ></Image>
    //         <div className="text-center">
    //           <h1 className="text-xl text-center">{prod.name}</h1>
    //           {prod.description && (
    //             <p className="text-sm text-center">{prod.description}</p>
    //           )}
    //           <p>{prod.StoreProductId}</p>
    //         </div>
    //       </div>
    //     );
    //   })}
    // </div>
    <div className="">
      {product.map((prod) => {
        return <div className="">{prod.name}</div>;
      })}
    </div>
  );
};

export default StoreProductsTable;
