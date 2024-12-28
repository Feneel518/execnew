"use client";
import { FC } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Control, UseFormSetValue } from "react-hook-form";
import { AluminumTransactionCreationRequest } from "@/lib/Validators/AllAluminumValidators";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";

interface TransitionSelectProps {
  control: Control<any>;
  name: string;
  label: string;
  placeholder?: string;
  select: { id?: string; value: string }[];
  isLoading: boolean;
}

const TransitionSelect: FC<TransitionSelectProps> = ({
  control,
  name,
  label,
  placeholder,
  select,
  isLoading,
}) => {
  return (
    <FormField
      disabled={isLoading}
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex-1">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {select.map((sel) => {
                  return (
                    <SelectItem
                      key={sel.id ? sel.id : sel.value}
                      value={sel.value}
                    >
                      <div className="flex items-center gap-4">
                        <span>{sel.id ? sel.id : sel.value}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage></FormMessage>
        </FormItem>
      )}
    ></FormField>
  );
};

export default TransitionSelect;
