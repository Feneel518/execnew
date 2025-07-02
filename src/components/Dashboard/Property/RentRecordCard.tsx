"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

interface RentRecordCardProps {
  record: {
    id: string;
    month: string;
    rentAmount: number;
    lightBill: number | null;
    totalAmount: number;
    isPaid: boolean;
  };
}

export function RentRecordCard({ record }: RentRecordCardProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const markAsPaid = async () => {
    // startTransition(async () => {
    //   const res = await fetch(`/api/rent/${record.id}/mark-paid`, {
    //     method: "POST",
    //   });
    //   if (res.ok) {
    //     toast({ title: "Marked as Paid" });
    //     window.location.reload(); // you can use router.refresh() too
    //   } else {
    //     toast({ title: "Error", description: "Failed to mark as paid" });
    //   }
    // });
  };

  return (
    <Card
      className="p-4 border bg-white flex justify-between items-start cursor-pointer    "
      onClick={() => router.push(`/dashboard/rent/${record.id}/invoice`)}
    >
      <div>
        <p className="font-semibold text-lg">{record.month}</p>
        <p className="text-sm text-muted-foreground">
          Rent: ₹{record.rentAmount}
        </p>
        <p className="text-sm text-muted-foreground">
          Light Bill: ₹{record.lightBill?.toFixed(2) || 0}
        </p>
        <p className="text-sm font-medium mt-1">
          Total: ₹{record.totalAmount.toFixed(2)}
        </p>
      </div>

      <div className="flex flex-col items-end justify-between">
        <Badge variant={record.isPaid ? "default" : "destructive"}>
          {record.isPaid ? "Paid" : "Unpaid"}
        </Badge>

        {!record.isPaid && (
          <Button
            size="sm"
            onClick={markAsPaid}
            disabled={isPending}
            variant="outline"
          >
            {isPending ? "Updating..." : "Mark as Paid"}
          </Button>
        )}
      </div>
    </Card>
  );
}
