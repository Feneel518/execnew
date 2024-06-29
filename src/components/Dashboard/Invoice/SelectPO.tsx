"use client";

import { FC, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SelectPOs } from "@/lib/types";

interface SelectPOProps {
  orders: SelectPOs[];
  clientId: string;
}

const SelectPO: FC<SelectPOProps> = ({ orders, clientId }) => {
  const [customerId, setCustomerId] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams().get("orderId");
  return (
    <div className=" flex flex-col gap-10">
      <Select
        onValueChange={(e) => {
          setCustomerId(e);
          const params = new URLSearchParams();
          params.set("orderId", e);
          params.set("client", clientId);
          router.replace(`${pathname}?${params.toString()}`);
          router.refresh();
        }}
        defaultValue={searchParams ?? ""}
      >
        <SelectTrigger className="text-black">
          <SelectValue placeholder="Select the PO Number" />
        </SelectTrigger>
        <SelectContent>
          {orders.map((product) => {
            return (
              <SelectItem key={product.id} value={product.id}>
                {product.orderNumber} | {product.poNumber}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectPO;
