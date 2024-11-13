"use client";

import Rows from "@/components/Global/Rows";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { FormItem, FormLabel } from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMediaQuery } from "@/lib/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { QuotationCreationRequest } from "@/lib/Validators/QuotationValidator";
import { PaymentTerms, TransportationPayment } from "@prisma/client";
import { Check, ChevronsUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { UseFormSetValue } from "react-hook-form";

interface SelectProductProps {
  setValueAsText: any;
  products: {
    name: string;
    id: string;
    paymentTerms?: PaymentTerms | null;
    transportationPayment?: TransportationPayment | null;
  }[];
  setProductId: any;
  productId: string;
  labelText: string;
  className?: string;
  setTerms?: UseFormSetValue<QuotationCreationRequest>;
}

const SelectProduct: FC<SelectProductProps> = ({
  setValueAsText,
  products,
  setProductId,
  productId,
  labelText,
  className,
  setTerms,
}) => {
  const router = useRouter();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(productId);

  const selectedProduct = products?.find((product) => product.id === value);

  return (
    <div className={className}>
      {isDesktop ? (
        <FormItem className="flex flex-col space-y-2  mt-1 gap-1.5 ">
          <FormLabel>{labelText}</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                role="combobox"
                aria-expanded={open}
                className=" justify-between bg-white   "
              >
                {selectedProduct ? (
                  <Rows item={selectedProduct.name}></Rows>
                ) : (
                  `Select ${labelText}`
                )}
                <ChevronsUpDown className="ml-2 w-4 h-4 shrink-0 opacity-50"></ChevronsUpDown>
              </Button>
            </PopoverTrigger>
            <PopoverContent
              side={labelText === "Select Product" ? "right" : "bottom"}
              className="w-[--radix-popover-trigger-width] min-w-[500px] max-h-[--radix-popover-content-available-height] p-0"
            >
              <Command
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <CommandInput placeholder="Search product..."></CommandInput>
                <CommandEmpty>
                  <p>{labelText} not found</p>
                  <p className="text-sx text-muted-foreground">
                    Tip: Create a new {labelText}
                  </p>
                </CommandEmpty>
                <CommandGroup>
                  <CommandList>
                    {products &&
                      products.map((product) => {
                        return (
                          <CommandItem
                            key={product.id}
                            className="hover:bg-black rounded-md hover:text-white cursor-pointer flex items-center justify-between"
                            onSelect={() => {
                              setProductId(setValueAsText, product.id);
                              setValue(product.id);
                              setOpen((prev) => !prev);

                              if (labelText === "Client") {
                                setProductId(
                                  "paymentTerms",
                                  product?.paymentTerms
                                    ? product.paymentTerms
                                    : "ADVANCE"
                                );

                                setProductId(
                                  "transportationPayment",
                                  product?.transportationPayment
                                    ? product.transportationPayment
                                    : "TO_PAY"
                                );
                              }
                            }}
                          >
                            <Rows item={product.name}></Rows>
                            <Check
                              className={cn(
                                "mr-2 w-4 h-4 opacity-0",
                                value === product.name && "opacity-100"
                              )}
                            ></Check>
                          </CommandItem>
                        );
                      })}
                  </CommandList>
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </FormItem>
      ) : (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <Button
              variant={"outline"}
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between bg-white"
            >
              {selectedProduct ? (
                <Rows item={selectedProduct.name}></Rows>
              ) : (
                `Select ${labelText}`
              )}
              <ChevronsUpDown className="ml-2 w-4 h-4 shrink-0 opacity-50"></ChevronsUpDown>
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="mt-4 border-t">
              <Command
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <CommandInput placeholder="Search product..."></CommandInput>

                <CommandEmpty>
                  <p>{labelText} not found</p>
                  <p className="text-sx text-muted-foreground">
                    Tip: Create a new {labelText}
                  </p>
                </CommandEmpty>
                <CommandGroup>
                  <CommandList>
                    {products &&
                      products.map((product) => {
                        return (
                          <CommandItem
                            key={product.id}
                            className="hover:bg-black rounded-md hover:text-white cursor-pointer flex items-center justify-between"
                            onSelect={() => {
                              setProductId(setValueAsText, product.id);
                              setValue(product.id);
                              setOpen((prev) => !prev);
                            }}
                          >
                            <Rows item={product.name}></Rows>
                            <Check
                              className={cn(
                                "mr-2 w-4 h-4 opacity-0",
                                value === product.name && "opacity-100"
                              )}
                            ></Check>
                          </CommandItem>
                        );
                      })}
                  </CommandList>
                </CommandGroup>
              </Command>
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
};

export default SelectProduct;
