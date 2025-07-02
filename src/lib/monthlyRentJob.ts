import { db } from "@/lib/db";
import { generateRentRecord } from "./propertyQueries";
export async function runMonthlyRentGeneration() {
  const properties = await db.property.findMany({
    select: { id: true },
  });

  const results = [];

  for (const property of properties) {
    const result = await generateRentRecord({ propertyId: property.id });
    results.push({ propertyId: property.id, ...result });
  }

  return {
    success: true,
    message: `Processed ${properties.length} properties.`,
    results,
  };
}
