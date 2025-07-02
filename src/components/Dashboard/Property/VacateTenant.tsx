"use client";

import { Button } from "@/components/ui/button";
import { Toast } from "@/components/ui/toast";
import { vacateTenant } from "@/lib/propertyQueries";
import { useRouter } from "next/navigation";
import { FC, useTransition } from "react";

interface VacateTenantProps {
  tenantId: string;
  propertyId: string;
}

const VacateTenant: FC<VacateTenantProps> = ({ propertyId, tenantId }) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleVacate = () => {
    startTransition(async () => {
      const res = await vacateTenant(tenantId, propertyId);
      if (res?.success) {
        Toast({ title: "Tenant vacated successfully" });
        router.refresh();
      } else {
        Toast({ title: res?.error || "Failed to vacate tenant" });
      }
    });
  };
  return (
    <Button
      variant="destructive"
      size="sm"
      className="mt-2"
      onClick={handleVacate}
      disabled={isPending}
    >
      Vacate Tenant
    </Button>
  );
};

export default VacateTenant;
