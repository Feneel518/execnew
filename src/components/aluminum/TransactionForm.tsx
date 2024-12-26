"use client";

import { FC, useCallback, useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { useFieldArray, useForm } from "react-hook-form";
import Loading from "../Global/Loading";
import { addDays, format } from "date-fns";
import { Calendar } from "../ui/calendar";
import {
  AluminumTransactionCreationRequest,
  AluminumTransactionValidator,
} from "@/lib/Validators/AllAluminumValidators";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "../ui/use-toast";
import { deleteTransaction, upserAluminumTransaction } from "@/lib/queries";
import ObjectID from "bson-objectid";
import { useRouter } from "next/navigation";
import { TransactionType } from "@/lib/types";
import { useGetDocketNumberForSelect } from "@/data/get-docket-number-for-select";

interface TransactionFormProps {
  supplier: {
    name: string;
    id: string;
    type: "SUPPLIER" | "USER" | "BOTH";
  }[];
  transaction?: TransactionType;
}

const TransactionForm: FC<TransactionFormProps> = ({
  supplier,
  transaction,
}) => {
  const router = useRouter();
  const [date, setDate] = useState<Date | undefined>(
    transaction?.docketDate ? transaction.docketDate : new Date()
  );
  const [isLoading, setIsLoading] = useState(false);
  const [deletingTransaction, setDeletingTransaction] = useState(false);

  const [suppId, setSuppId] = useState<string | undefined>(undefined);
  const form = useForm<AluminumTransactionCreationRequest>({
    resolver: zodResolver(AluminumTransactionValidator),
    defaultValues: {
      id: transaction?.id ? transaction.id : ObjectID().toString(),
      aluminumType: transaction?.aluminumType
        ? transaction.aluminumType
        : undefined,
      docketDate: transaction?.docketDate ? transaction.docketDate : new Date(),
      docketNumber: transaction?.docketNumber ? transaction.docketNumber : "",
      inwardType: transaction?.inwardType ? transaction.inwardType : undefined,
      price: transaction?.price ? transaction.price : 0,
      quantity: transaction?.quantity ? transaction.quantity : 0,
      quantityType: transaction?.quantityType ? transaction.quantityType : "",
      status: transaction?.status ? transaction.status : undefined,
      supplierId: transaction?.supplierId ? transaction.supplierId : undefined,
      userId: transaction?.userId ? transaction.userId : undefined,
      weight: transaction?.weight ? transaction.weight : 0,
      TransactionCalculation:
        transaction?.TransactionCalculation &&
        transaction.TransactionCalculation.length > 0
          ? transaction.TransactionCalculation.map((trans) => {
              return {
                id: trans.id,
                index: trans.index,
                quantity: trans.quantity ?? undefined,
                quantityType: trans.quantityType ?? undefined,
                weight: trans.weight ?? undefined,
              };
            })
          : [],
    },
  });

  const { append, fields, remove } = useFieldArray({
    name: "TransactionCalculation",
    control: form.control,
  });

  const status = form.watch("status");
  const inwardType = form.watch("inwardType");
  const aluminumType = form.watch("aluminumType");
  const weightCalculations = form.watch("TransactionCalculation");

  const supplierId = form.watch("supplierId");

  useEffect(() => {
    setSuppId(supplierId);
  }, [supplierId]);

  const fetch =
    (inwardType === "REPLACE_ALUMINUM" || inwardType === "RETURNABLE") && suppId
      ? true
      : false;

  const { data: docketNumbers } = useGetDocketNumberForSelect(suppId, fetch);

  if (weightCalculations && weightCalculations.length > 0) {
    const totalWeight = weightCalculations.reduce((acc, total) => {
      return acc + Number(total.weight);
    }, 0);
    const totalQuantity = weightCalculations.reduce((acc, total) => {
      return acc + Number(total.quantity);
    }, 0);
    form.setValue("weight", totalWeight);
    form.setValue("quantity", totalQuantity);
  }

  const handleSubmit = async (values: AluminumTransactionCreationRequest) => {
    if (!values.supplierId) {
      return toast({
        variant: "destructive",
        title: "Oppse!",
        description: "Please Select Supplier to submit the form.",
      });
    }

    values.docketDate = date;
    values.quantityType = values.aluminumType === "SCRAP" ? "Bags" : "Slabs";

    setIsLoading(true);

    const response = await upserAluminumTransaction(values);

    if (response?.success) {
      toast({
        title: "Your Transacrion has been saved.",
      });

      setIsLoading(false);

      router.push("/aluminum/transactions");
      router.refresh();
    }
    if (response?.error) {
      toast({
        variant: "destructive",
        title: "Oppse!",
        description: "could not save your transaction",
      });
      setIsLoading(false);
    }
  };

  const handleTransaction = async () => {
    setDeletingTransaction(true);
    if (!transaction?.id) return;
    const response = await deleteTransaction(transaction?.id);
    setDeletingTransaction(false);
    if (response?.success) {
      router.push("/aluminum/transactions");
      router.refresh();
      return toast({
        title: "Your Transaction has been deleted.",
        duration: 1000,
      });
    }
    if (response?.error) {
      return toast({
        variant: "destructive",
        title: "Oppse!",
        description: "could not delete your transaction",
        duration: 1000,
      });
    }
  };

  return (
    <AlertDialog>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Transaction Information</CardTitle>
          <CardDescription>
            Lets create a transaction for the aluminum inward and outward. You
            can edit this transaction later.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="flex flex-col gap-4 "
            >
              <div className="">
                {/* Status */}
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Status of Transaction</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select inward or outward" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem key={"in"} value={"IN"}>
                              <div className="flex items-center gap-4">
                                <span>{"IN"}</span>
                              </div>
                            </SelectItem>
                            <SelectItem key={"out"} value={"OUT"}>
                              <div className="flex items-center gap-4">
                                <span>{"OUT"}</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                ></FormField>
              </div>
              {/* In ward Type */}
              {status === "IN" ? (
                <div className="">
                  <FormField
                    disabled={isLoading}
                    control={form.control}
                    name="inwardType"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Type of Inward</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type of inward" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem key={"Aluminum"} value={"ALUMINUM"}>
                                <div className="flex items-center gap-4">
                                  <span>{"Aluminum"}</span>
                                </div>
                              </SelectItem>
                              <SelectItem key={"Casting"} value={"CASTING"}>
                                <div className="flex items-center gap-4">
                                  <span>{"Casting"}</span>
                                </div>
                              </SelectItem>
                              <SelectItem
                                key={"Returnable"}
                                value={"RETURNABLE"}
                              >
                                <div className="flex items-center gap-4">
                                  <span>{"Returnable"}</span>
                                </div>
                              </SelectItem>
                              <SelectItem
                                key={"ReplaceAluminum"}
                                value={"REPLACE_ALUMINUM"}
                              >
                                <div className="flex items-center gap-4">
                                  <span>{"ReplaceAluminum"}</span>
                                </div>
                              </SelectItem>
                              <SelectItem key={"Losses"} value={"LOSSES"}>
                                <div className="flex items-center gap-4">
                                  <span>{"Losses"}</span>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage></FormMessage>
                      </FormItem>
                    )}
                  ></FormField>
                </div>
              ) : status === "OUT" ? (
                <div className="">Bye</div>
              ) : null}

              {inwardType === "ALUMINUM" && (
                <div className="">
                  {/* Aluminum Type */}
                  <FormField
                    disabled={isLoading}
                    control={form.control}
                    name="aluminumType"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Type of Aluminum</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type of aluminum" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem key={"Scrap"} value={"SCRAP"}>
                                <div className="flex items-center gap-4">
                                  <span>{"Scrap"}</span>
                                </div>
                              </SelectItem>
                              <SelectItem key={"Gravity"} value={"GRAVITY"}>
                                <div className="flex items-center gap-4">
                                  <span>{"Gravity"}</span>
                                </div>
                              </SelectItem>
                              <SelectItem key={"Pressure"} value={"PRESSURE"}>
                                <div className="flex items-center gap-4">
                                  <span>{"Pressure"}</span>
                                </div>
                              </SelectItem>
                              <SelectItem key={"Ladi"} value={"LADI"}>
                                <div className="flex items-center gap-4">
                                  <span>{"Ladi"}</span>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage></FormMessage>
                      </FormItem>
                    )}
                  ></FormField>
                </div>
              )}
              {inwardType && (
                <>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 items-end">
                    {supplier.length > 0 && (
                      <FormField
                        control={form.control}
                        name="supplierId"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Supplier</FormLabel>
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
                                        : supplier.find(
                                            (cust) => cust.id === field.value
                                          )?.name
                                      : "Select supplier"}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0">
                                <Command>
                                  <CommandInput placeholder="Search supplier..." />
                                  <CommandList>
                                    <CommandEmpty>
                                      No supplier found.
                                    </CommandEmpty>
                                    <CommandGroup>
                                      <CommandItem
                                        onSelect={() => {
                                          form.setValue("supplierId", "null");
                                        }}
                                        key={"null"}
                                        value={"null"}
                                      >
                                        <div className="flex items-center gap-4">
                                          <span>{"-----null-----"}</span>
                                        </div>
                                      </CommandItem>
                                      {supplier
                                        .filter((type) => type.type !== "USER")
                                        .map((language) => (
                                          <CommandItem
                                            value={language.name}
                                            key={language.id}
                                            onSelect={() => {
                                              form.setValue(
                                                "supplierId",
                                                language.id
                                              );
                                            }}
                                          >
                                            <Check
                                              className={cn(
                                                "mr-2 h-4 w-4",
                                                language.name === field.value
                                                  ? "opacity-100"
                                                  : "opacity-0"
                                              )}
                                            />
                                            {language.name}
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
                    )}
                    {supplier.length > 0 && inwardType === "RETURNABLE" && (
                      <FormField
                        control={form.control}
                        name="userId"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>User</FormLabel>
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
                                        : supplier.find(
                                            (cust) => cust.id === field.value
                                          )?.name
                                      : "Select user"}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0">
                                <Command>
                                  <CommandInput placeholder="Search user..." />
                                  <CommandList>
                                    <CommandEmpty>
                                      No supplier found.
                                    </CommandEmpty>
                                    <CommandGroup>
                                      <CommandItem
                                        onSelect={() => {
                                          form.setValue("userId", "null");
                                        }}
                                        key={"null"}
                                        value={"null"}
                                      >
                                        <div className="flex items-center gap-4">
                                          <span>{"-----null-----"}</span>
                                        </div>
                                      </CommandItem>
                                      {supplier
                                        .filter(
                                          (type) => type.type !== "SUPPLIER"
                                        )
                                        .map((language) => (
                                          <CommandItem
                                            value={language.name}
                                            key={language.id}
                                            onSelect={() => {
                                              form.setValue(
                                                "userId",
                                                language.id
                                              );
                                            }}
                                          >
                                            <Check
                                              className={cn(
                                                "mr-2 h-4 w-4",
                                                language.name === field.value
                                                  ? "opacity-100"
                                                  : "opacity-0"
                                              )}
                                            />
                                            {language.name}
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
                    )}
                    {/* Products */}
                    {/* {supplier.length > 0 && inwardType === "CASTING" && (
                      <FormField
                        control={form.control}
                        name="supplierId"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Supplier</FormLabel>
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
                                        : supplier.find(
                                            (cust) => cust.id === field.value
                                          )?.name
                                      : "Select supplier"}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0">
                                <Command>
                                  <CommandInput placeholder="Search supplier..." />
                                  <CommandList>
                                    <CommandEmpty>
                                      No supplier found.
                                    </CommandEmpty>
                                    <CommandGroup>
                                      <CommandItem
                                        onSelect={() => {
                                          form.setValue("supplierId", "null");
                                        }}
                                        key={"null"}
                                        value={"null"}
                                      >
                                        <div className="flex items-center gap-4">
                                          <span>{"-----null-----"}</span>
                                        </div>
                                      </CommandItem>
                                      {supplier.map((language) => (
                                        <CommandItem
                                          value={language.name}
                                          key={language.id}
                                          onSelect={() => {
                                            form.setValue(
                                              "supplierId",
                                              language.id
                                            );
                                          }}
                                        >
                                          <Check
                                            className={cn(
                                              "mr-2 h-4 w-4",
                                              language.name === field.value
                                                ? "opacity-100"
                                                : "opacity-0"
                                            )}
                                          />
                                          {language.name}
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
                    )} */}
                    {fetch ? (
                      docketNumbers &&
                      docketNumbers.success &&
                      docketNumbers.success.length > 0 && (
                        <FormField
                          control={form.control}
                          name="docketNumber"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>Docket Number</FormLabel>
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
                                          : docketNumbers.success.find(
                                              (cust) =>
                                                cust.docketNumber ===
                                                field.value
                                            )?.docketNumber
                                        : "Select docket Number"}
                                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0">
                                  <Command>
                                    <CommandInput placeholder="Search docket Number..." />
                                    <CommandList>
                                      <CommandEmpty>
                                        No docket found.
                                      </CommandEmpty>
                                      <CommandGroup>
                                        <CommandItem
                                          onSelect={() => {
                                            form.setValue(
                                              "docketNumber",
                                              "null"
                                            );
                                          }}
                                          key={"null"}
                                          value={"null"}
                                        >
                                          <div className="flex items-center gap-4">
                                            <span>{"-----null-----"}</span>
                                          </div>
                                        </CommandItem>
                                        {/* {docketNumbers.success.} */}
                                        {docketNumbers?.success.map(
                                          (language) => (
                                            <CommandItem
                                              value={language.docketNumber}
                                              key={language.docketNumber}
                                              onSelect={() => {
                                                form.setValue(
                                                  "docketNumber",
                                                  language.docketNumber
                                                );
                                              }}
                                            >
                                              <Check
                                                className={cn(
                                                  "mr-2 h-4 w-4",
                                                  language.docketNumber ===
                                                    field.value
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                                )}
                                              />
                                              {language.docketNumber}
                                            </CommandItem>
                                          )
                                        )}
                                      </CommandGroup>
                                    </CommandList>
                                  </Command>
                                </PopoverContent>
                              </Popover>

                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )
                    ) : (
                      <FormField
                        disabled={isLoading}
                        control={form.control}
                        name="docketNumber"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Docket Number</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Docket Number"
                                {...field}
                              ></Input>
                            </FormControl>
                            <FormMessage></FormMessage>
                          </FormItem>
                        )}
                      ></FormField>
                    )}
                    <FormField
                      disabled={isLoading}
                      control={form.control}
                      name="docketDate"
                      render={({ field }) => (
                        <FormItem className="flex-1 ">
                          <FormLabel>Docket Date</FormLabel>
                          <FormControl>
                            <div className="">
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full justify-start text-left font-normal",
                                      !date && "text-muted-foreground"
                                    )}
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date ? (
                                      format(date, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
                                  <div className="rounded-md border w-full">
                                    <Calendar
                                      className=""
                                      mode="single"
                                      selected={date}
                                      onSelect={setDate}
                                    />
                                  </div>
                                </PopoverContent>
                              </Popover>
                            </div>
                          </FormControl>
                          <FormMessage></FormMessage>
                        </FormItem>
                      )}
                    ></FormField>{" "}
                    <FormField
                      disabled={isLoading}
                      control={form.control}
                      name="weight"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Weight</FormLabel>
                          <FormControl>
                            <Input placeholder="Weight" {...field}></Input>
                          </FormControl>
                          <FormMessage></FormMessage>
                        </FormItem>
                      )}
                    ></FormField>
                    <FormField
                      disabled={isLoading}
                      control={form.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Quantity</FormLabel>
                          <FormControl>
                            <Input placeholder="Quantity" {...field}></Input>
                          </FormControl>
                          <FormMessage></FormMessage>
                        </FormItem>
                      )}
                    ></FormField>
                    <FormField
                      disabled={isLoading}
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Price</FormLabel>
                          <FormControl>
                            <Input placeholder="Price" {...field}></Input>
                          </FormControl>
                          <FormMessage></FormMessage>
                        </FormItem>
                      )}
                    ></FormField>
                  </div>

                  {fields.length == 0 && (
                    <Button
                      type="button"
                      className="mt-10 w-80 mx-auto"
                      onClick={() =>
                        append({
                          id: ObjectID().toString(),
                          index: 0,
                          weight: 0,
                          quantity: 0,
                          quantityType:
                            aluminumType === "SCRAP" ? "Bags" : "Slab",
                        })
                      }
                    >
                      open Weight Calculator
                    </Button>
                  )}
                  {fields.length > 0 && (
                    <CardTitle className="mt-10">Weight Calculator</CardTitle>
                  )}
                  {fields.map((field, index) => {
                    return (
                      <div className="" key={field.id}>
                        <div className="flex md:flex-row gap-4 items-end">
                          <FormField
                            disabled={isLoading}
                            control={form.control}
                            name={`TransactionCalculation.${index}.weight`}
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                {index === 0 && <FormLabel>Weight</FormLabel>}
                                <FormControl>
                                  <Input
                                    placeholder="Weight"
                                    {...field}
                                  ></Input>
                                </FormControl>
                                <FormMessage></FormMessage>
                              </FormItem>
                            )}
                          ></FormField>
                          <FormField
                            disabled={isLoading}
                            control={form.control}
                            name={`TransactionCalculation.${index}.quantity`}
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                {index === 0 && <FormLabel>Quantity</FormLabel>}
                                <FormControl>
                                  <Input
                                    placeholder="Quantity"
                                    {...field}
                                  ></Input>
                                </FormControl>
                                <FormMessage></FormMessage>
                              </FormItem>
                            )}
                          ></FormField>
                          {fields.length - 1 === index && (
                            <Button
                              type="button"
                              onClick={() =>
                                append({
                                  id: ObjectID().toString(),
                                  index: index,
                                  weight: 0,
                                  quantity: 0,
                                  quantityType: "Bags",
                                })
                              }
                            >
                              +
                            </Button>
                          )}
                          <Button type="button" onClick={() => remove(index)}>
                            -
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
              {/* {products?.success && (
            <div className="flex md:flex-row gap-4 items-end">
              <FormField
                control={form.control}
                name="storeProductId"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full">
                    <FormLabel>Products</FormLabel>
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
                              ? products.success.find(
                                  (cust) =>
                                    cust.StoreProductId === field.value
                                )?.name
                              : "Select products"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0">
                        <Command>
                          <CommandInput placeholder="Search products..." />
                          <CommandList>
                            <CommandEmpty>No products found.</CommandEmpty>
                            <CommandGroup>
                              {products.success.map((language) => (
                                <CommandItem
                                  value={language.name}
                                  key={language.id}
                                  onSelect={() => {
                                    form.setValue(
                                      "storeProductId",
                                      language.StoreProductId
                                    );
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      language.name === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  <div className="flex items-center gap-4">
                                    <span>{language.StoreProductId}</span>
                                    <span>|</span>
                                    <span>{language.name}</span>
                                  </div>
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
            </div>
          )} */}
              {/* <div className="flex md:flex-row gap-4 items-end">
            {employee.length > 0 && (
              <FormField
                control={form.control}
                name="employeeId"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Employee</FormLabel>
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
                                : employee.find(
                                    (cust) => cust.id === field.value
                                  )?.name
                              : "Select employee"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0">
                        <Command>
                          <CommandInput placeholder="Search employees..." />
                          <CommandList>
                            <CommandEmpty>No employee found.</CommandEmpty>
                            <CommandGroup>
                              <CommandItem
                                onSelect={() => {
                                  form.setValue("employeeId", "null");
                                }}
                                key={"null"}
                                value={"null"}
                              >
                                <div className="flex items-center gap-4">
                                  <span>{"-----null-----"}</span>
                                </div>
                              </CommandItem>
                              {employee.map((language) => (
                                <CommandItem
                                  value={language.name}
                                  key={language.id}
                                  onSelect={() => {
                                    form.setValue(
                                      "employeeId",
                                      language.id
                                    );
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      language.name === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {language.name}
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
            )}
            <FormField
              disabled={isLoading}
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select inward or outward" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem key={"in"} value={"IN"}>
                          <div className="flex items-center gap-4">
                            <span>{"IN"}</span>
                          </div>
                        </SelectItem>
                        <SelectItem key={"out"} value={"OUT"}>
                          <div className="flex items-center gap-4">
                            <span>{"OUT"}</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage></FormMessage>
                </FormItem>
              )}
            ></FormField>
            <FormField
              disabled={isLoading}
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input placeholder="Quantity" {...field}></Input>
                  </FormControl>
                  <FormMessage></FormMessage>
                </FormItem>
              )}
            ></FormField>
          </div> */}

              {/* ////////////////////////////////////////////////////////////////////////////////////////////////// */}

              {/* ////////////////////////////////////////////////////////////////////////////////////////////////// */}
              <Button
                type="submit"
                className="bg-exec hover:bg-exec/90"
                disabled={isLoading}
              >
                {isLoading ? <Loading /> : "Save Transaction Information"}
              </Button>
            </form>
          </Form>
          {transaction?.id && (
            <>
              <div className="flex flex-row items-center justify-between rounded-lg border border-destructive gap-4 p-4 mt-4">
                <div className="">
                  <div className="">Danger Zone</div>
                </div>
                <div className="text-muted-foreground">
                  Deleting your category cannot be undone. This will also make
                  the inventory
                </div>
                <AlertDialogTrigger
                  disabled={isLoading || deletingTransaction}
                  className="text-red-600 p-2 text-center mt-2 rounded-md hover:bg-red-600 hover:text-white whitespace-nowrap"
                >
                  {deletingTransaction ? "Deleting..." : "Delete Transaction"}
                </AlertDialogTrigger>
              </div>
            </>
          )}
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-left">
                Are you absolutely sure?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-left">
                This action cannot be undone. This will permanently delete the
                Quotation.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex items-center">
              <AlertDialogCancel className="mb-2">Cancel</AlertDialogCancel>
              <AlertDialogAction
                disabled={deletingTransaction}
                className="bg-destructive hover:bg-destructive"
                onClick={handleTransaction}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </CardContent>
      </Card>
    </AlertDialog>
  );
};

export default TransactionForm;
