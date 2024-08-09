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
import { upsertInvoice } from "@/lib/queries";
import { OrderInvoice } from "@/lib/types";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import ObjectID from "bson-objectid";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC } from "react";
import { useFieldArray, useForm } from "react-hook-form";
interface InvoiceProductFormProps {
  id: string[];
  order: OrderInvoice;
  remainingQuantity: { [x: string]: number };
  invoice?: any;
}

const InvoiceProductForm: FC<InvoiceProductFormProps> = ({
  id,
  order,
  remainingQuantity,
}) => {
  const router = useRouter();
  const filtered = order.ProductInOrder.filter((value) => {
    return id.find((ids) => {
      return value.id === ids;
    });
  });

  const form = useForm<InvoiceCreationSchemaRequest>({
    resolver: zodResolver(InvoiceCreationSchema),
    defaultValues: {
      invoiceNumber: "",
      invoiceDate: new Date(),
      orderId: order.id,
      items: filtered.map((item) => {
        return {
          orderProductName: item.product.name ?? "",
          orderProductDescription: item.description ?? "",
          orderProductQuantity: item.quantity ?? 0,
          suppliedQuantity: 1,
          certificateNumber: "",
          typeNumber: "",
          numberOfBoxes: 1,
          orderProductInOrderId: item.id ?? "",
        };
      }),
    },
  });
  const isLoading = form.formState.isLoading;

  const onSubmit = async (values: InvoiceCreationSchemaRequest) => {
    values.id = ObjectID().toString();
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
              {filtered.map((item, index) => {
                form.setValue(
                  `items.${index}.orderProductName`,
                  item.product.name
                );
                form.setValue(
                  `items.${index}.orderProductDescription`,
                  item.description ?? ""
                );
                form.setValue(
                  `items.${index}.orderProductQuantity`,
                  item.quantity
                );
                form.setValue(`items.${index}.orderProductInOrderId`, item.id);
                form.setValue(
                  `items.${index}.pendingQuantity`,
                  remainingQuantity[item.id]
                );
                return (
                  <div
                    key={item.id}
                    className="grid grid-cols-2 lg:grid-cols-6 gap-8 p-4 border border-black shadow-md rounded-md items-start"
                  >
                    <div className="col-span-6">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="">
                          {index + 1} {item.product.name}
                        </div>
                        <div className="">{item.description}</div>
                        <div className="">
                          Pending Quantity: {remainingQuantity[item.id]}
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

export default InvoiceProductForm;
