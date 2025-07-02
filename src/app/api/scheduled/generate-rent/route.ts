// app/api/scheduled/generate-rent/route.ts
import { NextResponse } from "next/server";
import { runMonthlyRentGeneration } from "@/lib/monthlyRentJob";

export async function GET() {
  const result = await runMonthlyRentGeneration();

  return NextResponse.json(result);
}
