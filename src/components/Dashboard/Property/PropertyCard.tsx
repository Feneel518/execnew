"use client";

import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { AddPropertyDialog } from "./AddPropertyDialog";
import { useState } from "react";
import { deleteProperty } from "@/lib/propertyQueries";

export function PropertyCard({
  id,
  name,
  address,
  rent,
  tenantName,
}: {
  id: string;
  name: string;
  address: string;
  rent: number;
  tenantName?: string;
}) {
  const router = useRouter();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const handleDelete = async () => {
    const confirmed = confirm(`Are you sure you want to delete ${name}?`);
    if (!confirmed) return;
    const response = await deleteProperty(id);

    if (response?.success) {
      toast({
        title: "Property deleted successfully.",
      });

      router.refresh();
    } else {
      toast({ title: response?.error });
    }
  };

  return (
    <div className="relative border rounded-xl p-4 shadow-sm hover:shadow-md transition bg-white">
      {/* Dropdown Menu */}
      <div className="absolute top-2 right-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost" className="h-6 w-6">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/property/${id}`}>Open Property</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
              Edit Property
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDelete}
              className="text-red-500 focus:text-red-600"
            >
              Delete Property
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Property Info */}
      <Link href={`/dashboard/property/${id}`} className="block space-y-1">
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-sm text-muted-foreground">{address}</p>
        <p className="text-sm">Rent: ₹{rent}</p>
        <p className="text-sm text-muted-foreground">
          Tenant: {tenantName || "Vacant"}
        </p>
      </Link>

      <>
        <AddPropertyDialog
          type="edit"
          propertyId={id}
          initialValues={{ name, address, rent }}
          triggerButton={null}
          // open controlled externally
          key={id} // force re-render if needed
          externalOpen={isEditOpen}
          onOpenChange={setIsEditOpen}
        />
      </>
    </div>
  );
}
