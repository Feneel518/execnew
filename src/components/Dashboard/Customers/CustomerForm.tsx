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
import { toast } from "@/components/ui/use-toast";

import {
  CustomerCreationRequest,
  CustomerValidator,
} from "@/lib/Validators/CustomerValidator";
import { deleteCustomer, upsertCustomer } from "@/lib/queries";
import { zodResolver } from "@hookform/resolvers/zod";
import { Customer } from "@prisma/client";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import ObjectID from "bson-objectid";
import { usePathname, useRouter } from "next/navigation";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";

interface CustomerFormProps {
  data?: Customer;
  isQuotationPage?: boolean;
  onSubmit?: () => void;
  setValue?: any;
}

const CustomerForm: FC<CustomerFormProps> = ({
  data,
  isQuotationPage,
  onSubmit,
  setValue,
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const pathName = usePathname();

  const [deletingCustomer, setDeletingCustomer] = useState(false);

  const form = useForm<CustomerCreationRequest>({
    resolver: zodResolver(CustomerValidator),
    // mode: "onChange",
    defaultValues: {
      name: data?.name ? data.name : "",
      email: data?.email ? data.email : "",
      addressLine1: data?.addressLine1 ? data.addressLine1 : "",
      addressLine2: data?.addressLine2 ? data.addressLine2 : "",
      city: data?.city ? data.city : "",
      state: data?.state ? data.state : "",
      country: data?.country ? data.country : "",
      pincode: data?.pincode ? data.pincode : "",
      GST: data?.GST ? data.GST : "",
      phoneNumber: data?.phoneNumber ? data.phoneNumber : "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const handleSubmit = async (value: CustomerCreationRequest) => {
    const response = await upsertCustomer({
      id: data?.id ? data.id : ObjectID().toString(),
      name: value.name,
      slug: encodeURI(value.name.toLowerCase()),
      addressLine1: value.addressLine1,
      addressLine2: value.addressLine2,
      city: value.city,
      country: value.country,
      email: value.email,
      GST: value.GST,
      phoneNumber: value.phoneNumber,
      pincode: value.pincode,
      state: value.state,
    });

    if (response?.success) {
      toast({
        title: "Your Customer has been created.",
      });
      if (
        pathName.includes("customers")
          ? null
          : setValue("customerId", response.success.id)
      )
        if (!isQuotationPage) {
          router.push("/dashboard/customers");
        }
      if (isQuotationPage && onSubmit) {
        queryClient.invalidateQueries({ queryKey: ["customersForSelect"] });
        router.refresh();
        onSubmit();
      }
    }
    if (response?.error) {
      toast({
        variant: "destructive",
        title: "Oppse!",
        description: "could not create your customer",
      });
    }
  };

  const handleDeleteCustomer = async () => {
    setDeletingCustomer(true);
    if (!data?.id) return;
    const response = await deleteCustomer(data?.id);
    setDeletingCustomer(false);
  };
  return (
    <AlertDialog>
      <Card className="w-full">
        <CardHeader className="flex justify-between">
          <CardTitle>Customer Information</CardTitle>
          <CardDescription>
            Lets create a customer for your business. You can edit customer
            later from the customer settings tab.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4 "
            >
              <div className="flex mf:flex-row gap-4">
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Customer Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your Customer Name"
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
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Customer Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your Customer Email"
                          {...field}
                        ></Input>
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                ></FormField>
              </div>
              <div className="flex mf:flex-row gap-4">
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="addressLine1"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Address Line 1</FormLabel>
                      <FormControl>
                        <Input placeholder="Address Line 1" {...field}></Input>
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                ></FormField>
              </div>
              <div className="flex mf:flex-row gap-4">
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="addressLine2"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Address Line 2</FormLabel>
                      <FormControl>
                        <Input placeholder="Address Line 2" {...field}></Input>
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                ></FormField>
              </div>
              <div className="flex mf:flex-row gap-4">
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="Vapi" {...field}></Input>
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                ></FormField>
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input placeholder="Gujarat" {...field}></Input>
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                ></FormField>
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input placeholder="India" {...field}></Input>
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                ></FormField>
              </div>
              <div className="flex mf:flex-row gap-4">
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="pincode"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Pincode</FormLabel>
                      <FormControl>
                        <Input placeholder="396195" {...field}></Input>
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                ></FormField>
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="GST"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>GST</FormLabel>
                      <FormControl>
                        <Input placeholder="24AAA..." {...field}></Input>
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                ></FormField>
              </div>
              <div className="flex mf:flex-row gap-4">
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+919099064667" {...field}></Input>
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                ></FormField>
              </div>

              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loading /> : "Save Customer Information"}
              </Button>
            </form>
          </Form>
          {data?.id && (
            <>
              <div className="flex flex-row items-center justify-between rounded-lg border border-destructive gap-4 p-4 mt-4">
                <div className="">
                  <div className="">Danger Zone</div>
                </div>
                <div className="text-muted-foreground">
                  Deleting your Customer cannot be undone.
                </div>
                <AlertDialogTrigger
                  disabled={isLoading || deletingCustomer}
                  className="text-red-600 p-2 text-center mt-2 rounded-md hover:bg-red-600 hover:text-white whitespace-nowrap"
                >
                  {deletingCustomer ? "Deleting..." : "Delete Customer"}
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
                Category.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex items-center">
              <AlertDialogCancel className="mb-2">Cancel</AlertDialogCancel>
              <AlertDialogAction
                disabled={deletingCustomer}
                className="bg-destructive hover:bg-destructive"
                onClick={handleDeleteCustomer}
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
export default CustomerForm;
