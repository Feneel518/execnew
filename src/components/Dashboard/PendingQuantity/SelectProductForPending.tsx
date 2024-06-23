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
import { useGetCustomersForSelect } from "@/data/get-customers-for-select";

interface SelectProductForPendingProps {}

const SelectProductForPending: FC<SelectProductForPendingProps> = ({}) => {
  const [productId, setProductId] = useState("");
  const [customerId, setCustomerId] = useState("");
  const router = useRouter();
  const { data: products } = useGetProductsForSelect();
  const { data: clients } = useGetCustomersForSelect();
  return (
    <div className=" flex flex-col gap-10">
      <Select
        onValueChange={(e) => {
          setProductId(e);
          setCustomerId("");
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
      <div className="text-center">OR</div>
      <Select
        onValueChange={(e) => {
          setCustomerId(e);
          setProductId("");
          router.replace(`?client=${e}`, {
            scroll: false,
          });
        }}
      >
        <SelectTrigger className="text-black">
          <SelectValue placeholder="Select a customer" />
        </SelectTrigger>
        <SelectContent>
          {clients?.success?.map((product) => {
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
