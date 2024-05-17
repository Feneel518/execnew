"use client";

import FileUpload from "@/components/Global/FileUpload";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import ObjectId from "bson-objectid";
import { productForm } from "@/lib/types";
import {
  EmployeeSchemeRequest,
  EmployeeValidator,
  StoreProductSchemeRequest,
  StoreProductValidator,
} from "@/lib/Validators";
import {
  deleteEmployee,
  deleteStoreProduct,
  upsertEmployee,
  upsertStoreProduct,
} from "@/lib/queries";
import { Employee, StoreProduct } from "@prisma/client";
import QRCode from "qrcode";
import Image from "next/image";

interface EmployeesFormProps {
  productData?: Employee;
}

const EmployeesForm: FC<EmployeesFormProps> = ({ productData }) => {
  const [deletingProduct, setDeletingProduct] = useState(false);

  const router = useRouter();

  const form = useForm<EmployeeSchemeRequest>({
    resolver: zodResolver(EmployeeValidator),
    // mode: "onChange",
    defaultValues: {
      image: productData?.image ? productData.image : "",
      name: productData?.name ? productData.name : "",
      aadhharNumber: productData?.aadharNumber ? productData.aadharNumber : "",
      phoneNumber: productData?.phoneNumber ? productData.phoneNumber : "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const handleSubmit = async (data: EmployeeSchemeRequest) => {
    const response = await upsertEmployee({
      aadharNumber: data.aadhharNumber,
      image: data.image,
      name: data.name,
      phoneNumber: data.phoneNumber,
      id: productData?.id ? productData.id : ObjectId().toString(),
    });
    if (response?.success) {
      toast({
        title: "Your employee has been added.",
      });
      router.push("/dashboard/employees");
      return router.refresh();
    }
    if (response?.error)
      toast({
        variant: "destructive",
        title: "Oppse!",
        description: "could not create your employee",
      });
  };

  const handleDeleteProduct = async () => {
    setDeletingProduct(true);
    if (!productData?.id) return;
    const response = await deleteEmployee(productData?.id);
    setDeletingProduct(false);
    if (response?.success) {
      router.push("/dashboard/employees");
      router.refresh();
      return toast({
        title: "Your Employee has been removed.",
      });
    }
    if (response?.error) {
      return toast({
        variant: "destructive",
        title: "Oppse!",
        description: "could not remove your employee",
      });
    }
  };

  return (
    <AlertDialog>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Employee Information</CardTitle>
          <CardDescription>Employees information</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4 "
            >
              <FormField
                disabled={isLoading}
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employee Image</FormLabel>
                    <FormControl className="">
                      <FileUpload
                        apiEndPoint="imageUploader"
                        onChange={field.onChange}
                        value={field.value}
                      ></FileUpload>
                    </FormControl>
                    <FormMessage></FormMessage>
                  </FormItem>
                )}
              ></FormField>
              <div className="flex mf:flex-row gap-4">
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Employee Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your Employee Name"
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
                        <Input placeholder="9999999999" {...field}></Input>
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
                  name="aadhharNumber"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Aadhar Number</FormLabel>
                      <FormControl>
                        <Input placeholder="127349123" {...field}></Input>
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                ></FormField>
              </div>

              <div className="flex items-center gap-4">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? <Loading /> : "Save Employee Information"}
                </Button>
              </div>
            </form>
          </Form>
          {productData?.id && (
            <>
              <div className="flex flex-row items-center justify-between rounded-lg border border-destructive gap-4 p-4 mt-4">
                <div className="">
                  <div className="">Danger Zone</div>
                </div>
                <div className="text-muted-foreground">
                  Removing your employee cannot be undone.
                </div>
                <AlertDialogTrigger
                  disabled={isLoading || deletingProduct}
                  className="text-red-600 p-2 text-center mt-2 rounded-md hover:bg-red-600 hover:text-white whitespace-nowrap"
                >
                  {deletingProduct ? "Deleting..." : "Delete Product"}
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
                Employee account and all related sub accounts.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex items-center">
              <AlertDialogCancel className="mb-2">Cancel</AlertDialogCancel>
              <AlertDialogAction
                disabled={deletingProduct}
                className="bg-destructive hover:bg-destructive"
                onClick={handleDeleteProduct}
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

export default EmployeesForm;
