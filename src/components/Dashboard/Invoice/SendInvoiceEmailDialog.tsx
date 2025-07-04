"use client";

import { FC, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { InvoiceTable } from "@/lib/types";
import { toast } from "@/components/ui/use-toast";
import Image from "next/image";

interface Props {
  open: boolean;
  onClose: () => void;
  invoice: InvoiceTable | null;
  email: string;
  setEmail: (value: string) => void;
}

const SendInvoiceEmailDialog: FC<Props> = ({
  open,
  onClose,
  invoice,
  email,
  setEmail,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  if (!invoice) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send Invoice Email</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-sm">
            <p>
              📄 <strong>Invoice No:</strong> {invoice.invoiceNumber}
            </p>
            <p>
              👤 <strong>Customer:</strong> {invoice.order.customer.name}
            </p>
            <p>
              🧾 <strong>PO No:</strong> {invoice.order.poNumber}
            </p>
            <p>
              📅 <strong>PO Date:</strong>{" "}
              {invoice.order.poDate?.toString().split("T")[0]}
            </p>
            <p>
              🧮 <strong>Products:</strong>{" "}
              {invoice.ProductInInvoiceOfOrder.length}
            </p>
            <p>
              🧮 <strong>LR Details:</strong> {invoice.LrNumber} -{" "}
              {invoice.transportName}
            </p>
            {invoice.LrUrl && (
              <div className="relative size-40">
                <Image
                  src={invoice.LrUrl}
                  alt="LR Number"
                  fill
                  className="object-contain"
                ></Image>
              </div>
            )}
          </div>

          <Input
            placeholder="Enter recipient email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Button
            disabled={!invoice.LrNumber || !invoice.transportName || isLoading}
            className="w-full"
            onClick={async () => {
              if (!invoice) return;

              try {
                setIsLoading(true);
                if (!email || !email.includes("@")) {
                  toast({ description: "Please enter a valid email address." });
                  return;
                }
                const res = await fetch("/api/send-invoice-email", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    to: email,
                    invoiceNumber: invoice.invoiceNumber,
                    customerName: invoice.order.customer.name,
                    poNumber: invoice.order.poNumber,
                    poDate: invoice.order.poDate,
                    productCount: invoice.ProductInInvoiceOfOrder.length,
                    lrNumber: invoice.LrNumber,
                    transporterName: invoice.transportName,
                    lrUrl: invoice.LrUrl,
                    slug: invoice.invoiceNumberSlug,
                  }),
                });

                const data = await res.json();
                setIsLoading(false);

                if (data.success) {
                  toast({ description: "✅ Email sent successfully!" });
                  setEmail("");
                  onClose(); // close the modal
                  setIsLoading(false);
                } else {
                  setIsLoading(false);

                  toast({
                    description: "❌ Failed to send email.",
                    variant: "destructive",
                  });
                }
              } catch (error) {
                toast({
                  description: "⚠️ Unexpected error occurred.",
                  variant: "destructive",
                });
              }
            }}
          >
            {isLoading ? "Sending" : "Send"} Email
          </Button>
          {(!invoice.LrNumber || !invoice.transportName) && (
            <p className="text-xs text-red-400 ">
              Please add Lr Number and Transporter name to send mail
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SendInvoiceEmailDialog;
