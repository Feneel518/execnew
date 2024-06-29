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
import { useRouter, useSearchParams } from "next/navigation";
import { useGetCustomersForSelect } from "@/data/get-customers-for-select";
import { useGetCustomersWithPendingOrdersForSelect } from "@/data/get-customers-with-orders-for-select";
import { Label } from "@/components/ui/label";

interface SelectClientForInvoiceProps {}

const SelectClientForInvoice: FC<SelectClientForInvoiceProps> = ({}) => {
  const [customerId, setCustomerId] = useState("");
  const router = useRouter();
  const { data: clients } = useGetCustomersWithPendingOrdersForSelect();
  const searchParams = useSearchParams().get("client");
  return (
    <div className=" flex flex-col gap-2">
      <Label>Client Name</Label>
      <Select
        onValueChange={(e) => {
          setCustomerId(e);
          router.replace(`?client=${e}`, {
            scroll: false,
          });
        }}
        defaultValue={searchParams ?? ""}
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

export default SelectClientForInvoice;
