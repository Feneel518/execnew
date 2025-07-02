"use client";

import { toast } from "@/components/ui/use-toast";
import { useGetCustomersForSelect } from "@/data/get-customers-for-select";
import { useGetProductsForSelect } from "@/data/get-products-for-select";
import { useGetChallanNumber } from "@/data/use-get-challan-number";
import {
  ChallanCreationRequest,
  ChallanValidator,
} from "@/lib/Validators/ChallanValidator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CustomerForm from "../Customers/CustomerForm";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import SelectProduct from "../Quotations/SelectProduct";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Plus } from "lucide-react";
import clsx from "clsx";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { addDays, format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import Loading from "@/components/Global/Loading";
import ObjectID from "bson-objectid";
import { deleteChallan, upsertChallan } from "@/lib/queries";
import { ChallanType } from "@/lib/types";

interface ChallanFormProps {
  challan?: ChallanType;
}

const ChallanForm: FC<ChallanFormProps> = ({ challan }) => {
  const router = useRouter();

  const { data: challanNumber, isFetching } = useGetChallanNumber();
  const { data: customers } = useGetCustomersForSelect();
  const { data: products } = useGetProductsForSelect();
  const [deletingChallan, setDeletingChallan] = useState(false);

  const [customerForm, setCustomerForm] = useState(false);
  const [date, setDate] = useState<Date | undefined>();
  const [challanDate, setChallanDate] = useState<Date | undefined>();
  // challanData?.poDate ? orderData.poDate : new Date()

  //

  const form = useForm<ChallanCreationRequest>({
    resolver: zodResolver(ChallanValidator),
    defaultValues: {
      additionalNotes: challan?.additionalNotes ?? "",
      causeOfChallan: challan?.causeOfChallan ?? "AS_PER_SAMPLE",
      challanNumber: challan?.challanNumber
        ? challan.challanNumber
        : challanNumber?.success
        ? Number(challanNumber.success.challanNumber + 1)
        : 1,
      customerId: challan?.customerId ?? "",
      id: challan?.id ?? ObjectID().toString(),
      poDate: challan?.poDate ?? new Date(),
      challanDate: challan?.challanDate ?? new Date(),
      poNumber: challan?.poNumber ?? "",
      status: challan?.status ?? "OPEN",
      ProductInChallan: challan?.ProductInChallan
        ? challan?.ProductInChallan.length > 0
          ? challan?.ProductInChallan.map((product) => {
              return {
                description: product.description ?? "",
                id: product.id,
                index: product.index ? product.index : 0,
                price: product.price,
                productId: product.productId,
                quantity: Number(product.quantity),
              };
            })
          : [
              {
                description: "",
                index: 0,
                price: 0,
                productId: ObjectID().toString(),
                quantity: 0,
              },
            ]
        : [
            {
              description: "",
              index: 0,
              price: 0,
              productId: ObjectID().toString(),
              quantity: 0,
            },
          ],
    },
  });
  const isLoading = form.formState.isLoading;

  const { fields, append, remove } = useFieldArray({
    name: "ProductInChallan",
    control: form.control,
  });

  form.setValue(
    "challanNumber",
    challan?.challanNumber
      ? challan.challanNumber
      : challanNumber?.success
      ? Number(challanNumber.success.challanNumber + 1)
      : 1
  );

  const handleSubmit = async (value: ChallanCreationRequest) => {
    if (!value.customerId) {
      return toast({
        variant: "destructive",
        title: "Oppse!",
        description: "Please Select Customer to submit the form.",
      });
    } else if (value.ProductInChallan.length > 0) {
      value.ProductInChallan.map((item) => {
        if (!item.productId) {
          return toast({
            variant: "destructive",
            title: "Oppse!",
            description: "Please Select Product to submit the form.",
          });
        }
      });
    }

    const response = await upsertChallan({
      customerId: value.customerId,
      id: challan?.id ?? ObjectID().toString(),
      additionalNotes: value.additionalNotes,
      challanNumber: value.challanNumber,
      poDate: date,
      poNumber: value.poNumber,
      causeOfChallan: value.causeOfChallan,
      challanDate: challanDate,
      status: value.status,
      ProductInChallan: value.ProductInChallan,
    });
    if (response?.success) {
      toast({
        title: "Your Challan has been saved.",
      });

      router.push("/dashboard/delivery-challan");
      router.refresh();
    }
    if (response?.error) {
      toast({
        variant: "destructive",
        title: "Oppse!",
        description: "could not save your challan",
      });
    }
  };

  const handleDeleteChallan = async () => {
    setDeletingChallan(true);
    if (!challan?.id) return;
    const response = await deleteChallan(challan?.id);
    setDeletingChallan(false);
    if (response?.success) {
      router.push("/dashboard/delivery-challan");
      router.refresh();
      return toast({
        title: "Your Challan has been deleted.",
      });
    }
    if (response?.error) {
      return toast({
        variant: "destructive",
        title: "Oppse!",
        description: "could not delete your challan",
      });
    }
  };

  return (
    <AlertDialog>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Delivery Challan Information</CardTitle>
          <CardDescription>
            Lets create a challan for your business. You can edit challan later
            from the order settings tab.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {customerForm && (
            <CustomerForm
              isQuotationPage={true}
              onSubmit={() => setCustomerForm(false)}
            ></CustomerForm>
          )}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="flex flex-col gap-4 "
            >
              {customers?.success && (
                <div className="flex md:flex-grow gap-4 items-end">
                  <SelectProduct
                    labelText={"Client"}
                    setValueAsText="customerId"
                    products={customers.success}
                    productId={form.watch("customerId")}
                    setProductId={form.setValue}
                    className={"w-full"}
                  ></SelectProduct>
                  <Button
                    type="button"
                    onClick={() => setCustomerForm(!customerForm)}
                    className="flex items-center gap-2"
                  >
                    <Plus
                      className={clsx("transition-all", {
                        "rotate-45": customerForm,
                      })}
                    ></Plus>{" "}
                    {customerForm ? "Cancel" : "Customer"}
                  </Button>
                </div>
              )}

              {/* ////////////////////////////////////////////////////////////////////////////////////////////////// */}

              {/* ////////////////////////////////////////////////////////////////////////////////////////////////// order Number */}

              <div className="flex md:flex-row gap-4 items-end">
                {/* challan Number */}
                <FormField
                  disabled={isLoading || isFetching}
                  control={form.control}
                  name="challanNumber"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Delivery Challan Number</FormLabel>
                      <FormControl>
                        <Input
                          disabled={!!challan?.challanNumber}
                          type="number"
                          placeholder="ExCH-123"
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
                  name="challanDate"
                  render={({ field }) => (
                    <FormItem className="flex-1 ">
                      <FormLabel>Challan Date</FormLabel>
                      <FormControl>
                        <div className="">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !challanDate && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {challanDate ? (
                                  format(challanDate, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
                              <Select
                                onValueChange={(value) =>
                                  setChallanDate(
                                    addDays(new Date(), parseInt(value))
                                  )
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent position="popper">
                                  <SelectItem value="0">Today</SelectItem>
                                  <SelectItem value="1">Tomorrow</SelectItem>
                                  <SelectItem value="3">In 3 days</SelectItem>
                                  <SelectItem value="7">In a week</SelectItem>
                                  <SelectItem value="14">
                                    In two week
                                  </SelectItem>
                                  <SelectItem value="21">
                                    In three week
                                  </SelectItem>
                                  <SelectItem value="28">
                                    In four week
                                  </SelectItem>
                                  <SelectItem value="35">
                                    In five week
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <div className="rounded-md border w-full">
                                <Calendar
                                  className=""
                                  mode="single"
                                  selected={challanDate}
                                  onSelect={setChallanDate}
                                />
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                ></FormField>
                {/* ////////////////////////////////////////////////////////////////////////////////////////////////// purchase order Number */}

                {/* PO NNumber */}
                <FormField
                  control={form.control}
                  name="poNumber"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Purchase Order Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Purchase Order number"
                          {...field}
                        ></Input>
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                ></FormField>

                {/* ////////////////////////////////////////////////////////////////////////////////////////////////// purchase order Date */}
                {/* PO Date */}
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="poDate"
                  render={({ field }) => (
                    <FormItem className="flex-1 ">
                      <FormLabel>Purchase Order Date</FormLabel>
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
                              <Select
                                onValueChange={(value) =>
                                  setDate(addDays(new Date(), parseInt(value)))
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent position="popper">
                                  <SelectItem value="0">Today</SelectItem>
                                  <SelectItem value="1">Tomorrow</SelectItem>
                                  <SelectItem value="3">In 3 days</SelectItem>
                                  <SelectItem value="7">In a week</SelectItem>
                                  <SelectItem value="14">
                                    In two week
                                  </SelectItem>
                                  <SelectItem value="21">
                                    In three week
                                  </SelectItem>
                                  <SelectItem value="28">
                                    In four week
                                  </SelectItem>
                                  <SelectItem value="35">
                                    In five week
                                  </SelectItem>
                                </SelectContent>
                              </Select>
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
                ></FormField>
              </div>

              {/* ////////////////////////////////////////////////////////////////////////////////////////////////// status*/}

              <div className="flex md:flex-row gap-4 items-end">
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
                              <SelectValue placeholder="Select the status of the challan" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem key={"OPEN"} value={"OPEN"}>
                              Open
                            </SelectItem>
                            <SelectItem key={"CLOSE"} value={"CLOSE"}>
                              Close
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                ></FormField>

                {/* ////////////////////////////////////////////////////////////////////////////////////////////////// Quotation Number*/}
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="causeOfChallan"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Challan Options</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select the option for the challan" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem
                              key={"AS_PER_SAMPLE"}
                              value={"AS_PER_SAMPLE"}
                            >
                              As per Sample
                            </SelectItem>
                            <SelectItem
                              key={"FOR_REPLACEMENT"}
                              value={"FOR_REPLACEMENT"}
                            >
                              For Replacement
                            </SelectItem>
                            <SelectItem key={"RETURNABLE"} value={"RETURNABLE"}>
                              As Returnable
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                ></FormField>
              </div>

              {/* //////////////////////////////////////////////////////////////////////////////////////////////////  additional Notes*/}

              <div className="flex md:flex-row gap-4 items-end">
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="additionalNotes"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Additional Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Additional Notes"
                          {...field}
                        ></Textarea>
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                ></FormField>
              </div>

              {/* ////////////////////////////////////////////////////////////////////////////////////////////////// */}

              <Separator className="my-8"></Separator>
              <div className="flex flex-col  gap-4  ">
                <h1>Challan Items</h1>
              </div>

              {/* ////////////////////////////////////////////////////////////////////////////////////////////////// */}
              {fields.map((field, index) => {
                form.setValue(`ProductInChallan.${index}.index`, index + 1);
                const productId = form.watch(
                  `ProductInChallan.${index}.productId`
                );
                return (
                  <div
                    key={field.id}
                    className="flex flex-col gap-4 border p-4 py-8 border-black shadow-md"
                  >
                    <h2 className="underline underline-offset-4">
                      Product {index + 1}
                    </h2>

                    <div className="grid lg:grid-cols-4 grid-cols-2 gap-4 items-end  ">
                      {products?.success && (
                        <div className="col-span-2">
                          <SelectProduct
                            labelText="Select Product"
                            setValueAsText={`ProductInChallan.${index}.productId`}
                            products={products.success}
                            setProductId={form.setValue}
                            productId={productId}
                          ></SelectProduct>
                        </div>
                      )}
                      {/* description */}
                      <FormField
                        disabled={isLoading}
                        control={form.control}
                        name={`ProductInChallan.${index}.description`}
                        render={({ field }) => (
                          <FormItem className="flex-1 col-span-2">
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Description"
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
                        name={`ProductInChallan.${index}.quantity`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Quantity</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Quantity"
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
                        name={`ProductInChallan.${index}.price`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Price</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Price"
                                {...field}
                              ></Input>
                            </FormControl>
                            <FormMessage></FormMessage>
                          </FormItem>
                        )}
                      ></FormField>
                      <Input
                        className="hidden"
                        readOnly
                        {...form.register(`ProductInChallan.${index}.index`)}
                        // type="hidden"
                        type="number"
                        placeholder="Ratings"
                        value={index + 1}
                      ></Input>

                      <div className="flex items-center gap-2 col-span-2">
                        <Button
                          type="button"
                          className="w-full"
                          onClick={() => {
                            append({
                              price: 0,
                              productId: "",
                              quantity: 0,
                              index: 0,
                              description: "",
                              id: "",
                            });
                          }}
                        >
                          Add new Product
                        </Button>
                        {index > 0 && (
                          <Button onClick={() => remove(index)} type="button">
                            -
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <Button
                type="submit"
                className="bg-exec hover:bg-exec/90"
                disabled={isLoading}
              >
                {isLoading ? <Loading /> : "Save Order Information"}
              </Button>
            </form>
          </Form>
          {challan?.id && (
            <>
              <div className="flex bg-red-50 flex-row items-center justify-between rounded-lg border border-destructive gap-4 p-4 mt-4">
                <div className="">
                  <div className="">Danger Zone</div>
                </div>
                <div className="text-muted-foreground">
                  Deleting your challan cannot be undone.
                </div>
                <AlertDialogTrigger
                  disabled={isLoading || deletingChallan}
                  className="text-red-600 p-2 text-center mt-2 rounded-md hover:bg-red-600 hover:text-white whitespace-nowrap"
                >
                  {deletingChallan ? "Deleting..." : "Delete Challan"}
                </AlertDialogTrigger>
              </div>
            </>
          )}
          <AlertDialogContent className="w-[50%]">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-left">
                Are you absolutely sure?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-left">
                This action cannot be undone. This will permanently delete the
                Quotation {challan?.challanNumber}.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex items-center">
              <AlertDialogCancel className="mb-2">Cancel</AlertDialogCancel>
              <AlertDialogAction
                disabled={deletingChallan}
                className="bg-destructive hover:bg-destructive"
                onClick={handleDeleteChallan}
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

export default ChallanForm;
