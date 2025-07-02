"use server";

import { auth } from "@/auth";
import {
  addPropertySchema,
  addPropertySchemaRequest,
  TenantFormValues,
  tenantSchema,
} from "./Validators/AllPropertyValidators";
import ObjectID from "bson-objectid";
import { db } from "./db";
import { revalidatePath } from "next/cache";
import { format, subMonths } from "date-fns";

export const upsertProperty = async (values: addPropertySchemaRequest) => {
  const user = await auth();

  if (!user || user.user.email?.toLowerCase() !== "feneelp@gmail.com") {
    return null;
  }

  const parsed = addPropertySchema.safeParse(values);

  if (!parsed.success || !parsed) {
    return {
      error: "Check Input fields and try again.",
    };
  }
  const data = parsed.data;

  if (!data.id) {
    data.id = ObjectID().toString();
  }

  const response = await db.property.upsert({
    where: {
      id: data.id,
    },
    create: {
      address: data.address,
      name: data.name,
      rent: data.rent,
    },
    update: {
      address: data.address,
      name: data.name,
      rent: data.rent,
    },
  });

  if (response) {
    return {
      success: response,
    };
  } else {
    return {
      error: "Something went wrong, could not create your property.",
    };
  }
};

export const deleteProperty = async (id: string) => {
  const user = await auth();

  if (!user || user.user.email?.toLowerCase() !== "feneelp@gmail.com") {
    return null;
  }

  const response = await db.property.delete({
    where: {
      id,
    },
  });

  if (response) {
    return {
      success: response,
    };
  } else {
    return {
      error: "Something went wrong, could not delete your property.",
    };
  }
};

export const addTenant = async (values: TenantFormValues) => {
  const user = await auth();

  if (!user || user.user.email?.toLowerCase() !== "feneelp@gmail.com") {
    return null;
  }

  const parsed = tenantSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: "Invalid input" };
  }

  const { name, contact, email, openingBalance, propertyId } = parsed.data;

  try {
    await db.$transaction([
      // Deactivate existing tenant(s)
      db.tenant.updateMany({
        where: {
          propertyId,
          isActive: true,
        },
        data: {
          isActive: false,
          vacatedOn: new Date(),
        },
      }),

      // Create new tenant
      db.tenant.create({
        data: {
          name,
          contact,
          email,
          openingBalance,
          propertyId,
          isActive: true,
        },
      }),
    ]);

    revalidatePath(`/dashboard/property/${propertyId}`);
    return { success: true };
  } catch (error) {
    console.error("[addTenantToProperty]", error);
    return { error: "Something went wrong" };
  }
};

export async function vacateTenant(tenantId: string, propertyId: string) {
  const user = await auth();

  if (!user || user.user.email?.toLowerCase() !== "feneelp@gmail.com") {
    return null;
  }
  try {
    await db.tenant.update({
      where: { id: tenantId },
      data: {
        isActive: false,
        vacatedOn: new Date(),
      },
    });

    revalidatePath(`/dashboard/property/${propertyId}`);
    return { success: true };
  } catch (error) {
    console.error("[vacateTenant]", error);
    return { error: "Failed to vacate tenant" };
  }
}

export async function generateRentRecord({
  propertyId,
}: {
  propertyId: string;
}) {
  const user = await auth();

  if (!user || user.user.email?.toLowerCase() !== "feneelp@gmail.com") {
    return null;
  }

  const property = await db.property.findUnique({
    where: { id: propertyId },
    include: {
      tenant: {
        where: { isActive: true },
        take: 1,
      },
    },
  });

  const activeTenant = property?.tenant[0];
  if (!activeTenant) {
    return {
      success: false,
      skipped: true,
      reason: "No active tenant",
      propertyId,
    };
  }

  const month = format(subMonths(new Date(), 1), "MMM-yyyy");

  const existing = await db.rentRecord.findFirst({
    where: {
      propertyId,
      tenantId: activeTenant.id,
      month,
    },
  });

  if (existing)
    return { success: false, error: "Rent already generated for this month." };

  const rentAmount = property.rent;

  const gstRate = 0.18;
  const gstAmount = property.rent * gstRate;
  const rentWithGst = property.rent + gstAmount;
  await db.rentRecord.create({
    data: {
      propertyId,
      tenantId: activeTenant.id,
      month,
      rentAmount: rentWithGst,
      totalAmount: rentWithGst, // will include lightBill later
    },
  });

  return { success: true };
}

