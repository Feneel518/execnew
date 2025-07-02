"use client";

import { FC } from "react";
import { AlertDialog } from "../ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Loading from "../Global/Loading";
import {
  AluminumClientCreationRequest,
  AluminumClientValidator,
} from "@/lib/Validators/AllAluminumValidators";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { upsertAluminumClient } from "@/lib/aluminumQueries";
import ObjectID from "bson-objectid";
import { toast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { AluminumClient } from "@prisma/client";

interface AluminumClientFormProps {
  data?: AluminumClient;
}

const AluminumClientForm: FC<AluminumClientFormProps> = ({ data }) => {
  const router = useRouter();
  const form = useForm<AluminumClientCreationRequest>({
    resolver: zodResolver(AluminumClientValidator),
    // mode: "onChange",
    defaultValues: {
      id: data?.id ? data.id : "",
      name: data?.name ? data.name : "",
      address: data?.addressLine1 ? data.addressLine1 : "",
      GST: data?.GST ? data.GST : "",
      phoneNumber: data?.phoneNumber ? data.phoneNumber : "",
      slug: data?.slug ? data.slug : "",
      type: data?.type ? data.type : "USER",
    },
  });
  const isLoading = form.formState.isLoading;

  const handleSubmit = async (value: AluminumClientCreationRequest) => {
    const response = await upsertAluminumClient({
      id: value?.id ? value.id : ObjectID().toString(),
      name: value.name,
      slug: encodeURI(value.name.toLowerCase()),
      address: value.address,
      GST: value.GST,
      phoneNumber: value.phoneNumber,
      type: value.type,
    });

    if (response?.success) {
      toast({
        title: "Your Client has been created.",
      });
      router.refresh();
      router.push("/aluminum/clients");
    }
    if (response?.error) {
      toast({
        variant: "destructive",
        title: "Oppse!",
        description: "could not create your customer",
      });
    }
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
              <div className="flex mf:flex-row gap-4">
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="address"
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
                  name="GST"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>GST</FormLabel>
                      <FormControl>
                        <Input placeholder="24AAAFE7591G1ZG" {...field}></Input>
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                ></FormField>
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="type"
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
                              <SelectValue placeholder="Select a type of your client" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem key={"USER"} value={"USER"}>
                              User
                            </SelectItem>
                            <SelectItem key={"SUPPLIER"} value={"SUPPLIER"}>
                              Supplier
                            </SelectItem>
                            <SelectItem key={"BOTH"} value={"BOTH"}>
                              Both
                            </SelectItem>
                          </SelectContent>
                        </Select>
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
          {/* {data?.id && (
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
          )} */}
          {/* <AlertDialogContent>
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
          </AlertDialogContent> */}
        </CardContent>
      </Card>
    </AlertDialog>
  );
};

export default AluminumClientForm;
