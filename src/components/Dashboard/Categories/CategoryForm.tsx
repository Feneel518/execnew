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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import {
  CategoryCreationRequest,
  CategoryValidator,
} from "@/lib/Validators/CategoryValidator";
import { deleteCategory, upsertCategory } from "@/lib/queries";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category } from "@prisma/client";
import ObjectID from "bson-objectid";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

interface CategoryFormProps {
  data?: Category;
}

const CategoryForm: FC<CategoryFormProps> = ({ data }) => {
  const router = useRouter();

  const [deletingCategory, setDeletingCategory] = useState(false);

  const form = useForm<CategoryCreationRequest>({
    resolver: zodResolver(CategoryValidator),
    // mode: "onChange",
    defaultValues: {
      image: data?.image ? data.image : "",
      name: data?.name ? data.name : "",
      description: data?.description ? data.description : "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const handleSubmit = async (value: CategoryCreationRequest) => {
    try {
      const response = await upsertCategory({
        id: data?.id ? data.id : ObjectID().toString(),
        image: value.image,
        name: value.name,
        description: value.description,
        slug: encodeURI(value.name.toLowerCase()),
      });

      //
      toast({
        title: "Your Category has been created.",
      });

      router.push("/dashboard/categories");
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Oppse!",
        description: "could not create your Category",
      });
    }
  };

  const handleDeleteCategory = async () => {
    setDeletingCategory(true);
    if (!data?.id) return;
    const response = await deleteCategory(data?.id);

    setDeletingCategory(false);
  };
  return (
    <AlertDialog>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Category Information</CardTitle>
          <CardDescription>
            Lets create a category for your business. You can edit categories
            later from the Category settings tab.
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
                    <FormLabel>Category Image</FormLabel>
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
                      <FormLabel>Category Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your Category Name"
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
                  name="description"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Category Name</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={10}
                          placeholder="Your Category Description"
                          {...field}
                        ></Textarea>
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                ></FormField>
              </div>

              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loading /> : "Save Category Information"}
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
          </AlertDialogContent>
        </CardContent>
      </Card>
    </AlertDialog>
  );
};
export default CategoryForm;
