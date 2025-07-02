"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useTransition } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { addPayment } from "@/lib/propertyQueries";
import { useRouter } from "next/navigation";

const paymentSchema = z.object({
  amount: z.coerce.number().min(1),
  mode: z.string().optional(),
  note: z.string().optional(),
});

export function AddPaymentDialog({
  tenantId,
  rentId,
  triggerButton,
}: {
  tenantId: string;
  rentId?: string;
  triggerButton?: React.ReactNode;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: 0,
      mode: "",
      note: "",
    },
  });

  const onSubmit = (values: z.infer<typeof paymentSchema>) => {
    startTransition(async () => {
      const result = await addPayment({
        ...values,
        tenantId,
        rentId,
      });

      if (result.success) {
        toast.success("Payment added");
        form.reset();
        router.refresh();
      } else {
        toast.error(result.error || "Failed to add payment");
      }
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {triggerButton || <Button size="sm">Add Payment</Button>}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Payment</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="₹" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mode</FormLabel>
                  <FormControl>
                    <Input placeholder="Cash / UPI / Bank" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note</FormLabel>
                  <FormControl>
                    <Input placeholder="optional" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Payment"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
