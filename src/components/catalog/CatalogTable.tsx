import { productCatalog } from "@/lib/types";
import { Product } from "@prisma/client";
import Image from "next/image";
import { FC } from "react";

interface CatalogTableProps {
  categoryName: string;
  products: productCatalog[];
  index: number;
}

const CatalogTables: FC<CatalogTableProps> = ({
  categoryName,
  products,
  index,
}) => {
  return (
    <div className="">
      {index == 0 && (
        <div className="flex justify-center flex-col items-center relative">
          <div className="h-[6px] w-[400px] bg-white"></div>
          <div className="h-[400px] w-[400px] relative">
            <Image
              src={products[0].image}
              alt={products[0].name}
              fill
              className="object-contain"
            ></Image>
          </div>
          <h1 className="text-5xl font-bold -rotate-90 w-80 absolute left-0 ">
            {categoryName}
          </h1>
        </div>
      )}

      <div className="grid grid-cols-3 gap-6">
        {products.map((product) => {
          return (
            <div className="flex flex-col gap-4">
              <div className="h-[2px] w-full bg-white"></div>
              <div className="w-40 h-40 relative">
                <Image
                  alt={product.name}
                  src={product.image}
                  fill
                  className="object-contain"
                ></Image>
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="uppercase  tracking-wide text-sm">
                  {product.name}
                </h2>
                <h2 className="font-semibold txt-xs">{categoryName}</h2>
                <p className="text-xs">
                  &quot;ExEC&quot; make {product.name} suitabel for Gas Group{" "}
                  {product.gasGroup?.split("AS")[0]}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CatalogTables;
