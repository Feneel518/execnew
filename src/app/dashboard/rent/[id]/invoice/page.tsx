import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import RentInvoiceHeading from "@/components/Dashboard/Property/RentInvoiceHeading";

export const metadata: Metadata = {
  title: "Rent Invoice",
};

export default async function RentInvoicePage({
  params,
}: {
  params: { id: string };
}) {
  const rent = await db.rentRecord.findUnique({
    where: { id: params.id },
    include: {
      property: {
        include: {
          tenant: {
            where: { isActive: true },
          },
        },
      },
    },
  });

  if (!rent || !rent.property) return notFound();

  const tenant = rent.property.tenant?.[0];

  return (
    <div className="flex justify-center p-4 print:p-0">
      <div className="w-[210mm] h-[297mm] bg-white text-black shadow-[rgba(0,_0,_0,_0.4)_0px_30px_90px] flex flex-col scale-[60%] sm:scale-75 md:scale-100 print:scale-100 print:shadow-none print:w-full print:h-auto print:overflow-visible print:bg-white">
        {/* Header with logo + tenant + invoice info */}
        <RentInvoiceHeading
          tenant={{
            name: tenant?.name || "N/A",
            contact: tenant?.contact || "N/A",
            email: tenant?.email || undefined,
          }}
          invoiceNumber={rent.id.slice(0, 6).toUpperCase()}
          month={rent.month}
          createdAt={rent.createdAt}
        />

        {/* Main Invoice Content */}
        <div className="flex-grow px-8 py-6 flex flex-col gap-6">
          {/* Property Info */}
          <div className="grid grid-cols-2 text-sm">
            <div>
              <h3 className="font-semibold">Property Details</h3>
              <p className="mt-1">{rent.property.name}</p>
              <p>{rent.property.address}</p>
            </div>
          </div>

          {/* Invoice Table */}
          <div>
            <table className="w-full text-sm border mt-4">
              <thead className="bg-muted text-left">
                <tr>
                  <th className="p-2 border">Description</th>
                  <th className="p-2 border text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 border">Rent</td>
                  <td className="p-2 border text-right">
                    {rent.rentAmount.toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td className="p-2 border">Light Bill</td>
                  <td className="p-2 border text-right">
                    {(rent.lightBill || 0).toFixed(2)}
                  </td>
                </tr>
                {tenant?.openingBalance > 0 && (
                  <tr>
                    <td className="p-2 border">Opening Balance</td>
                    <td className="p-2 border text-right">
                      {tenant.openingBalance.toFixed(2)}
                    </td>
                  </tr>
                )}
                <tr className="font-bold">
                  <td className="p-2 border">Total</td>
                  <td className="p-2 border text-right">
                    ₹
                    {(rent.totalAmount + (tenant?.openingBalance || 0)).toFixed(
                      2
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Footer Note */}
          <div className="mt-auto border-t pt-4 text-xs text-muted-foreground">
            <p>Generated on {new Date().toLocaleDateString()}</p>
            <p>Thank you for your business!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
