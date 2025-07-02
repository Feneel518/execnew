"use client";

import Loading from "@/components/Global/Loading";
import { AlertDialog } from "@/components/ui/alert-dialog";
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
import { Textarea } from "@/components/ui/textarea";
import { useGetProductsForSelect } from "@/data/get-products-for-select";
import { upsertCasting } from "@/lib/aluminumQueries";
import { CastingType } from "@/lib/types";
import {
  CastingProdcutsCreationRequest,
  CastingProdcutsValidator,
} from "@/lib/Validators/AllAluminumValidators";
import { zodResolver } from "@hookform/resolvers/zod";
import ObjectID from "bson-objectid";
import { useRouter } from "next/navigation";
import { FC } from "react";
import { useForm } from "react-hook-form";
import SelectProduct from "../Dashboard/Quotations/SelectProduct";
import { toast } from "../ui/use-toast";
import MultipleSelector from "../ui/multiple-selector";
interface AluminumProductFormProps {
  data?: CastingType;
}

const AluminumProductForm: FC<AluminumProductFormProps> = ({ data }) => {
  const router = useRouter();

  const { data: products } = useGetProductsForSelect();

  const form = useForm<CastingProdcutsCreationRequest>({
    resolver: zodResolver(CastingProdcutsValidator),
    defaultValues: {
      id: data?.id ? data.id : ObjectID().toString(),
      description: data?.description ? data.description : "",
      name: data?.name ? data.name : "",
      // productId: data?.productId ? data.productId : [],
      weight: data?.weight ? data.weight : 0,
      productId: data?.ProductsForCasting
        ? data.ProductsForCasting.map((prod) => {
            return {
              id: prod.id,
              label: prod.product.name,
              value: prod.productId,
            };
          })
        : [],
    },
  });
  const isLoading = form.formState.isLoading;

  const productId = form.watch(`productId`);

  const handleSubmit = async (values: CastingProdcutsCreationRequest) => {
    const response = await upsertCasting(values);

    if (response?.success) {
      toast({
        title: "Your Casting has been saved.",
      });

      router.push("/aluminum/products");
      router.refresh();
    }
    if (response?.error) {
      toast({
        variant: "destructive",
        title: "Oppse!",
        description: "could not save your casting",
      });
    }
  };
  return (
    <AlertDialog>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
          <CardDescription>
            Lets create a product for your aluminum transactions.
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
                  disabled={isLoading}
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>weight</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your Product weight in kg"
                          {...field}
                        ></Input>
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                ></FormField>
              </div>
              {products?.success && (
                <div className="col-span-2">
                  <FormField
                    control={form.control}
                    name="productId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Frameworks</FormLabel>
                        <FormControl>
                          <MultipleSelector
                            {...field}
                            defaultOptions={products.success.map((product) => {
                              return {
                                label: product.name,
                                value: product.id,
                                id: data?.ProductsForCasting.find(
                                  (prod) => prod.productId === product.id
                                )
                                  ? data?.ProductsForCasting.find(
                                      (prod) => prod.productId === product.id
                                    )?.id
                                  : ObjectID().toString(),
                              };
                            })}
                            placeholder="Select products."
                            emptyIndicator={
                              <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                                no results found.
                              </p>
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* <SelectProduct
                    labelText="Final Product"
                    setValueAsText={`productId`}
                    products={products.success}
                    setProductId={form.setValue}
                    productId={productId}
                  ></SelectProduct> */}
                </div>
              )}
              <div className="flex mf:flex-row gap-4">
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Product Description</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={10}
                          placeholder="Your Product Description"
                          {...field}
                        ></Textarea>
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                ></FormField>
              </div>

              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loading /> : "Save Product Information"}
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
              Deleting your category cannot be undone. This will also make
              the products having these category without any category
            </div>
            <AlertDialogTrigger
              disabled={isLoading || deletingCategory}
              className="text-red-600 p-2 text-center mt-2 rounded-md hover:bg-red-600 hover:text-white whitespace-nowrap"
            >
              {deletingCategory ? "Deleting..." : "Delete Category"}
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
            disabled={deletingCategory}
            className="bg-destructive hover:bg-destructive"
            onClick={handleDeleteCategory}
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

export default AluminumProductForm;
