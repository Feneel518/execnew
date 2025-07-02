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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/components/ui/use-toast";
import { upsertInvoice } from "@/lib/queries";
import { InvoiceEditType, OrderInvoice } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  InvoiceCreationSchema,
  InvoiceCreationSchemaRequest,
} from "@/lib/Validators";
import { zodResolver } from "@hookform/resolvers/zod";
import ObjectID from "bson-objectid";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { useRouter } from "next/navigation";
import { FC } from "react";
import { useForm } from "react-hook-form";

interface NewInvoiceProductFormProps {
  selectedProductIds: string[];
  order: OrderInvoice;
  remainingQuantity: { [x: string]: number };
  invoiceDetails?: InvoiceEditType;
}

const NewInvoiceProductForm: FC<NewInvoiceProductFormProps> = ({
  selectedProductIds,
  order,
  invoiceDetails,
  remainingQuantity,
}) => {
  const router = useRouter();

  const filtered = order.ProductInOrder.filter((value) => {
    return selectedProductIds.find((ids) => {
      return value.id === ids;
    });
  });

  const invoiceFilter = invoiceDetails?.ProductInInvoiceOfOrder.filter(
    (value) => {
      return selectedProductIds.find((ids) => {
        return value.productInOrderId === ids;
      });
    }
  );

  const form = useForm<InvoiceCreationSchemaRequest>({
    resolver: zodResolver(InvoiceCreationSchema),
    defaultValues: {
      id: invoiceDetails?.id,
      invoiceDate: invoiceDetails?.invoiceDate,
      invoiceNumber: invoiceDetails?.invoiceNumber,
      LrNumber: invoiceDetails?.LrNumber ?? "",
      LrUrl: invoiceDetails?.LrUrl ?? "",
      orderId: invoiceDetails?.orderId,
      transportName: invoiceDetails?.transportName ?? "",
      items: invoiceDetails?.ProductInInvoiceOfOrder.map((product) => {
        return {
          certificateNumber: product.certificateNumber ?? "",
          id: product.id ?? ObjectID().toString(),
          numberOfBoxes: product.numberOfBoxes ?? 0,
          orderProductInOrderId: product.productInOrderId ?? "",
          orderProductDescription: product.ProductInOrder.description ?? "",
          orderProductName: product.ProductInOrder.product.name ?? "",
          orderProductQuantity: product.ProductInOrder.quantity ?? 0,
          pendingQuantity: remainingQuantity[product.productInOrderId] ?? 0,
          suppliedQuantity: product.supplidQuantity ?? 0,
          typeNumber: product.typeNumber ?? "",
        };
      }),
    },
  });
  const isLoading = form.formState.isLoading;

  const onSubmit = async (values: InvoiceCreationSchemaRequest) => {
    values.id = invoiceDetails ? invoiceDetails.id : ObjectID().toString();
    values.orderId = order.id;

    const response = await upsertInvoice(values);

    if (response?.success) {
      toast({
        title: "Your Invoice has been created.",
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
              <div className="grid grid-cols-2 gap-8 items-end">
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
              {invoiceFilter
                ? invoiceFilter.map((product, index) => {
                    form.setValue(
                      `items.${index}.orderProductName`,
                      product.ProductInOrder.product.name
                    );
                    form.setValue(
                      `items.${index}.orderProductDescription`,
                      product.ProductInOrder.description ?? ""
                    );
                    form.setValue(
                      `items.${index}.orderProductQuantity`,
                      product.ProductInOrder.quantity
                    );
                    form.setValue(
                      `items.${index}.orderProductInOrderId`,
                      product.productInOrderId
                    );
                    form.setValue(
                      `items.${index}.pendingQuantity`,
                      remainingQuantity[product.productInOrderId]
                    );
                    return (
                      <div
                        key={product.id}
                        className="grid grid-cols-2 lg:grid-cols-6 gap-8 p-4 border border-black shadow-md rounded-md products-start"
                      >
                        <div className="col-span-6">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <div className="">
                              {index + 1} {product.ProductInOrder.product.name}
                            </div>
                            <div className="">
                              {product.ProductInOrder.description}
                            </div>
                            <div className="">
                              Pending Quantity:{" "}
                              {remainingQuantity[product.productInOrderId]}
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
                                <Input
                                  {...field}
                                  placeholder="EXEC-L-40"
                                ></Input>
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
                  })
                : filtered.map((product, index) => {
                    form.setValue(
                      `items.${index}.orderProductName`,
                      product.product.name
                    );
                    form.setValue(
                      `items.${index}.orderProductDescription`,
                      product.description ?? ""
                    );
                    form.setValue(
                      `items.${index}.orderProductQuantity`,
                      product.quantity
                    );
                    form.setValue(
                      `items.${index}.orderProductInOrderId`,
                      product.id
                    );
                    form.setValue(
                      `items.${index}.pendingQuantity`,
                      remainingQuantity[product.id]
                    );
                    return (
                      <div
                        key={product.id}
                        className="grid grid-cols-2 lg:grid-cols-6 gap-8 p-4 border border-black shadow-md rounded-md products-start"
                      >
                        <div className="col-span-6">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <div className="">
                              {index + 1} {product.product.name}
                            </div>
                            <div className="">{product.description}</div>
                            <div className="">
                              Pending Quantity: {remainingQuantity[product.id]}
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
                                <Input
                                  {...field}
                                  placeholder="EXEC-L-40"
                                ></Input>
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
              <Button type="submit">
                {isLoading ? "Creating Invoice" : "Create invoice"}
              </Button>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default NewInvoiceProductForm;
