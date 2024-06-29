"use client";

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
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useGetCustomersForSelect } from "@/data/get-customers-for-select";
import clsx from "clsx";
import { CalendarIcon, Plus } from "lucide-react";
import { FC, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import CustomerForm from "../Customers/CustomerForm";
import {
  OrderCreationRequest,
  OrderValidator,
} from "@/lib/Validators/OrderValidator";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { addDays, format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { useGetOrderNumber } from "@/data/get-order-number";
import { OrderForDashboard } from "@/lib/types";
import ObjectID from "bson-objectid";
import { useGetProductsForSelect } from "@/data/get-products-for-select";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { upsertOrder } from "@/lib/queries";
import SupplyForm from "./SupplyForm";

interface OrderFormProps {
  orderData?: OrderForDashboard;
  isEdit?: boolean;
}

const OrderForm: FC<OrderFormProps> = ({ orderData, isEdit }) => {
  const router = useRouter();

  const { data: orderNumber, isFetching } = useGetOrderNumber();
  const { data: customers } = useGetCustomersForSelect();
  const { data: products } = useGetProductsForSelect();

  const [customerForm, setCustomerForm] = useState(false);
  const [date, setDate] = useState<Date | undefined>(
    orderData?.poDate ? orderData.poDate : new Date()
  );

  // console.log({ orderData });

  const form = useForm<OrderCreationRequest>({
    resolver: zodResolver(OrderValidator),
    defaultValues: {
      id: orderData?.id ? orderData.id : ObjectID().toString(),
      customerId: orderData?.customerId ? orderData.customerId : "",
      notes: orderData?.notes ? orderData.notes : "",
      orderNumber: orderData?.orderNumber
        ? orderData.orderNumber
        : orderNumber?.success
        ? Number(orderNumber.success.orderNumber + 1)
        : 1,
      poDate: orderData?.poDate ? orderData.poDate : new Date(),
      poNumber: orderData?.poNumber ? orderData.poNumber : "",
      ProductInOrder:
        orderData?.ProductInOrder && orderData.ProductInOrder.length > 0
          ? orderData.ProductInOrder.sort((a, b) =>
              a.index ? a.index : 0 > (b.index ? b.index : 1) ? 1 : -1
            ).map((item) => {
              return {
                certificateNumber: item.certificateNumber
                  ? item.certificateNumber
                  : "",
                index: item.index ? item.index : 0,
                description: item.description ? item.description : "",
                price: item.price ? item.price : 0,
                productId: item.productId ? item.productId : "",
                quantity: item.quantity ? item.quantity : 0,
                supplied: item.supplied ? item.supplied : 0,
                id: item.id ? item.id : ObjectID().toString(),
              };
            })
          : [
              {
                certificateNumber: "",
                description: "",
                index: 0,
                id: ObjectID().toString(),
                price: 0,
                productId: "",
                quantity: 0,
                supplied: 0,
              },
            ],
      quotationNumber: orderData?.quotationNumber
        ? orderData.quotationNumber
        : "",
      status: orderData?.status ? orderData.status : "PENDING",
    },
  });
  const isLoading = form.formState.isLoading;

  const { fields, append, remove } = useFieldArray({
    name: "ProductInOrder",
    control: form.control,
  });

  const handleSubmit = async (value: OrderCreationRequest) => {
    console.log(value);
    if (!value.customerId) {
      return toast({
        variant: "destructive",
        title: "Oppse!",
        description: "Please Select Customer to submit the form.",
      });
    } else if (value.ProductInOrder.length > 0) {
      value.ProductInOrder.map((item) => {
        if (!item.productId) {
          return toast({
            variant: "destructive",
            title: "Oppse!",
            description: "Please Select Product to submit the form.",
          });
        }
      });
    }

    const response = await upsertOrder({
      customerId: value.customerId,
      id: orderData?.id ? orderData.id : ObjectID().toString(),
      notes: value.notes,
      orderNumber: value.orderNumber,
      poDate: date,
      poNumber: value.poNumber,
      quotationNumber: value.quotationNumber,
      status: value.status,
      // @ts-ignore
      ProductInOrder: value.ProductInOrder,
    });
    if (response?.success) {
      toast({
        title: "Your Order has been created.",
      });

      router.push("/dashboard/orders");
      router.refresh();
    }
    if (response?.error) {
      toast({
        variant: "destructive",
        title: "Oppse!",
        description: "could not create your order",
      });
    }
  };
  return (
    <AlertDialog>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Order Information</CardTitle>
          <CardDescription>
            Lets create a order for your business. You can edit order later from
            the order settings tab.
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
                <div className="flex md:flex-row gap-4 items-end">
                  <FormField
                    disabled={isLoading}
                    control={form.control}
                    name="customerId"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Category Name</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a customer for quotation" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {customers.success.map((customer) => {
                                return (
                                  <SelectItem
                                    key={customer.id}
                                    value={customer.id}
                                  >
                                    {customer.name}
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
                  <Button
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
                <FormField
                  disabled={isLoading || isFetching}
                  control={form.control}
                  name="orderNumber"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Order Number</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="ExOr-123"
                          {...field}
                        ></Input>
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                ></FormField>
                {/* ////////////////////////////////////////////////////////////////////////////////////////////////// purchase order Number */}

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
                              <SelectValue placeholder="Select a gst for quotation" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem key={"PENDING"} value={"PENDING"}>
                              PENDING
                            </SelectItem>
                            <SelectItem key={"COMPLETED"} value={"COMPLETED"}>
                              COMPLETED
                            </SelectItem>
                            <SelectItem
                              key={"PARTIAL_COMPLETED"}
                              value={"PARTIAL_COMPLETED"}
                            >
                              PARTIAL_COMPLETED
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
                  name="quotationNumber"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Quoation Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Quotation Number for reference "
                          {...field}
                        ></Input>
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
                  name="notes"
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
                <h1>Order Items</h1>
              </div>

              {/* ////////////////////////////////////////////////////////////////////////////////////////////////// */}
              {fields.map((field, index) => {
                form.setValue(`ProductInOrder.${index}.index`, index + 1);
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
                        <FormField
                          disabled={isLoading}
                          control={form.control}
                          name={`ProductInOrder.${index}.productId`}
                          render={({ field }) => (
                            <FormItem className="col-span-2">
                              <FormLabel>Product</FormLabel>
                              <FormControl>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="Select product for quotation" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {products?.success.map((product) => {
                                      return (
                                        <SelectItem
                                          key={product.id}
                                          value={product.id}
                                        >
                                          {product.name}
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
                      )}
                      <FormField
                        disabled={isLoading}
                        control={form.control}
                        name={`ProductInOrder.${index}.description`}
                        render={({ field }) => (
                          <FormItem className="flex-1 col-span-1">
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
                        name={`ProductInOrder.${index}.certificateNumber`}
                        render={({ field }) => (
                          <FormItem className="flex-1 col-span-1">
                            <FormLabel>Certificate Number</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Certificate Number"
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
                        name={`ProductInOrder.${index}.price`}
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
                        {...form.register(`ProductInOrder.${index}.index`)}
                        // type="hidden"
                        type="number"
                        placeholder="Ratings"
                        value={index + 1}
                      ></Input>
                      <FormField
                        disabled={isLoading}
                        control={form.control}
                        name={`ProductInOrder.${index}.quantity`}
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

                      {/* <SupplyForm
                        field={field}
                        productName={
                          products?.success?.filter(
                            (id) => id.id === field.productId
                          )[0].name as string
                        }
                      ></SupplyForm> */}

                      {/* /////////////////////////////////////////////////////////////////////////////////// */}
                      {/* /////////////////////////////////////////////////////////////////////////////////// */}
                      {/* /////////////////////////////////////////////////////////////////////////////////// */}
                      {/* /////////////////////////////////////////////////////////////////////////////////// */}
                      {/* /////////////////////////////////////////////////////////////////////////////////// */}
                      {/* /////////////////////////////////////////////////////////////////////////////////// */}
                      {/* /////////////////////////////////////////////////////////////////////////////////// */}

                      {/* <FormField
                        disabled={isLoading}
                        control={form.control}
                        name={`ProductInOrder.${index}.supplied`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Supplied</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Supplied"
                                {...field}
                              ></Input>
                            </FormControl>
                            <FormMessage></FormMessage>
                          </FormItem>
                        )}
                      ></FormField> */}
                      <div className="flex items-center gap-2 col-span-2">
                        <Button
                          type="button"
                          className="w-full"
                          onClick={() => {
                            append({
                              price: 0,
                              productId: "",
                              quantity: 0,
                              supplied: 0,
                              index: 0,
                              certificateNumber: "",
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
          {/* {orderData?.id && (
            <>
              <div className="flex flex-row items-center justify-between rounded-lg border border-destructive gap-4 p-4 mt-4">
                <div className="">
                  <div className="">Danger Zone</div>
                </div>
                <div className="text-muted-foreground">
                  Deleting your order cannot be undone.{" "}
                </div>
                <AlertDialogTrigger
                  disabled={isLoading || deletingQuotation}
                  className="text-red-600 p-2 text-center mt-2 rounded-md hover:bg-red-600 hover:text-white whitespace-nowrap"
                >
                  {dele ? "Deleting..." : "Delete Quotation"}
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
              {/* <AlertDialogAction
                disabled={deletingQuotation}
                className="bg-destructive hover:bg-destructive"
                onClick={handleDeleteQuotation}
              >
                Delete
              </AlertDialogAction> */}
            </AlertDialogFooter>
          </AlertDialogContent>
        </CardContent>
      </Card>
    </AlertDialog>
  );
};

export default OrderForm;
