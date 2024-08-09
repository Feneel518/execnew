"use client";

import Heading from "@/components/Global/Heading";
import { AlertDialog } from "@/components/ui/alert-dialog";
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
import { OrderToView } from "@/lib/types";
import { format } from "date-fns";
import { FC } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import TCHeader from "./TCHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  TestCertificateSchemaRequest,
  TestCertificatevalidator,
} from "@/lib/Validators";
import { zodResolver } from "@hookform/resolvers/zod";

import TestInvoice from "./TestInvoice";

interface TestCertificateFormProps {
  order: OrderToView;
}

const TestCertificateForm: FC<TestCertificateFormProps> = ({ order }) => {
  const form = useForm<TestCertificateSchemaRequest>({
    resolver: zodResolver(TestCertificatevalidator),
    defaultValues: {
      items: order.ProductInOrder.map((ord) => {
        return {
          name: ord.product.name!,
          type: ord.product.type!,
          protection: ord.product.protection!,
          gasGroup: ord.product.gasGroup!,
          typeNumber: ord.product.typeNumber!,
          certificateNumber: ord.certificateNumber!,
          invoice: [{ invoiceDate: new Date(), invoiceNumber: "" }],
          quantity: ord.quantity,
          id: ord.id,
        };
      }),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const isLoading = form.formState.isLoading;

  const onSubmit = async (data: TestCertificateSchemaRequest) => {};

  return (
    <div>
      <AlertDialog>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Test Certfcate Information</CardTitle>
            <CardDescription>
              Lets create a test certificate for your business. You can edit
              certificates later from the Category settings tab.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-10"
              >
                <TCHeader details={order}></TCHeader>
                <div className="flex flex-col gap-8">
                  {fields.map((prod, index) => {
                    return (
                      <div className="grid grid-cols-3 gap-8 items-center justify-center border p-4 border-black rounded-md shadow-md">
                        <div className="">
                          <p>{prod.name}</p>
                          <p className="text-xs">{prod.type}</p>
                          <p className="text-xs">{prod.protection}</p>
                          <p className="text-xs">{prod.gasGroup}</p>
                        </div>
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
                        <FormField
                          disabled={isLoading}
                          control={form.control}
                          name={`items.${index}.certificateNumber`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
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
                        <TestInvoice
                          control={form.control}
                          nestIndex={index}
                          isLoading={isLoading}
                        ></TestInvoice>
                        <div className="">
                          <FormItem className="flex-1 ml-8">
                            <FormLabel>Quantity</FormLabel>
                            <div className="">{prod.quantity}</div>
                            <FormMessage></FormMessage>
                          </FormItem>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <Button type="submit">Submit</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </AlertDialog>
    </div>
  );
};

export default TestCertificateForm;
