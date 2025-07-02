"use client";

import { FC, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetSuppliersForSelect } from "@/data/get-suppliers-for-select";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";

interface SelectUserForUsageProps {}

const SelectUserForUsage: FC<SelectUserForUsageProps> = ({}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [prodOpen, setProdOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const userQuery = useSearchParams().get("user");
  const [userId, setUserId] = useState(userQuery ?? "");

  const { data: suppliers } = useGetSuppliersForSelect();

  const initialDate = searchParams.get("month")
    ? new Date(`${searchParams.get("year")}-${searchParams.get("month")}-01`)
    : new Date();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    initialDate
  );

  // Handle month selection
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);

      // Update URL with month and year
      const params = new URLSearchParams(searchParams.toString());
      params.set("month", format(date, "MM")); // Format month as '01', '02', etc.
      params.set("year", format(date, "yyyy")); // Format year as '2024'
      router.push(`?${params.toString()}`, { scroll: false });
    }
  };

  return (
    <div className="grid grid-cols-2 gap-20">
      <Popover open={prodOpen} onOpenChange={setProdOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={prodOpen}
            className="w-full justify-between text-black"
          >
            {userId
              ? `${
                  suppliers?.success?.find(
                    (framework) => framework.id === userId
                  )?.name
                } | ${
                  suppliers?.success?.find(
                    (framework) => framework.id === userId
                  )?.type
                } `
              : "Select User..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0">
          <Command>
            <CommandInput placeholder="Search user..." />
            <CommandList>
              <CommandEmpty>No Products found.</CommandEmpty>
              <CommandGroup>
                {suppliers?.success?.map((framework) => (
                  <CommandItem
                    defaultValue={userQuery ?? ""}
                    key={framework.name}
                    value={framework.name ?? ""}
                    onSelect={(currentValue) => {
                      setUserId(framework.id);
                      router.replace(`?user=${framework.id}`, {
                        scroll: false,
                      });
                      setProdOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        userId === framework.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {framework.name} | {framework.type}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <div className="space-y-4">
        <Popover open={dateOpen} onOpenChange={setDateOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full text-black">
              {selectedDate
                ? format(selectedDate, "MMMM yyyy")
                : "Select Month"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="grid grid-cols-3 gap-2  w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect} // Set the date
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default SelectUserForUsage;
