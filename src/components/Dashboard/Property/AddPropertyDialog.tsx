"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  addPropertySchema,
  addPropertySchemaRequest,
} from "@/lib/Validators/AllPropertyValidators";
import { upsertProperty } from "@/lib/propertyQueries";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

interface PropertyFormDialogProps {
  type: "add" | "edit";
  propertyId?: string;
  initialValues?: addPropertySchemaRequest;
  triggerButton: React.ReactNode;
  externalOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AddPropertyDialog({
  type,
  initialValues,
  propertyId,
  triggerButton,
  externalOpen,
  onOpenChange,
}: PropertyFormDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const form = useForm<addPropertySchemaRequest>({
    resolver: zodResolver(addPropertySchema),
    defaultValues: initialValues || {
      name: "",
      address: "",
      rent: 0,
    },
  });

  const isEdit = type === "edit";

  const onSubmit = (values: addPropertySchemaRequest) => {
    startTransition(async () => {
      const response = await upsertProperty({ ...values, id: propertyId });

      if (response?.success) {
        form.reset(); // ✅ clears inputs
        toast({
          title: isEdit
            ? "Property updated successfully."
            : "Property created successfully.",
        });
        if (onOpenChange) {
          onOpenChange(false); // for external control
        } else {
          setOpen(false); // fallback to internal control
        }
        router.refresh();
      } else {
        toast({ title: response?.error });
        if (onOpenChange) {
          onOpenChange(false); // for external control
        } else {
          setOpen(false); // fallback to internal control
        }
      }
    });
  };

  return (
    <Dialog
      open={externalOpen !== undefined ? externalOpen : open}
      onOpenChange={onOpenChange || setOpen}
    >
      <DialogTrigger asChild>
        {triggerButton && (
          <DialogTrigger asChild>{triggerButton}</DialogTrigger>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Property" : "Add Property"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Plot A1, GIDC" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Full address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Rent (₹)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="10000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : isEdit ? "Update" : "Save"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
