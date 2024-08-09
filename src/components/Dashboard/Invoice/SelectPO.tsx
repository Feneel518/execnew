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

interface SelectPOProps {
  orders: SelectPOs[];
  clientId: string;
}

const SelectPO: FC<SelectPOProps> = ({ orders, clientId }) => {
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams().get("orderId");
  const [customerId, setCustomerId] = useState(searchParams ?? "");
  const router = useRouter();
  const pathname = usePathname();
  return (
    <div className=" flex flex-col gap-10">
      {orders.length > 0 && (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between text-black"
            >
              {customerId
                ? orders.find((framework) => framework.id === customerId)
                    ?.poNumber
                : "Select Po Number..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0">
            <Command>
              <CommandInput placeholder="Search Po Numbers..." />
              <CommandList>
                <CommandEmpty>No Orders found.</CommandEmpty>
                <CommandGroup>
                  {orders.map((framework) => (
                    <CommandItem
                      defaultValue={searchParams ?? ""}
                      key={framework.poNumber}
                      value={framework.poNumber ?? ""}
                      onSelect={(currentValue) => {
                        setCustomerId(framework.id);
                        const params = new URLSearchParams();
                        params.set("orderId", framework.id);
                        params.set("client", clientId);
                        router.replace(`${pathname}?${params.toString()}`);
                        router.refresh();
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
                      {framework.orderNumber} | {framework.poNumber}
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

export default SelectPO;