export async function addElectricityReading({
  propertyId,
  reading,
  unitRate,
  previousReadingInput,
}: {
  propertyId: string;
  reading: number;
  unitRate: number;
  previousReadingInput?: number;
}) {
  const month = format(subMonths(new Date(), 1), "MMM-yyyy");

  // ✅ 0. Check if already exists for this property and month
  const existing = await db.electricityReading.findFirst({
    where: {
      propertyId,
      month,
    },
  });

  if (existing) {
    return {
      success: false,
      message: `Electricity reading for ${month} already exists.`,
    };
  }
  // 1. Get the previous reading
  const previousReading = await db.electricityReading.findFirst({
    where: { propertyId },
    orderBy: { createdAt: "desc" },
  });

  // 3. Calculate used units
  const lastUnit = previousReading
    ? previousReading.reading
    : previousReadingInput ?? 0;

  const usedUnits = reading - lastUnit;
  const lightBill = usedUnits * unitRate;

  // console.log(lastUnit, usedUnits, lightBill);

  // 2. Create new ElectricityReading
  await db.electricityReading.create({
    data: {
      propertyId,
      month,
      reading,
      unitRate,
    },
  });

  // 3. Update RentRecord with lightBill and totalAmount
  const rentRecord = await db.rentRecord.findFirst({
    where: {
      propertyId,
      month,
    },
  });

  if (rentRecord) {
    await db.rentRecord.update({
      where: { id: rentRecord.id },
      data: {
        lightBill,
        totalAmount: rentRecord.rentAmount + lightBill,
      },
    });
  }
  return {
    success: true,
    usedUnits,
    lightBill,
    updatedRentRecord: !!rentRecord,
  };
}

export async function addPayment({
  tenantId,
  rentId,
  amount,
  mode,
  note,
}: {
  tenantId: string;
  rentId?: string;
  amount: number;
  mode?: string;
  note?: string;
}) {
  if (!tenantId || !amount) {
    return { success: false, error: "Missing required fields" };
  }

  // 1. Fetch tenant and unpaid rent records
  const tenant = await db.tenant.findUnique({
    where: { id: tenantId },
    include: {
      RentRecord: {
        where: { isPaid: false },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!tenant) {
    return { success: false, error: "Tenant not found" };
  }

  // 2. Create the payment record (not yet linked to specific rent if applying to multiple)
  await db.payment.create({
    data: {
      tenantId,
      rentId,
      amount,
      mode,
      note,
    },
  });

  let remaining = amount + tenant.openingBalance;

  // 3. Apply payment to unpaid rent records
  for (const record of tenant.RentRecord) {
    if (remaining >= record.totalAmount) {
      await db.rentRecord.update({
        where: { id: record.id },
        data: {
          isPaid: true,
          paidOn: new Date(),
          partialPaid: record.totalAmount,
        },
      });
      remaining -= record.totalAmount;
    } else if (remaining > 0) {
      await db.rentRecord.update({
        where: { id: record.id },
        data: {
          partialPaid: (record.partialPaid ?? 0) + remaining,
        },
      });
      remaining = 0;
      break;
    }
  }

  // 4. Update opening balance with leftover amount
  await db.tenant.update({
    where: { id: tenantId },
    data: {
      openingBalance: remaining,
    },
  });

  return { success: true };
}
