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
import { toast } from "@/components/ui/use-toast";
import {
  QuotationCreationRequest,
  QuotationValidator,
} from "@/lib/Validators/QuotationValidator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useGetCustomersForSelect } from "@/data/get-customers-for-select";
import { useGetProductsForSelect } from "@/data/get-products-for-select";
import { useGetQuotationNumber } from "@/data/get-quotation-number";
import {
  gstOptions,
  packingCharges,
  paymentTerms,
  transportationPayment,
} from "@/lib/data";
import { deleteQuotation, upsertQuotation } from "@/lib/queries";
import { QuotationForDashboard } from "@/lib/types";
import axios from "axios";
import { default as ObjectId, default as ObjectID } from "bson-objectid";
import clsx from "clsx";
import { Plus } from "lucide-react";
import CustomerForm from "../Customers/CustomerForm";
import QuotationComponents from "./QuotationComponents";
import SelectProduct from "./SelectProduct";

interface QuotationFormProps {
  quotationData?: QuotationForDashboard;
}

const QuotationForm: FC<QuotationFormProps> = ({ quotationData }) => {
  // const quotationQueueEvents = new QueueEvents(quotationCreationName);
  const router = useRouter();

  const { data: customers } = useGetCustomersForSelect();
  const { data: products } = useGetProductsForSelect();
  const { data: quotationNumber, isFetching } = useGetQuotationNumber();

  const [deletingQuotation, setDeletingQuotation] = useState(false);
  const [customerForm, setCustomerForm] = useState(false);
  const [date, setDate] = useState<Date | undefined>(
    quotationData?.deliveryDate ? quotationData.deliveryDate : new Date()
  );

  // useEffect(() => {
  //   quotationData?.ProductInQuotation.sort((a, b) =>
  //     a.index > b.index ? 1 : -1
  //   );
  // }, [quotationData]);

  const form = useForm<QuotationCreationRequest>({
    resolver: zodResolver(QuotationValidator),
    // mode: "onChange",
    defaultValues: {
      customerId: quotationData?.customerId ? quotationData.customerId : "",
      additionalNotes: quotationData?.additionalNotes
        ? quotationData.additionalNotes
        : "",
      deliverDateNew: quotationData?.deliverDateNew
        ? quotationData.deliverDateNew
        : "4 Weeks",
      clientName: quotationData?.clientName ? quotationData.clientName : "",
      deliveryDate: quotationData?.deliveryDate
        ? quotationData.deliveryDate
        : new Date(),
      discount: quotationData?.discount ? quotationData.discount : "",
      gst: quotationData?.gst ? quotationData.gst : "CGST_SGST_18",
      packingCharges: quotationData?.packingCharges
        ? quotationData.packingCharges
        : "INCLUDED",
      paymentTerms: quotationData?.paymentTerms
        ? quotationData.paymentTerms
        : "ADVANCE",
      quotationNumber: quotationData?.quotationNumber
        ? quotationData.quotationNumber
        : quotationNumber?.success
        ? Number(quotationNumber.success.quotationNumber + 1)
        : 1,
      transportationPayment: quotationData?.transportationPayment
        ? quotationData.transportationPayment
        : "TO_PAY",

      items: quotationData?.ProductInQuotation
        ? quotationData.ProductInQuotation.length > 0
          ? quotationData.ProductInQuotation.map((com) => {
              return {
                id: com.id ? com.id : ObjectID().toString(),
                price: com.price ? com.price.toString() : "0",
                quantity: com.quantity ? com.quantity : "UR",
                index: com.index ? com.index : 0,
                cableEntry: com.cableEntry ? com.cableEntry : "",
                cutoutSize: com.cutoutSize ? com.cutoutSize : "",
                earting: com.earting ? com.earting : "",
                gasket: com.gasket ? com.gasket : "",
                glass: com.glass ? com.glass : "",
                hardware: com.hardware ? com.hardware : "",
                HorsePower: com.HorsePower ? com.HorsePower : "",
                hsnCode: com.hsnCode ? com.hsnCode : "",
                kW: com.kW ? com.kW : "",
                mounting: com.mounting ? com.mounting : "",
                plateSize: com.plateSize ? com.plateSize : "",
                poReferrence: com.poReferrence ? com.poReferrence : "",
                productId: com.productId ? com.productId : "",
                rating: com.rating ? com.rating : "",
                rpm: com.rpm ? com.rpm : "",
                size: com.size ? com.size : "",
                terminals: com.terminals ? com.terminals : "",
                typeNumber: com.typeNumber ? com.typeNumber : "",
                variant: com.variant ? com.variant : "",
                wireGuard: com.wireGuard ? com.wireGuard : "",
                components: com?.ComponentsOfProductInQuotation
                  ? com.ComponentsOfProductInQuotation.length > 0
                    ? com?.ComponentsOfProductInQuotation.map((coms) => {
                        return {
                          compId: coms.componentsOfQuotation.id,
                          items: coms.componentsOfQuotation.item,
                        };
                      })
                    : [{ items: "" }]
                  : [{ items: "" }],
              };
            })
          : [
              {
                id: ObjectID().toString(),
                price: "0",
                index: 0,
                quantity: "UR",
                cableEntry: "",
                cutoutSize: "",
                earting: "",
                gasket: "",
                glass: "",
                hardware: "",
                HorsePower: "",
                hsnCode: "",
                kW: "",
                mounting: "",
                plateSize: "",
                poReferrence: "",
                productId: "",
                rating: "",
                rpm: "",
                size: "",
                terminals: "",
                typeNumber: "",
                variant: "",
                wireGuard: "",
                components: [
                  {
                    compId: "",
                    items: "",
                  },
                ],
              },
            ]
        : [
            {
              id: ObjectID().toString(),
              price: "0",
              index: 0,
              quantity: "UR",
              cableEntry: "",
              cutoutSize: "",
              earting: "",
              gasket: "",
              glass: "",
              hardware: "",
              HorsePower: "",
              hsnCode: "",
              kW: "",
              mounting: "",
              plateSize: "",
              poReferrence: "",
              productId: "",
              rating: "",
              rpm: "",
              size: "",
              terminals: "",
              typeNumber: "",
              variant: "",
              wireGuard: "",
              components: [{ compId: "", items: "" }],
            },
          ],
    },
  });

  form.setValue(
    "quotationNumber",
    quotationData?.quotationNumber
      ? quotationData.quotationNumber
      : quotationNumber?.success
      ? Number(quotationNumber.success.quotationNumber + 1)
      : 1
  );

  const isLoading = form.formState.isSubmitting;
  const { fields, append, remove, update } =
    useFieldArray<QuotationCreationRequest>({
      control: form.control,
      name: "items",
    });

  const handleSubmit = async (value: QuotationCreationRequest) => {
    if (!value.customerId) {
      return toast({
        variant: "destructive",
        title: "Oppse!",
        description: "Please Select Customer to submit the form.",
      });
    } else if (value.items.length > 0) {
      value.items.map((item) => {
        if (!item.productId) {
          return toast({
            variant: "destructive",
            title: "Oppse!",
            description: "Please Select Product to submit the form.",
          });
        }
      });
    }

    const response = await upsertQuotation({
      additionalNotes: value.additionalNotes,
      clientName: value.clientName,
      customerId: value.customerId,
      deliveryDate: date ?? new Date(),
      discount: value.discount,
      gst: value.gst,
      packingCharges: value.packingCharges,
      paymentTerms: value.paymentTerms,
      quotationNumber: value.quotationNumber,
      transportationPayment: value.transportationPayment,
      id: quotationData ? quotationData.id : ObjectId().toString(),
      // @ts-ignore
      items: value.items,
      deliverDateNew: value.deliverDateNew,
    });

    if (response?.success) {
      toast({
        title: "Your Quotation has been saved.",
        duration: 1000,
      });

      const axiosResponse = await axios.post("/api/add-items-to-quotation", {
        data: {
          quotationId: response.success.id,
          items: value.items,
        },
      });

      if (axiosResponse) {
        router.push(`/dashboard/quotations`);
        router.refresh();
      }
    }
    if (response?.error) {
      toast({
        variant: "destructive",
        title: "Oppse!",
        description: "Could not create your quotation, please try again later",
        duration: 1000,
      });
    }
  };

  const handleDeleteQuotation = async () => {
    setDeletingQuotation(true);
    if (!quotationData?.id) return;
    const response = await deleteQuotation(quotationData?.id);
    setDeletingQuotation(false);
    if (response?.success) {
      router.push("/dashboard/quotations");
      router.refresh();
      return toast({
        title: "Your Quotation has been deleted.",
        duration: 1000,
      });
    }
    if (response?.error) {
      return toast({
        variant: "destructive",
        title: "Oppse!",
        description: "could not delete your quotation",
        duration: 1000,
      });
    }
  };
  return (
    <AlertDialog>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Quotation Information</CardTitle>
          <CardDescription>
            Lets create a quotation for your business. You can edit quotation
            later from the Category settings tab.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {customerForm && (
            <CustomerForm
              isQuotationPage={true}
              onSubmit={() => setCustomerForm(false)}
              setValue={form.setValue}
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

              <div className="flex md:flex-row gap-4 items-end">
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="clientName"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Client Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Client Name" {...field}></Input>
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                ></FormField>
                <FormField
                  disabled={isLoading || isFetching}
                  control={form.control}
                  name="quotationNumber"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Quotation Number</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="ExQn-123"
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
                  name="deliverDateNew"
                  render={({ field }) => (
                    <FormItem className="flex-1 ">
                      <FormLabel>Delivery Date</FormLabel>
                      <FormControl>
                        <Input placeholder="3 Weeks" {...field}></Input>
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                ></FormField>
              </div>

              {/* ////////////////////////////////////////////////////////////////////////////////////////////////// */}

              <div className="flex md:flex-row gap-4 items-end">
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="gst"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>GST</FormLabel>
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
                            {gstOptions.map((gst) => {
                              return (
                                <SelectItem key={gst} value={gst}>
                                  {gst}
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
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="packingCharges"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Packing Charges</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select packing charges for quotation" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {packingCharges.map((packing) => {
                              return (
                                <SelectItem key={packing} value={packing}>
                                  {packing}
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
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="paymentTerms"
                  render={({ field }) => (
                    <FormItem className="flex-1 ">
                      <FormLabel>Payment Terms</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(v) => {
                            field.onChange(v);
                          }}
                          value={field.value}
                          defaultValue={field.value}
                          disabled={field.disabled}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select payment terms for quotation" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {paymentTerms.map((payment) => {
                              return (
                                <SelectItem key={payment} value={payment}>
                                  {payment}
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
              </div>

              {/* ////////////////////////////////////////////////////////////////////////////////////////////////// */}

              <div className="flex md:flex-row gap-4 items-end">
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="discount"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Discount</FormLabel>
                      <FormControl>
                        <Input placeholder="Disount" {...field}></Input>
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                ></FormField>
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="transportationPayment"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Transportation Payment</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(v) => {
                            field.onChange(v);
                          }}
                          value={field.value}
                          defaultValue={field.value}
                          disabled={field.disabled}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select transpoation payment options for quotation" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {transportationPayment.map((transportion) => {
                              return (
                                <SelectItem
                                  key={transportion}
                                  value={transportion}
                                >
                                  {transportion}
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
              </div>

              {/* ////////////////////////////////////////////////////////////////////////////////////////////////// */}

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
                <h1>Quotation Items</h1>

                {fields.map((field, index) => {
                  form.setValue(`items.${index}.index`, index + 1);
                  const productId = form.watch(`items.${index}.productId`);
                  return (
                    <div
                      key={field.id}
                      className="flex flex-col gap-4 border p-4"
                    >
                      <h2 className="underline underline-offset-4">
                        Product {index + 1}
                      </h2>
                      <div className="grid lg:grid-cols-8 grid-cols-2 gap-4  ">
                        {products?.success && (
                          <div className="col-span-2">
                            <SelectProduct
                              labelText="Select Product"
                              setValueAsText={`items.${index}.productId`}
                              products={products.success}
                              setProductId={form.setValue}
                              productId={productId}
                            ></SelectProduct>
                          </div>
                        )}
                        {/* //////////////////////////////////////////////////////////////////////// ratings */}
                        <FormField
                          disabled={isLoading}
                          control={form.control}
                          name={`items.${index}.rating`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>Ratings</FormLabel>
                              <FormControl>
                                <Input placeholder="Ratings" {...field}></Input>
                              </FormControl>
                              <FormMessage></FormMessage>
                            </FormItem>
                          )}
                        ></FormField>
                        <FormField
                          disabled={isLoading}
                          control={form.control}
                          name={`items.${index}.id`}
                          render={({ field }) => (
                            <FormItem className="flex-1 hidden">
                              <FormLabel></FormLabel>
                              <FormControl>
                                <Input
                                  type="hidden"
                                  placeholder="Ratings"
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
                          {...form.register(`items.${index}.index`)}
                          // type="hidden"
                          type="number"
                          placeholder="Ratings"
                          value={index + 1}
                        ></Input>

                        {/* //////////////////////////////////////////////////////////////////////// size */}
                        <FormField
                          disabled={isLoading}
                          control={form.control}
                          name={`items.${index}.size`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>Size</FormLabel>
                              <FormControl>
                                <Input placeholder="Size" {...field}></Input>
                              </FormControl>
                              <FormMessage></FormMessage>
                            </FormItem>
                          )}
                        ></FormField>

                        {/* //////////////////////////////////////////////////////////////////////// variant */}

                        <FormField
                          disabled={isLoading}
                          control={form.control}
                          name={`items.${index}.variant`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>Variant</FormLabel>
                              <FormControl>
                                <Input placeholder="Variant" {...field}></Input>
                              </FormControl>
                              <FormMessage></FormMessage>
                            </FormItem>
                          )}
                        ></FormField>

                        {/* //////////////////////////////////////////////////////////////////////// variant */}

                        <FormField
                          disabled={isLoading}
                          control={form.control}
                          name={`items.${index}.typeNumber`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>Type Number</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Type Number"
                                  {...field}
                                ></Input>
                              </FormControl>
                              <FormMessage></FormMessage>
                            </FormItem>
                          )}
                        ></FormField>

                        {/* //////////////////////////////////////////////////////////////////////// hsn */}

                        <FormField
                          disabled={isLoading}
                          control={form.control}
                          name={`items.${index}.hsnCode`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>HSN Code</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="HSN Code"
                                  {...field}
                                ></Input>
                              </FormControl>
                              <FormMessage></FormMessage>
                            </FormItem>
                          )}
                        ></FormField>

                        {/* //////////////////////////////////////////////////////////////////////// terminals */}

                        <FormField
                          disabled={isLoading}
                          control={form.control}
                          name={`items.${index}.terminals`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>Terminals</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Terminals"
                                  {...field}
                                ></Input>
                              </FormControl>
                              <FormMessage></FormMessage>
                            </FormItem>
                          )}
                        ></FormField>
                      </div>
                      <div className="grid lg:grid-cols-8 grid-cols-2 gap-4  ">
                        {/* //////////////////////////////////////////////////////////////////////// cableEntry */}
                        <FormField
                          disabled={isLoading}
                          control={form.control}
                          name={`items.${index}.cableEntry`}
                          render={({ field }) => (
                            <FormItem className="flex-1 col-span-2">
                              <FormLabel>Cable Entry</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Cable Entry"
                                  className="w-[300px]"
                                  {...field}
                                ></Input>
                              </FormControl>
                              <FormMessage></FormMessage>
                            </FormItem>
                          )}
                        ></FormField>
                        {/* //////////////////////////////////////////////////////////////////////// earting */}
                        <FormField
                          disabled={isLoading}
                          control={form.control}
                          name={`items.${index}.earting`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>Earting</FormLabel>
                              <FormControl>
                                <Input placeholder="Earting" {...field}></Input>
                              </FormControl>
                              <FormMessage></FormMessage>
                            </FormItem>
                          )}
                        ></FormField>

                        {/* //////////////////////////////////////////////////////////////////////// gasket */}

                        <FormField
                          disabled={isLoading}
                          control={form.control}
                          name={`items.${index}.gasket`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>Gasket</FormLabel>
                              <FormControl>
                                <Input placeholder="Gasket" {...field}></Input>
                              </FormControl>
                              <FormMessage></FormMessage>
                            </FormItem>
                          )}
                        ></FormField>

                        {/* //////////////////////////////////////////////////////////////////////// glass */}

                        <FormField
                          disabled={isLoading}
                          control={form.control}
                          name={`items.${index}.glass`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>Glass</FormLabel>
                              <FormControl>
                                <Input placeholder="Glass" {...field}></Input>
                              </FormControl>
                              <FormMessage></FormMessage>
                            </FormItem>
                          )}
                        ></FormField>

                        {/* //////////////////////////////////////////////////////////////////////// hardware */}

                        <FormField
                          disabled={isLoading}
                          control={form.control}
                          name={`items.${index}.hardware`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>Hardware</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Hardware"
                                  {...field}
                                ></Input>
                              </FormControl>
                              <FormMessage></FormMessage>
                            </FormItem>
                          )}
                        ></FormField>

                        {/* //////////////////////////////////////////////////////////////////////// mounting */}

                        <FormField
                          disabled={isLoading}
                          control={form.control}
                          name={`items.${index}.mounting`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>Mounting</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Mounting"
                                  {...field}
                                ></Input>
                              </FormControl>
                              <FormMessage></FormMessage>
                            </FormItem>
                          )}
                        ></FormField>

                        {/* //////////////////////////////////////////////////////////////////////// wireGuard */}

                        <FormField
                          disabled={isLoading}
                          control={form.control}
                          name={`items.${index}.wireGuard`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>Wire Guard</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Wire Guard"
                                  {...field}
                                ></Input>
                              </FormControl>
                              <FormMessage></FormMessage>
                            </FormItem>
                          )}
                        ></FormField>
                      </div>
                      <div className="grid lg:grid-cols-8 grid-cols-2 gap-4 items-end ">
                        {/* //////////////////////////////////////////////////////////////////////// cutoutSize */}
                        <FormField
                          disabled={isLoading}
                          control={form.control}
                          name={`items.${index}.cutoutSize`}
                          render={({ field }) => (
                            <FormItem className="flex-1 col-span-2">
                              <FormLabel>Cutout Size</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Cutout Size"
                                  className="w-[300px]"
                                  {...field}
                                ></Input>
                              </FormControl>
                              <FormMessage></FormMessage>
                            </FormItem>
                          )}
                        ></FormField>
                        {/* //////////////////////////////////////////////////////////////////////// plateSize */}
                        <FormField
                          disabled={isLoading}
                          control={form.control}
                          name={`items.${index}.plateSize`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>Plate Size</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Plate Size"
                                  {...field}
                                ></Input>
                              </FormControl>
                              <FormMessage></FormMessage>
                            </FormItem>
                          )}
                        ></FormField>

                        {/* //////////////////////////////////////////////////////////////////////// HorsePower */}

                        <FormField
                          disabled={isLoading}
                          control={form.control}
                          name={`items.${index}.HorsePower`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>Horse Power</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Horse Power"
                                  {...field}
                                ></Input>
                              </FormControl>
                              <FormMessage></FormMessage>
                            </FormItem>
                          )}
                        ></FormField>

                        {/* //////////////////////////////////////////////////////////////////////// kW */}

                        <FormField
                          disabled={isLoading}
                          control={form.control}
                          name={`items.${index}.kW`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>Kw</FormLabel>
                              <FormControl>
                                <Input placeholder="Kw" {...field}></Input>
                              </FormControl>
                              <FormMessage></FormMessage>
                            </FormItem>
                          )}
                        ></FormField>

                        {/* //////////////////////////////////////////////////////////////////////// rpm */}

                        <FormField
                          disabled={isLoading}
                          control={form.control}
                          name={`items.${index}.rpm`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>R.P.M</FormLabel>
                              <FormControl>
                                <Input placeholder="R.P.M" {...field}></Input>
                              </FormControl>
                              <FormMessage></FormMessage>
                            </FormItem>
                          )}
                        ></FormField>

                        {/* //////////////////////////////////////////////////////////////////////// poReferrence */}

                        <FormField
                          disabled={isLoading}
                          control={form.control}
                          name={`items.${index}.poReferrence`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>P.O. Reference</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="P.O. reference"
                                  {...field}
                                ></Input>
                              </FormControl>
                              <FormMessage></FormMessage>
                            </FormItem>
                          )}
                        ></FormField>
                      </div>
                      <div className="grid lg:grid-cols-8 grid-cols-2 gap-4 items-end ">
                        <FormField
                          disabled={isLoading}
                          control={form.control}
                          name={`items.${index}.quantity`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>Quantity</FormLabel>
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

                        <FormField
                          disabled={isLoading}
                          control={form.control}
                          name={`items.${index}.price`}
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

                        {/* //////////////////////////////////////////////////////////////////////// buttons */}
                      </div>
                      <div className="col-span-2">
                        <QuotationComponents
                          setId={form.setValue}
                          nestIndex={index}
                          {...form}
                        ></QuotationComponents>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          className=""
                          onClick={() => {
                            append({
                              id: ObjectID().toString(),
                              index: index + 1,
                              cableEntry: "",
                              cutoutSize: "",
                              earting: "",
                              gasket: "",
                              glass: "",
                              hardware: "",
                              HorsePower: "",
                              hsnCode: "",
                              kW: "",
                              mounting: "",
                              plateSize: "",
                              poReferrence: "",
                              productId: "",
                              rating: "",
                              rpm: "",
                              size: "",
                              terminals: "",
                              typeNumber: "",
                              variant: "",
                              wireGuard: "",
                              price: "0",
                              quantity: "UR",
                              components: [{ items: "" }],
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
                  );
                })}
              </div>

              {/* ////////////////////////////////////////////////////////////////////////////////////////////////// */}
              <Button
                type="submit"
                className="bg-exec hover:bg-exec/90"
                disabled={isLoading}
              >
                {isLoading ? <Loading /> : "Save Quotation Information"}
              </Button>
            </form>
          </Form>
          {quotationData?.id && (
            <>
              <div className="flex bg-red-50 flex-row items-center justify-between rounded-lg border border-destructive gap-4 p-4 mt-4">
                <div className="">
                  <div className="">Danger Zone</div>
                </div>
                <div className="text-muted-foreground">
                  Deleting your quotation cannot be undone.
                </div>
                <AlertDialogTrigger
                  disabled={isLoading || deletingQuotation}
                  className="text-red-600 p-2 text-center mt-2 rounded-md hover:bg-red-600 hover:text-white whitespace-nowrap"
                >
                  {deletingQuotation ? "Deleting..." : "Delete Quotation"}
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
                Quotation {quotationData?.quotationNumber}.
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

export default QuotationForm;
