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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { useGetCategoriesForSelect } from "@/data/get-categories-for-select";
import {
  ProductCreationRequest,
  ProductValidator,
} from "@/lib/Validators/ProductValidator";
import { deleteProduct, upsertProduct } from "@/lib/queries";
import { zodResolver } from "@hookform/resolvers/zod";
import { Product, ProductComponentsOnProducts } from "@prisma/client";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import ObjectId from "bson-objectid";
import { productForm } from "@/lib/types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface ProductFormProps {
  productData?: productForm;
}

const ProductForm: FC<ProductFormProps> = ({ productData }) => {
  const { data: categories, error, fetchStatus } = useGetCategoriesForSelect();
  const [deletingProduct, setDeletingProduct] = useState(false);

  const router = useRouter();

  const form = useForm<ProductCreationRequest>({
    resolver: zodResolver(ProductValidator),
    // mode: "onChange",
    defaultValues: {
      image: productData?.image ? productData.image : "",
      name: productData?.name ? productData.name : "",
      cableEntry: productData?.cableEntry ? productData.cableEntry : "",
      components: productData?.ProductComponentsOnProducts
        ? productData.ProductComponentsOnProducts.length > 0
          ? productData?.ProductComponentsOnProducts.map((com) => {
              return {
                items: com.productComponents.item,
              };
            })
          : [{ items: "" }]
        : [{ items: "" }],
      cutoutSize: productData?.cutoutSize ? productData.cutoutSize : "",
      earting: productData?.earting ? productData.earting : "",
      finish: productData?.finish ? productData.finish : "",
      gasGroup: productData?.gasGroup ? productData.gasGroup : "",
      gasket: productData?.gasket ? productData.gasket : "",
      glass: productData?.glass ? productData.glass : "",
      hardware: productData?.hardware ? productData.hardware : "",
      hsnCode: productData?.hsnCode ? productData.hsnCode : "",
      material: productData?.material ? productData.material : "",
      mounting: productData?.mounting ? productData.mounting : "",
      plateSize: productData?.plateSize ? productData.plateSize : "",
      protection: productData?.protection ? productData.protection : "",
      rating: productData?.rating ? productData.rating : "",
      terminals: productData?.terminals ? productData.terminals : "",
      type: productData?.type ? productData.type : "",
      typeNumber: productData?.typeNumber ? productData.typeNumber : "",
      wireGuard: productData?.wireGuard ? productData.wireGuard : "",
      variant: productData?.variant ? productData.variant : "",
      size: productData?.size ? productData.size : "",
      HorsePower: productData?.HorsePower ? productData.HorsePower : "",
      kW: productData?.kW ? productData.kW : "",
      rpm: productData?.rpm ? productData.rpm : "",
      categoryId: productData?.categoryId ? productData.categoryId : "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const { fields, append, remove } = useFieldArray<ProductCreationRequest>({
    control: form.control,
    name: "components",
  });

  const handleSubmit = async (data: ProductCreationRequest) => {
    if (!data.categoryId) {
      return toast({
        variant: "destructive",
        title: "Oppse!",
        description: "Please select a category to proceed.",
      });
    }

    const response = await upsertProduct({
      id: productData?.id ? productData.id : ObjectId().toString(),
      cableEntry: data.cableEntry,
      categoryId: data.categoryId,
      cutoutSize: data.cutoutSize,
      earting: data.earting,
      finish: data.finish,
      gasGroup: data.gasGroup,
      gasket: data.gasket,
      glass: data.glass,
      hardware: data.hardware,
      HorsePower: data.HorsePower,
      hsnCode: data.hsnCode,
      image: data.image,
      kW: data.kW,
      material: data.material,
      mounting: data.mounting,
      name: data.name,
      plateSize: data.plateSize,
      protection: data.protection,
      rating: data.rating,
      rpm: data.rpm,
      size: data.size,
      terminals: data.terminals,
      type: data.type,
      typeNumber: data.typeNumber,
      variant: data.variant,
      wireGuard: data.wireGuard,
      components: data.components,
    });

    if (response?.success) {
      toast({
        title: "Your product has been saved.",
      });
      router.push("/dashboard/products");
      return router.refresh();
    }
    if (response?.error)
      toast({
        variant: "destructive",
        title: "Oppse!",
        description: "Could not save your product, please try again later.",
      });
  };

  const handleDeleteProduct = async () => {
    setDeletingProduct(true);
    if (!productData?.id) return;
    const response = await deleteProduct(productData?.id);
    setDeletingProduct(false);

    if (response?.success) {
      router.push("/dashboard/products");
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
                  disabled={isLoading}
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Flameproof Type</FormLabel>
                      <FormControl>
                        <Input placeholder="IEC:60079-1" {...field}></Input>
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
                  name="protection"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Protection</FormLabel>
                      <FormControl>
                        <Input placeholder="IP 65" {...field}></Input>
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                ></FormField>
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="gasGroup"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Flameproof Gas Group</FormLabel>
                      <FormControl>
                        <Input placeholder="IIA & IIB" {...field}></Input>
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
                  name="material"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Type of Material</FormLabel>
                      <FormControl>
                        <Input placeholder="LM-6" {...field}></Input>
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                ></FormField>
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="finish"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Material Finish</FormLabel>
                      <FormControl>
                        <Input placeholder="Power Coated" {...field}></Input>
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
                  name="hardware"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Hardware used</FormLabel>
                      <FormControl>
                        <Input placeholder="Stainless Steel" {...field}></Input>
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                ></FormField>
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="mounting"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Mounting</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Wall / Structure"
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
                  name="cableEntry"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Cable Entry</FormLabel>
                      <FormControl>
                        <Input placeholder='3/4" ET' {...field}></Input>
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                ></FormField>
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="earting"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Earthings</FormLabel>
                      <FormControl>
                        <Input placeholder="2 Nos Inside" {...field}></Input>
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
                  name="typeNumber"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Type Number</FormLabel>
                      <FormControl>
                        <Input placeholder="EP-73102" {...field}></Input>
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                ></FormField>
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="hsnCode"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>HSN Code</FormLabel>
                      <FormControl>
                        <Input placeholder="85372000" {...field}></Input>
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
                  name="terminals"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Terminals</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Spring loaded 20 Nos 2.5 mm2"
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
                  name="gasket"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Gasket Material</FormLabel>
                      <FormControl>
                        <Input placeholder="Neoprene" {...field}></Input>
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
                  name="plateSize"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Plate Size</FormLabel>
                      <FormControl>
                        <Input placeholder="410 X 290mm" {...field}></Input>
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                ></FormField>
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="cutoutSize"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Cutout Size</FormLabel>
                      <FormControl>
                        <Input placeholder="410 X 290mm" {...field}></Input>
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
                  name="glass"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Glass</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Toughened type A"
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
                  name="wireGuard"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Wire Guard Make</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="MS Galvanized white Epoxy Painted"
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
                  name="kW"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>kiloWatt</FormLabel>
                      <FormControl>
                        <Input placeholder="2.5 k.W." {...field}></Input>
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                ></FormField>
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="rpm"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>R.P.M</FormLabel>
                      <FormControl>
                        <Input placeholder="1400" {...field}></Input>
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
                  name="size"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Size</FormLabel>
                      <FormControl>
                        <Input placeholder='16"' {...field}></Input>
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                ></FormField>
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="HorsePower"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Horse Power(only for fan)</FormLabel>
                      <FormControl>
                        <Input placeholder="2.5 H.P." {...field}></Input>
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
                  name="rating"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Ratings</FormLabel>
                      <FormControl>
                        <Input placeholder="45W" {...field}></Input>
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                ></FormField>
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="variant"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Variants</FormLabel>
                      <FormControl>
                        <Input placeholder="Wall" {...field}></Input>
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                ></FormField>
              </div>
              <div className="flex flex-col  gap-4">
                {fields.map((field, index) => {
                  return (
                    <div key={field.id} className="w-full ">
                      <FormField
                        disabled={isLoading}
                        control={form.control}
                        name={`components.${index}`}
                        render={({ field }) => (
                          <FormItem className="flex-1 ">
                            <FormLabel>Components</FormLabel>
                            <div className="flex items-center gap-2 w-full">
                              <FormControl>
                                <Input
                                  placeholder="Components"
                                  {...form.register(
                                    `components.${index}.items`
                                  )}
                                ></Input>
                              </FormControl>
                              <div className="flex space-x-2">
                                <Button
                                  onClick={() => append({ items: "" })}
                                  type="button"
                                >
                                  +
                                </Button>
                                {index > 0 && (
                                  <Button
                                    onClick={() => remove(index)}
                                    type="button"
                                  >
                                    -
                                  </Button>
                                )}
                              </div>
                            </div>
                          </FormItem>
                        )}
                      ></FormField>
                    </div>
                  );
                })}
              </div>
              <div className="flex flex-col  gap-4">
                {categories?.success && (
                  // <FormField
                  //   control={form.control}
                  //   name="categoryId"
                  //   render={({ field }) => (
                  //     <FormItem>
                  //       <FormLabel>Category</FormLabel>
                  //       <Select
                  //         onValueChange={field.onChange}
                  //         defaultValue={field.value}
                  //       >
                  //         <FormControl>
                  //           <SelectTrigger>
                  //             <SelectValue placeholder="Select a category to display" />
                  //           </SelectTrigger>
                  //         </FormControl>
                  //         <SelectContent>
                  //           {categories?.success.map((category) => {
                  //             return (
                  //               <SelectItem
                  //                 key={category.id}
                  //                 value={category.id}
                  //               >
                  //                 {category.name}
                  //               </SelectItem>
                  //             );
                  //           })}
                  //         </SelectContent>
                  //       </Select>

                  //       <FormMessage />
                  //     </FormItem>
                  //   )}
                  // />
                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Category</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "w-full justify-between",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value
                                  ? categories.success.find(
                                      (language) => language.id === field.value
                                    )?.name
                                  : "Select Category"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0">
                            <Command>
                              <CommandInput placeholder="Search category..." />
                              <CommandList>
                                <CommandEmpty>
                                  No categories found.
                                </CommandEmpty>
                                <CommandGroup>
                                  {categories.success.map((language) => (
                                    <CommandItem
                                      value={language.name}
                                      key={language.id}
                                      onSelect={() => {
                                        form.setValue(
                                          "categoryId",
                                          language.id
                                        );
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          language.name === field.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      {language.name}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loading /> : "Save Product Information"}
              </Button>
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
          <AlertDialogContent className="w-[50%]">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-left">
                Are you absolutely sure?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-left">
                This action cannot be undone. This will permanently delete the
                product &quot;<strong>{productData?.name}</strong>&quot;
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex items-center ">
              <AlertDialogCancel className="">Cancel</AlertDialogCancel>
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

export default ProductForm;
