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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { useGetPerfomaNumber } from "@/data/get-perfoma-number";
import { upsertPerfomaInvoice } from "@/lib/queries";
import { OrderInvoice } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  PerfomaInvoiceCreationSchema,
  PerfomaInvoiceCreationSchemaRequest,
} from "@/lib/Validators";
import { zodResolver } from "@hookform/resolvers/zod";
import ObjectID from "bson-objectid";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC } from "react";
import { useForm } from "react-hook-form";

interface PerfomaProductFormProps {
  id: string[];
  order: OrderInvoice;
  remainingQuantity: { [x: string]: number };
}

const PerfomaProductForm: FC<PerfomaProductFormProps> = ({
  order,
  id,
  remainingQuantity,
}) => {
  const router = useRouter();
  const filtered = order.ProductInOrder.filter((value) => {
    return id.find((ids) => {
      return value.id === ids;
    });
  });

  const { data: perfomaNumber, isFetching } = useGetPerfomaNumber();

  const form = useForm<PerfomaInvoiceCreationSchemaRequest>({
    resolver: zodResolver(PerfomaInvoiceCreationSchema),
    defaultValues: {
      perfomaInvoiceNumber: perfomaNumber?.success
        ? perfomaNumber.success.perfomaInvoiceNumber
        : 1,
      perfomaInvoiceDate: new Date(),
      orderId: order.id,
      additionalNotes: "",
      paymentStatus: "PENDING",
      shippingCharges: 0,
      ProductInPerfomaInvoiceOfOrder: filtered.map((item) => {
        return {
          orderProductName: item.product.name ?? "",
          orderProductDescription: item.description ?? "",
          orderProductQuantity: item.quantity ?? 0,
          suppliedQuantity: 1,
          orderProductInOrderId: item.id ?? "",
        };
      }),
    },
  });

  form.setValue(
    "perfomaInvoiceNumber",
    perfomaNumber?.success ? perfomaNumber.success.perfomaInvoiceNumber + 1 : 1
  );
  const isLoading = form.formState.isLoading;

  const onSubmit = async (values: PerfomaInvoiceCreationSchemaRequest) => {
    values.id = ObjectID().toString();
    values.orderId = order.id;

    const response = await upsertPerfomaInvoice(values);

    if (response?.success) {
      toast({
        title: "Your Perfoma Invoice has been created.",
      });

      router.push("/dashboard/perfoma");
      router.refresh();
    } else if (response?.error) {
      toast({
        variant: "destructive",
        title: "Oppse!",
        description: "could not create your perfoma Invoice",
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
                  name={`perfomaInvoiceNumber`}
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel>Perfoma Invoice Number</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="ExPI-001"></Input>
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                ></FormField>
                <FormField
                  control={form.control}
                  name={`perfomaInvoiceDate`}
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Perfoma Invoice Date</FormLabel>
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

              <div className="grid grid-cols-2 gap-8 items-end">
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="paymentStatus"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Payment Status</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select payment status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem key={"PENDING"} value={"PENDING"}>
                              Pending
                            </SelectItem>
                            <SelectItem key={"RECEIVED"} value={"RECEIVED"}>
                              Received
                            </SelectItem>
                            <SelectItem key={"CANCELLED"} value={"CANCELLED"}>
                              Cancelled
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                ></FormField>
                <FormField
                  control={form.control}
                  name={`shippingCharges`}
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel>Shipping Charges(if any)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="ExPI-001"></Input>
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                ></FormField>
              </div>
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
              {filtered.map((item, index) => {
                form.setValue(
                  `ProductInPerfomaInvoiceOfOrder.${index}.orderProductName`,
                  item.product.name
                );
                form.setValue(
                  `ProductInPerfomaInvoiceOfOrder.${index}.orderProductDescription`,
                  item.description ?? ""
                );
                form.setValue(
                  `ProductInPerfomaInvoiceOfOrder.${index}.orderProductInOrderId`,
                  item.id
                );
                form.setValue(
                  `ProductInPerfomaInvoiceOfOrder.${index}.pendingQuantity`,
                  remainingQuantity[item.id]
                );
                return (
                  <div
                    key={item.id}
                    className="grid grid-cols-2 lg:grid-cols-11 gap-8 p-4 border border-black shadow-md rounded-md items-center"
                  >
                    <div className="">{index + 1}</div>
                    <div className="col-span-2">
                      <div className="flex flex-col items-center justify-center ">
                        <div className="text-center">{item.product.name}</div>
                        <div className="text-xs">{item.description}</div>
                        <div className="text-xs">
                          Pending Quantity: {remainingQuantity[item.id]}
                        </div>
                      </div>
                    </div>
                    <FormField
                      control={form.control}
                      name={`ProductInPerfomaInvoiceOfOrder.${index}.suppliedQuantity`}
                      render={({ field }) => (
                        <FormItem className="col-span-4">
                          <FormLabel>Supply Quantity</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="10"></Input>
                          </FormControl>
                          <FormMessage></FormMessage>
                        </FormItem>
                      )}
                    ></FormField>

                    <FormItem className="col-span-4">
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input
                          disabled
                          value={item.price}
                          placeholder="10"
                        ></Input>
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
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

export default PerfomaProductForm;
