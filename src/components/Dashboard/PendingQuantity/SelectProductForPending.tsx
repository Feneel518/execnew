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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

interface SelectProductForPendingProps {}

const SelectProductForPending: FC<SelectProductForPendingProps> = ({}) => {
  const [prodOpen, setProdOpen] = useState(false);
  const [custOpen, setCustOpen] = useState(false);
  const productQuery = useSearchParams().get("product");
  const customerQuery = useSearchParams().get("client");

  const [productId, setProductId] = useState(productQuery ?? "");
  const [customerId, setCustomerId] = useState(customerQuery ?? "");
  const router = useRouter();
  const { data: products } = useGetProductsForSelect();
  const { data: clients } = useGetCustomersWithPendingOrdersForSelect();
  // const { data: clients } = useGetCustomersForSelect();
  return (
    <div className=" flex flex-col gap-10">
      {/* <Select
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
      </Select> */}

      <Popover open={prodOpen} onOpenChange={setProdOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={prodOpen}
            className="w-full justify-between text-black"
          >
            {productId
              ? products?.success?.find(
                  (framework) => framework.id === productId
                )?.name
              : "Select Product..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0">
          <Command>
            <CommandInput placeholder="Search framework..." />
            <CommandList>
              <CommandEmpty>No Products found.</CommandEmpty>
              <CommandGroup>
                {products?.success?.map((framework) => (
                  <CommandItem
                    defaultValue={productQuery ?? ""}
                    key={framework.name}
                    value={framework.name ?? ""}
                    onSelect={(currentValue) => {
                      setProductId(framework.id);
                      setCustomerId("");
                      router.replace(`?product=${framework.id}`, {
                        scroll: false,
                      });
                      setProdOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        customerId === framework.id
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {framework.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <div className="text-center">OR</div>
      {/* <Select
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
      </Select> */}

      <Popover open={custOpen} onOpenChange={setCustOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={custOpen}
            className="w-full justify-between text-black"
          >
            {customerId
              ? clients?.success?.find(
                  (framework) => framework.id === customerId
                )?.name
              : "Select Customer..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0">
          <Command>
            <CommandInput placeholder="Search framework..." />
            <CommandList>
              <CommandEmpty>No customers found.</CommandEmpty>
              <CommandGroup>
                {clients?.success?.map((framework) => (
                  <CommandItem
                    defaultValue={customerQuery ?? ""}
                    key={framework.name}
                    value={framework.name ?? ""}
                    onSelect={(currentValue) => {
                      setCustomerId(framework.id);
                      setProductId("");
                      router.replace(`?client=${framework.id}`, {
                        scroll: false,
                      });
                      setCustOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        customerId === framework.id
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {framework.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default SelectProductForPending;
