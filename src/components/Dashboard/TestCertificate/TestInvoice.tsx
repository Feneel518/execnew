"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { TestCertificateSchemaRequest } from "@/lib/Validators";
import { FC } from "react";
import { Control, useFieldArray } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface TestInvoiceProps {
  control: Control<TestCertificateSchemaRequest>;
  nestIndex: number;
  isLoading: boolean;
}

const TestInvoice: FC<TestInvoiceProps> = ({
  control,
  nestIndex,
  isLoading,
}) => {
  const { fields, append, remove } = useFieldArray({
    control: control,
    name: `items.${nestIndex}.invoice`,
  });
  return (
    <div className="col-span-2">
      {fields.map((field, index) => {
        return (
          <div className="flex items-end gap-8">
            <FormField
              disabled={isLoading}
              control={control}
              name={`items.${nestIndex}.invoice.${index}.invoiceNumber`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Invoice Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Invoice Number" {...field}></Input>
                  </FormControl>
                  <FormMessage></FormMessage>
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={control}
              name={`items.${nestIndex}.invoice.${index}.invoiceDate`}
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
            />
            <div className="flex items-center gap-2">
              <Button
                type="button"
                className="w-full"
                onClick={() => {
                  append({
                    invoiceDate: new Date(),
                    invoiceNumber: "",
                  });
                }}
              >
                Add Invoice
              </Button>

              {index > 0 && (
                <Button onClick={() => remove(index)} type="button">
                  -
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TestInvoice;
