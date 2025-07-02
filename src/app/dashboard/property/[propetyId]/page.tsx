// app/dashboard/property/[id]/page.tsx

import { db } from "@/lib/db";
import { notFound, redirect } from "next/navigation";

import { AddElectricityDialog } from "@/components/Dashboard/Property/AddElectricityDialog";
import { AddTenantDialog } from "@/components/Dashboard/Property/AddTenantDialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AddPaymentDialog } from "@/components/Dashboard/Property/AddPaymentDialog";
import VacateTenant from "@/components/Dashboard/Property/VacateTenant";
import Link from "next/link";
import { format } from "date-fns";

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ propetyId: string }>;
}) {
  const { propetyId } = await params;
  if (!propetyId) redirect("/dashboard/property");

  const property = await db.property.findUnique({
    where: { id: propetyId },
    include: {
      tenant: {
        orderBy: { createdAt: "desc" },
        include: { Payment: { orderBy: { date: "desc" } } },
      },
      records: { orderBy: { createdAt: "desc" } },
    },
  });

  const currentMonth = format(new Date(), "MMM-yyyy");

  const alreadyExists = await db.electricityReading.findFirst({
    where: { propertyId: propetyId, month: currentMonth },
  });

  const disabled = !!alreadyExists;

  if (!property) return notFound();
  const activeTenant = property.tenant.find((t) => t.isActive);

  const rent = property.rent;
  const electricity = property.records
    .filter((r) => r.tenantId === activeTenant?.id)
    .reduce((sum, r) => sum + (r.lightBill ?? 0), 0);

  const totalRentDue = property.records
    .filter((r) => r.tenantId === activeTenant?.id)
    .reduce((sum, r) => sum + r.totalAmount, 0);

  const openingBalance = activeTenant?.openingBalance || 0;
  const totalPaid =
    activeTenant?.Payment.reduce((sum, p) => sum + p.amount, 0) || 0;

  const outstanding = totalRentDue + openingBalance - totalPaid;

  const hasActiveTenant = property.tenant.some((t) => t.isActive);

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <div className="border rounded-lg p-4 bg-muted/10">
          <h4 className="text-md font-semibold mb-2">Current Summary</h4>
          <ul className="text-sm space-y-1">
            <li>🏠 Rent: ₹{rent}</li>
            <li>💡 Electricity: ₹{electricity}</li>
            <li>📌 Opening Balance: ₹{openingBalance}</li>
            <li className="font-medium">
              🧾 Total Payable this month: ₹{totalRentDue.toFixed(2)}
            </li>
            <li>💸 Paid: ₹{totalPaid.toFixed(2)}</li>
            <li className="font-semibold text-red-600">
              {openingBalance < 0 ? (
                <span className="text-green-600">
                  Surplus ₹{openingBalance.toFixed(2)}
                </span>
              ) : openingBalance > 0 ? (
                <span className="text-red-600">
                  Due ₹{Math.abs(openingBalance).toFixed(2)}
                </span>
              ) : (
                "₹0.00"
              )}
            </li>
          </ul>
        </div>
      </Card>
      <Card className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold">{property.name}</h2>
            <p className="text-muted-foreground">{property.address}</p>
            <p className="mt-1">Monthly Rent: ₹{property.rent}</p>
            <p className="mt-1 text-sm font-semibold text-destructive">
              Outstanding Amount: ₹{outstanding.toFixed(2)}
            </p>
          </div>

          <div className="flex gap-2">
            <AddTenantDialog
              propertyId={property.id}
              triggerButton={
                hasActiveTenant ? (
                  <Button variant="outline">Replace Tenant</Button>
                ) : undefined
              }
            />
            <AddElectricityDialog
              propertyId={property.id}
              disabled={disabled}
            />
            {activeTenant && <AddPaymentDialog tenantId={activeTenant.id} />}
          </div>
        </div>

        {/* Tenant Info */}
        <div className="border rounded-xl p-4 bg-muted/20">
          <h3 className="text-lg font-semibold mb-2">Tenant Details</h3>
          {activeTenant ? (
            <>
              <p>👤 {activeTenant.name}</p>
              <p>📞 {activeTenant.contact}</p>
              {activeTenant.email && <p>📧 {activeTenant.email}</p>}
              <p>Opening Balance: ₹{activeTenant.openingBalance.toFixed(2)}</p>
              <VacateTenant propertyId={propetyId} tenantId={activeTenant.id} />
            </>
          ) : (
            <p className="text-muted-foreground italic">
              No tenant assigned to this property yet.
            </p>
          )}
        </div>

        {/* Rent Records Table */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Rent Records</h3>
          {property.records.length ? (
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-4">Rent Records</h3>
              <div className="border rounded-lg overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left px-4 py-2">Month</th>
                      <th className="text-left px-4 py-2">Rent</th>
                      <th className="text-left px-4 py-2">Light Bill</th>
                      <th className="text-left px-4 py-2">Total</th>
                      <th className="text-left px-4 py-2">Paid</th>
                    </tr>
                  </thead>
                  <tbody>
                    {property.records.map((record) => (
                      <tr
                        key={record.id}
                        className="border-t hover:bg-accent/30 transition-colors"
                      >
                        <td className="px-4 py-2">{record.month}</td>
                        <td className="px-4 py-2">
                          <Link
                            href={`/dashboard/rent/${record.id}/invoice`}
                            className="text-blue-600 underline hover:text-blue-800"
                          >
                            ₹{record.rentAmount.toFixed(2)}
                          </Link>
                        </td>
                        <td className="px-4 py-2">
                          ₹{record.lightBill?.toFixed(2) ?? "0.00"}
                        </td>
                        <td className="px-4 py-2">
                          ₹{record.totalAmount.toFixed(2)}
                        </td>
                        <td className="px-4 py-2">
                          {record.isPaid ? "✅ Paid" : "❌ Not Paid"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground italic mt-4">
              No rent records yet.
            </p>
          )}
        </div>

        {/* Payment History Table */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Payment History</h3>
          {activeTenant?.Payment?.length ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border rounded-md">
                <thead className="bg-muted text-left">
                  <tr>
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">Amount</th>
                    <th className="px-4 py-2">Mode</th>
                    <th className="px-4 py-2">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {activeTenant.Payment.map((p) => (
                    <tr key={p.id} className="border-t">
                      <td className="px-4 py-2">
                        {new Date(p.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2">₹{p.amount.toFixed(2)}</td>
                      <td className="px-4 py-2">{p.mode || "-"}</td>
                      <td className="px-4 py-2">{p.note || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted-foreground italic">
              No payments recorded yet.
            </p>
          )}
        </div>

        {/* Past Tenants */}
        {property.tenant.some((t) => !t.isActive) && (
          <div className="mt-10">
            <h3 className="text-xl font-semibold mb-4">Past Tenants</h3>
            <div className="border rounded-lg overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left px-4 py-2">Name</th>
                    <th className="text-left px-4 py-2">Contact</th>
                    <th className="text-left px-4 py-2">Email</th>
                    <th className="text-left px-4 py-2">Stay Period</th>
                    <th className="text-left px-4 py-2">Opening Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {property.tenant
                    .filter((t) => !t.isActive)
                    .map((tenant) => (
                      <tr key={tenant.id} className="border-t">
                        <td className="px-4 py-2">{tenant.name}</td>
                        <td className="px-4 py-2">{tenant.contact}</td>
                        <td className="px-4 py-2">{tenant.email || "-"}</td>
                        <td className="px-4 py-2">
                          {new Date(tenant.createdAt).toLocaleDateString()} →{" "}
                          {tenant.vacatedOn
                            ? new Date(tenant.vacatedOn).toLocaleDateString()
                            : "Not specified"}
                        </td>
                        <td className="px-4 py-2">
                          ₹{tenant.openingBalance.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
