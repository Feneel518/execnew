import { AddPropertyDialog } from "@/components/Dashboard/Property/AddPropertyDialog";
import { PropertyCard } from "@/components/Dashboard/Property/PropertyCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { db } from "@/lib/db"; // Assuming Prisma
import { Plus } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Properties",
};

export default async function PropertyListPage() {
  const properties = await db.property.findMany({
    include: {
      tenant: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <Card className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">All Properties</h2>
        <AddPropertyDialog
          type="add"
          triggerButton={
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add New Property
            </Button>
          }
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            id={property.id}
            name={property.name}
            address={property.address}
            rent={property.rent}
            tenantName={property.tenant.find((t) => t.isActive)?.name}
          />
        ))}
      </div>
    </Card>
  );
}
