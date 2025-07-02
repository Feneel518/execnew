"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { OrderCreationRequest } from "@/lib/Validators/OrderValidator";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { FC } from "react";
import { Control, useFieldArray } from "react-hook-form";

interface SupplyFormProps {
  nestIndex: number;
  control: Control<OrderCreationRequest>;
}

const SupplyForm: FC<SupplyFormProps> = ({ control, nestIndex }) => {
  const { fields, remove, append } = useFieldArray({
    control,
    name: `ProductInOrder.${nestIndex}.supply`,
  });
  return (
    <div className="col-span-4">
      {fields.map((field, index) => {
        return (
          <div key={field.id} className="grid grid-cols-4 items-end gap-4">
            <FormField
              control={control}
              name={`ProductInOrder.${nestIndex}.supply.${index}.supplyQuantity`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Supplied Quantity</FormLabel>
                  <FormControl>
                    <Input placeholder="Price" {...field}></Input>
                  </FormControl>
                  <FormMessage></FormMessage>
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={control}
              name={`ProductInOrder.${nestIndex}.supply.${index}.invoiceNumber`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Invoice Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Price" {...field}></Input>
                  </FormControl>
                  <FormMessage></FormMessage>
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={control}
              name={`ProductInOrder.${nestIndex}.supply.${index}.invoiceDate`}
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Invoice Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                className="w-full"
                onClick={() => {
                  append({
                    invoiceDate: new Date(),
                    invoiceNumber: "",
                    supplyQuantity: 0,
                  });
                }}
              >
                Add Invoice
              </Button>

              <Button onClick={() => remove(index)} type="button">
                -
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SupplyForm;
