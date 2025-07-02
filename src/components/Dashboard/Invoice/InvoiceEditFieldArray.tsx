"use client";

import { InvoiceEditType } from "@/lib/types";
import FileUpload from "@/components/Global/FileUpload";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/components/ui/use-toast";
import {
  InvoiceCreationSchema,
  InvoiceCreationSchemaRequest,
} from "@/lib/Validators";
import { editInvoice, upsertInvoice } from "@/lib/queries";
import { OrderInvoice } from "@/lib/types";
import { calculateRemainingQuantities, cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import ObjectID from "bson-objectid";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { FC } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

interface InvoiceEditFieldArrayProps {
  invoice: InvoiceEditType;
  remainingQuantity: { [x: string]: number };
}

const InvoiceEditFieldArray: FC<InvoiceEditFieldArrayProps> = ({
  invoice,
  remainingQuantity,
}) => {
  const router = useRouter();

  const form = useForm<InvoiceCreationSchemaRequest>({
    resolver: zodResolver(InvoiceCreationSchema),
    defaultValues: {
      invoiceNumber: invoice.invoiceNumber,
      invoiceDate: invoice.invoiceDate,
      LrNumber: invoice.LrNumber ?? "",
      LrUrl: invoice.LrUrl ?? "",
      transportName: invoice.transportName ?? "",
      orderId: invoice.orderId,
      items: invoice.ProductInInvoiceOfOrder.map((item) => {
        return {
          id: item.id,
          orderProductName: item.ProductInOrder.product.name ?? "",
          orderProductDescription: item.ProductInOrder.description ?? "",
          orderProductQuantity: item.ProductInOrder.quantity ?? 0,
          suppliedQuantity: item.supplidQuantity,
          certificateNumber: item.certificateNumber ?? "",
          typeNumber: item.typeNumber ?? "",
          numberOfBoxes: item.numberOfBoxes ?? 0,
          orderProductInOrderId: item.id ?? "",
        };
      }),
    },
  });
  const isLoading = form.formState.isLoading;

  const onSubmit = async (values: InvoiceCreationSchemaRequest) => {
    values.id = invoice.id;
    values.orderId = invoice.orderId;

    const response = await editInvoice(values);

    if (response?.success) {
      toast({
        title: "Your Invoice has been updated.",
      });

      router.push("/dashboard/invoice");
      router.refresh();
    } else if (response?.error) {
      toast({
        variant: "destructive",
        title: "Oppse!",
        description: "could not create your invoice",
      });
    }
  };
  return (
    <div className="mt-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="p-2 py-8">
            <CardContent className="flex flex-col gap-8 ">
              <div className="">
                {/* <h1 className="text-3xl">{invoice.order.customer.name}</h1> */}
                <div className={`w-full  flex justify-between pb-4 border-b`}>
                  <div className={`flex flex-col  gap-2 `}>
                    <h1 className="text-3xl leading-tight">
                      {invoice.order.customer.name}
                    </h1>

                    <div className="">
                      {/* Change its name */}
                      {/* <h1 className="text-lg leading-tight">{customerDetails.name}</h1> */}
                      <p className="text-xs">
                        {invoice.order.customer.addressLine1}
                      </p>
                      <p className="text-xs">
                        {invoice.order.customer.state},{" "}
                        {invoice.order.customer.pincode}
                      </p>
                      {invoice.order.customer.GST && (
                        <p className="text-xs">{invoice.order.customer.GST}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right flex flex-col justify-between">
                    <div className="">
                      {invoice.order.poNumber && (
                        <h3 className="">
                          PO Number: <strong>{invoice.order.poNumber} </strong>
                        </h3>
                      )}
                      {invoice.order.poDate && (
                        <h3 className="">
                          PO Date:{" "}
                          <strong>
                            {format(invoice.order.poDate as Date, "PP")}
                          </strong>
                        </h3>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-8 items-end">
                {/* Invoice Number */}
                <FormField
                  control={form.control}
                  name={`invoiceNumber`}
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel>Invoice Number</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="24-25/123"></Input>
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                ></FormField>
                <FormField
                  control={form.control}
                  name={`invoiceDate`}
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Invoice Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
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
              </div>
              <div className="grid grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name={`transportName`}
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel>Transport Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Lalji Mulji"></Input>
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                ></FormField>{" "}
                <FormField
                  control={form.control}
                  name={`LrNumber`}
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel>Lr Number</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="123456"></Input>
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                ></FormField>
              </div>
              <FormField
                disabled={isLoading}
                control={form.control}
                name="LrUrl"
                render={({ field }) => (
                  <FormItem className="col-span-3">
                    <FormLabel>LR Copy</FormLabel>
                    <FormControl className="">
                      <FileUpload
                        apiEndPoint="LrUpload"
                        onChange={field.onChange}
                        value={field.value}
                      ></FileUpload>
                    </FormControl>
                    <FormMessage></FormMessage>
                  </FormItem>
                )}
              ></FormField>
              {invoice.ProductInInvoiceOfOrder.map((item, index) => {
                form.setValue(`items.${index}.id`, item.id);
                form.setValue(
                  `items.${index}.orderProductName`,
                  item.ProductInOrder.product.name
                );
                form.setValue(
                  `items.${index}.orderProductDescription`,
                  item.ProductInOrder.description ?? ""
                );
                form.setValue(
                  `items.${index}.orderProductQuantity`,
                  item.ProductInOrder.quantity
                );
                form.setValue(`items.${index}.orderProductInOrderId`, item.id);
                form.setValue(
                  `items.${index}.pendingQuantity`,
                  remainingQuantity[item.productInOrderId]
                );
                return (
                  <div
                    key={item.id}
                    className="grid grid-cols-2 lg:grid-cols-6 gap-8 p-4 border border-black shadow-md rounded-md items-start"
                  >
                    <div className="col-span-6">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="">
                          {index + 1} {item.ProductInOrder.product.name}
                        </div>
                        <div className="">
                          {item.ProductInOrder.description}
                        </div>
                        <div className="">
                          Pending Quantity:{" "}
                          {remainingQuantity[item.productInOrderId]}
                        </div>
                      </div>
                    </div>
                    <FormField
                      control={form.control}
                      name={`items.${index}.suppliedQuantity`}
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Supply Quantity</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="10"></Input>
                          </FormControl>
                          <FormMessage></FormMessage>
                        </FormItem>
                      )}
                    ></FormField>
                    <FormField
                      control={form.control}
                      name={`items.${index}.certificateNumber`}
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Certificate Number</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="CIMFR/TC/P/H 441"
                            ></Input>
                          </FormControl>
                          <FormMessage></FormMessage>
                        </FormItem>
                      )}
                    ></FormField>
                    <FormField
                      control={form.control}
                      name={`items.${index}.typeNumber`}
                      render={({ field }) => (
                        <FormItem className="col-span-1 max-lg:col-span-2">
                          <FormLabel>Type Number</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="EXEC-L-40"></Input>
                          </FormControl>
                          <FormMessage></FormMessage>
                        </FormItem>
                      )}
                    ></FormField>
                    <FormField
                      control={form.control}
                      name={`items.${index}.numberOfBoxes`}
                      render={({ field }) => (
                        <FormItem className="col-span-1 max-lg:col-span-2">
                          <FormLabel>Number of Boxes</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="10"></Input>
                          </FormControl>
                          <FormMessage></FormMessage>
                        </FormItem>
                      )}
                    ></FormField>
                  </div>
                );
              })}

              <Button type="submit">Submit</Button>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default InvoiceEditFieldArray;
