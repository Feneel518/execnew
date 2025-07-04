import BoxSheet from "@/components/Dashboard/Invoice/BoxSheet";
import InvoicePage from "@/components/Dashboard/Invoice/InvoicePage";
import TestCertificate from "@/components/Dashboard/TestCertificate/TestCertificate";
import { db } from "@/lib/db";
import { getInvoiceDetailsBasedOnInvoiceNumber } from "@/lib/queries";
import { Lora } from "next/font/google";
import { FC } from "react";

interface pageProps {
  params: {
    invoiceNumber: string;
  };
}

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
const page: FC<pageProps> = async ({ params }) => {
  const invoiceData = await db.invoice.findUnique({
    where: {
      invoiceNumberSlug: params.invoiceNumber,
    },
    include: {
      order: {
        select: {
          orderNumber: true,
          poNumber: true,
          poDate: true,
          quotationNumber: true,
          customer: {
            select: {
              name: true,
              addressLine1: true,
              GST: true,
              pincode: true,
              state: true,
            },
          },
        },
      },
      ProductInInvoiceOfOrder: {
        include: {
          ProductInOrder: {
            select: {
              id: true,
              // index: true,
              index: true,
              price: true,
              quantity: true,
              supplied: true,
              description: true,
              certificateNumber: true,
              product: {
                select: {
                  name: true,
                  typeNumber: true,
                  protection: true,
                  gasGroup: true,
                  type: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!invoiceData) return;
  return (
    <div className="">
      <div
        className={` ${lora.className} flex flex-col items-center justify-center gap-4 print:gap-0 my-20 print:my-0`}
      >
        <InvoicePage invoiceData={invoiceData}></InvoicePage>
      </div>
    </div>
  );
};

export default page;
