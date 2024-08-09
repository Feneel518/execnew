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
import { Popover } from "@radix-ui/react-popover";
import { PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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

interface SelectClientForInvoiceProps {}

const SelectClientForInvoice: FC<SelectClientForInvoiceProps> = ({}) => {
  const searchParams = useSearchParams().get("client");
  const [customerId, setCustomerId] = useState(searchParams ?? "");
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { data: clients } = useGetCustomersWithPendingOrdersForSelect();

  return (
    <div className=" flex flex-col gap-2">
      <Label>Client Name</Label>
      {/* <Select
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
      </Select> */}
      {clients?.success && (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between text-black"
            >
              {customerId
                ? clients?.success?.find(
                    (framework) => framework.id === customerId
                  )?.name
                : "Select client..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0">
            <Command>
              <CommandInput placeholder="Search framework..." />
              <CommandList>
                <CommandEmpty>No framework found.</CommandEmpty>
                <CommandGroup>
                  {clients?.success?.map((framework) => (
                    <CommandItem
                      defaultValue={searchParams ?? ""}
                      key={framework.name}
                      value={framework.name}
                      onSelect={(currentValue) => {
                        setCustomerId(framework.id);
                        router.replace(`?client=${framework.id}`, {
                          scroll: false,
                        });
                        setOpen(false);
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
      )}
    </div>
  );
};

export default SelectClientForInvoice;
