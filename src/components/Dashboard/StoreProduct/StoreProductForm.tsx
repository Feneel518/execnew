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
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ObjectId from "bson-objectid";
import {
  StoreProductSchemeRequest,
  StoreProductValidator,
} from "@/lib/Validators";
import { deleteStoreProduct, upsertStoreProduct } from "@/lib/queries";
import { StoreProduct } from "@prisma/client";
import QRCode from "qrcode";
import Image from "next/image";
import { useGetStoreProductNumber } from "@/data/get-store-product-id";
import { incrementStoreId } from "@/lib/utils";

interface StoreProductFormProps {
  productData?: StoreProduct;
}

const StoreProductForm: FC<StoreProductFormProps> = ({ productData }) => {
  const searchParams = useSearchParams();
  const page = searchParams.get("page");
  const query = searchParams.get("query");
  const [deletingProduct, setDeletingProduct] = useState(false);
  const [src, setSrc] = useState(productData ? productData.qrCodeLink : "");
  const { data: oldStoreProductId, isFetching } = useGetStoreProductNumber();

  const newStoreProductId = incrementStoreId(
    oldStoreProductId?.success?.StoreProductId
  );

  const router = useRouter();

  const form = useForm<StoreProductSchemeRequest>({
    resolver: zodResolver(StoreProductValidator),
    // mode: "onChange",
    defaultValues: {
      image: productData?.image ? productData.image : "",
      name: productData?.name ? productData.name : "",
      description: productData?.description ? productData.description : "",
      storeProductId: productData?.StoreProductId
        ? productData.StoreProductId
        : "",
      qrCodeLink: src,
    },
  });

  useEffect(() => {
    form.setValue(
      "storeProductId",
      productData?.StoreProductId
        ? productData.StoreProductId
        : oldStoreProductId?.success
        ? newStoreProductId
        : "ExEC-SP-01"
    );
  }, [oldStoreProductId]);

  const storeProductId = form.watch("storeProductId");

  const isLoading = form.formState.isSubmitting;

  const handleSubmit = async (data: StoreProductSchemeRequest) => {
    const response = await upsertStoreProduct({
      id: productData?.id ? productData.id : ObjectId().toString(),
      image: data.image,
      name: data.name,
      description: data.description,
      StoreProductId: data.storeProductId,
      qrCodeLink: src,
    });
    if (response?.success) {
      toast({
        title: "Your product has been created.",
      });
      router.push(
        `/dashboard/store-products?${page === undefined ? "" : `page=${page}`}`
      );
      return router.refresh();
    }
    if (response?.error)
      toast({
        variant: "destructive",
        title: "Oppse!",
        description: "could not create your product",
      });
  };

  const handleDeleteProduct = async () => {
    setDeletingProduct(true);
    if (!productData?.id) return;
    const response = await deleteStoreProduct(productData?.id);
    setDeletingProduct(false);
    if (response?.success) {
      router.push(
        `/dashboard/store-products?${page === undefined ? "" : `page=${page}`}`
      );
      router.refresh();
      return toast({
        title: "Your Product has been deleted.",
      });
    }
    if (response?.error) {
      return toast({
        variant: "destructive",
        title: "Oppse!",
        description: "could not delete your product",
      });
    }
  };

  const handleGenerateQrCode = () => {
    setSrc(
      `https://api.qrserver.com/v1/create-qr-code?size=400x400&data=https://www.explosionproofelectrical.com/dashboard/inventory/new?productId=${storeProductId}`
    );
  };

  return (
    <AlertDialog>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
          <CardDescription>
            Lets create a product for your business. You can edit product later
            from the product settings tab.
          </CardDescription>
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
                    <FormLabel>Product Image</FormLabel>
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
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your Product Name"
                          {...field}
                        ></Input>
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                ></FormField>
                <FormField
                  disabled={isLoading || isFetching}
                  control={form.control}
                  name="storeProductId"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Store Product Id</FormLabel>
                      <FormControl>
                        <Input placeholder="ExEC-SP-01" {...field}></Input>
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
                  name="description"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Descritpion</FormLabel>
                      <FormControl>
                        <Input placeholder="4 Way terminal" {...field}></Input>
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                ></FormField>
              </div>
              <div className="">
                {src && (
                  <Image
                    alt="qr code"
                    src={src}
                    width={400}
                    height={400}
                  ></Image>
                )}
              </div>

              <div className="flex items-center gap-4">
                <Button
                  onClick={handleGenerateQrCode}
                  type="button"
                  disabled={isLoading}
                >
                  {"Generate QR Code"}
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? <Loading /> : "Save Product Information"}
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
                  Deleting your product cannot be undone.
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
                Agency account and all related sub accounts.
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

export default StoreProductForm;
