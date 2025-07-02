import { FC } from "react";
import { Control, UseFormSetValue } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
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
import { AluminumTransactionCreationRequest } from "@/lib/Validators/AllAluminumValidators";

interface TransitionComboProps {
  control: Control<any>;
  name: string;
  label: string;
  title?: string;
  placeholder?: string;
  select: { id?: string; value: string }[];
  isLoading: boolean;
  setValue: UseFormSetValue<any>;
}

const TransitionCombo: FC<TransitionComboProps> = ({
  control,
  name,
  label,
  placeholder,
  select,
  isLoading,
  setValue,
  title,
}) => {
  return (
    <FormField
      control={control}
      name={name}
      disabled={isLoading}
      render={({ field }) => (
        <FormItem className="flex-1">
          <FormLabel>{title}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-full justify-between",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value
                    ? field.value === "null"
                      ? "-----null-----"
                      : select.find((cust) => cust.id === field.value)?.value
                    : `Select ${title}`}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0">
              <Command>
                <CommandInput placeholder={`Search ${title}...`} />
                <CommandList>
                  <CommandEmpty>No {title} found.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem
                      onSelect={() => {
                        setValue(name, "null");
                      }}
                      key={"null"}
                      value={"null"}
                    >
                      <div className="flex items-center gap-4">
                        <span>{"-----null-----"}</span>
                      </div>
                    </CommandItem>
                    {select.map((language) => (
                      <CommandItem
                        value={language.value}
                        key={language.id}
                        onSelect={() => {
                          setValue(name, language.id);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            language.id === field.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {language.value}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default TransitionCombo;
