"use client";

import { FC, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetProductsForSelect } from "@/data/get-products-for-select";
import { useRouter } from "next/navigation";

interface SelectProductForPendingProps {}

const SelectProductForPending: FC<SelectProductForPendingProps> = ({}) => {
  const [productId, setProductId] = useState("");
  const router = useRouter();
  const { data: products } = useGetProductsForSelect();
  return (
    <div>
      <Select
        onValueChange={(e) => {
          setProductId(e);
          router.replace(`?product=${e}`, {
            scroll: false,
          });
        }}
      >
        <SelectTrigger className="text-black">
          <SelectValue placeholder="Select a product" />
        </SelectTrigger>
        <SelectContent>
          {products?.success?.map((product) => {
            return (
              <SelectItem key={product.id} value={product.id}>
                {product.name}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectProductForPending;
