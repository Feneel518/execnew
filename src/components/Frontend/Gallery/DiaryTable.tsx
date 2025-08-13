import { productCatalog } from "@/lib/types";
import Image from "next/image";
import { FC } from "react";

interface DiaryTableProps {
  categoryName: string;
  products: productCatalog[];
}

const DiaryTable: FC<DiaryTableProps> = ({ products, categoryName }) => {
  return (
    <div className="grid grid-cols-3 gap-8 items-start justify-between">
      {products.map((product) => {
        return (
          <div className="flex flex-col gap-2 ">
            <div className="h-[1px] w-full bg-white"></div>
            <div className="size-20 relative w-full flex items-center justify-center">
              <Image
                alt={product.name}
                src={product.image}
                fill
                className="object-contain"
              ></Image>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-[10px]">
                &quot;ExEC&quot; make {product.name} suitable for Gas Group{" "}
                {product.gasGroup?.split("AS")[0]}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DiaryTable;
