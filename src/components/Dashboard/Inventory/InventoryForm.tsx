"use client";
import { FC, useEffect, useState } from "react";
import Loading from "@/components/Global/Loading";
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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";

import CustomerForm from "../Customers/CustomerForm";
import { deleteQuotation, upsertInventory } from "@/lib/queries";
import { InventoryForDashboard, QuotationForDashboard } from "@/lib/types";
import ObjectID from "bson-objectid";
import { useGetStoreProductsForSelect } from "@/data/get-store-products-for-select";
import { InventorySchemaRequest, InventoryValidator } from "@/lib/Validators";
import { Status } from "@prisma/client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface InventoryFormProps {
  inventoryData?: InventoryForDashboard | null | undefined;
  employee: {
    name: string;
    id: string;
  }[];
}

const InventoryForm: FC<InventoryFormProps> = ({ inventoryData, employee }) => {
  const router = useRouter();
  const { data: products } = useGetStoreProductsForSelect();
  const searchParams = useSearchParams().get("productId");

  if (inventoryData?.storeProductId) {
    router.replace(
      `/dashboard/inventory/${inventoryData.id}?productId=${inventoryData.storeProductId}`
    );
  }

  //

  const [deletingQuotation, setDeletingQuotation] = useState(false);
  const [customerForm, setCustomerForm] = useState(false);

  const form = useForm<InventorySchemaRequest>({
    resolver: zodResolver(InventoryValidator),
    // mode: "onChange",
    defaultValues: {
      storeProductId: inventoryData?.storeProductId
        ? inventoryData.storeProductId
        : "",
      employeeId: inventoryData?.employeeId ? inventoryData.employeeId : "",
      status: inventoryData?.status ? inventoryData.status : "",
      quantity: inventoryData?.quantity ? inventoryData.quantity : "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    form.setValue("storeProductId", searchParams ?? "");
  }, [searchParams]);

  const handleSubmit = async (value: InventorySchemaRequest) => {
    if (!value.storeProductId) {
      return toast({
        variant: "destructive",
        title: "Oppse!",
        description: "Please Select Product to submit the form.",
      });
    } else if (!value.status) {
      return toast({
        variant: "destructive",
        title: "Oppse!",
        description: "Please Status Employee to submit the form.",
      });
    }

    const response = await upsertInventory({
      id: inventoryData?.id ? inventoryData.id : ObjectID().toString(),
      employeeId: value.employeeId ?? "",
      quantity: value.quantity,
      status: value.status as Status,
      storeProductId: value.storeProductId,
    });
    if (response?.success) {
      toast({
        title: "Your entry has been saved.",
      });
      router.push("/dashboard/inventory");
      router.refresh();
    }
    if (response?.error) {
      toast({
        variant: "destructive",
        title: "Oppse!",
        description: "could not create your entry, please try again later",
      });
    }
  };

  const handleDeleteQuotation = async () => {
    // setDeletingQuotation(true);
    // if (!quotationData?.id) return;
    // const response = await deleteQuotation(quotationData?.id);
    // setDeletingQuotation(false);
    // if (response?.success) {
    //   router.push("/dashboard/quotations");
    //   router.refresh();
    //   return toast({
    //     title: "Your Quotation has been deleted.",
    //   });
    // }
    // if (response?.error) {
    //   return toast({
    //     variant: "destructive",
    //     title: "Oppse!",
    //     description: "could not delete your quotation",
    //   });
    // }
  };
  return (
    <AlertDialog>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Inventory Information</CardTitle>
          <CardDescription>
            Lets create a stock entry for your business. You can edit this
            transaction later.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="flex flex-col gap-4 "
            >
              {products?.success && (
                <div className="flex md:flex-row gap-4 items-end">
                  {/* <FormField
                    disabled={isLoading}
                    control={form.control}
                    name="storeProductId"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Product Id</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a product for inventory" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {products.success.map((product) => {
                                return (
                                  <SelectItem
                                    key={product.id}
                                    value={product.StoreProductId}
                                  >
                                    <div className="flex items-center gap-4">
                                      <span>{product.StoreProductId}</span>
                                      <span>|</span>
                                      <span>{product.name}</span>
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
                  ></FormField> */}
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
              )}
              <div className="flex md:flex-row gap-4 items-end">
                {employee.length > 0 && (
                  // <FormField
                  //   disabled={isLoading}
                  //   control={form.control}
                  //   name="employeeId"
                  //   render={({ field }) => (
                  //     <FormItem className="flex-1">
                  //       <FormLabel>Employee</FormLabel>
                  //       <FormControl>
                  //         <Select
                  //           onValueChange={field.onChange}
                  //           defaultValue={field.value}
                  //         >
                  //           <FormControl>
                  //             <SelectTrigger>
                  //               <SelectValue placeholder="Select an employee" />
                  //             </SelectTrigger>
                  //           </FormControl>
                  //           <SelectContent>
                  //             <SelectItem key={"null"} value={"null"}>
                  //               <div className="flex items-center gap-4">
                  //                 <span>{"-----null-----"}</span>
                  //               </div>
                  //             </SelectItem>
                  //             {employee.map((emplo) => {
                  //               return (
                  //                 <SelectItem key={emplo.id} value={emplo.id}>
                  //                   <div className="flex items-center gap-4">
                  //                     <span>{emplo.name}</span>
                  //                   </div>
                  //                 </SelectItem>
                  //               );
                  //             })}
                  //           </SelectContent>
                  //         </Select>
                  //       </FormControl>
                  //       <FormMessage></FormMessage>
                  //     </FormItem>
                  //   )}
                  // ></FormField>
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
              </div>

              {/* ////////////////////////////////////////////////////////////////////////////////////////////////// */}

              {/* ////////////////////////////////////////////////////////////////////////////////////////////////// */}
              <Button
                type="submit"
                className="bg-exec hover:bg-exec/90"
                disabled={isLoading}
              >
                {isLoading ? <Loading /> : "Save Inventory Information"}
              </Button>
            </form>
          </Form>
          {/* {inventoryData?.id && (
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
                  disabled={isLoading || deletingQuotation}
                  className="text-red-600 p-2 text-center mt-2 rounded-md hover:bg-red-600 hover:text-white whitespace-nowrap"
                >
                  {deletingQuotation ? "Deleting..." : "Delete Inventory"}
                </AlertDialogTrigger>
              </div>
            </>
          )} */}
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
                disabled={deletingQuotation}
                className="bg-destructive hover:bg-destructive"
                onClick={handleDeleteQuotation}
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

export default InventoryForm;
