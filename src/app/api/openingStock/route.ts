import { auth } from "@/auth";
import { db } from "@/lib/db";
import { ALUMINUMTYPE } from "@prisma/client";
import { z } from "zod";

export async function GET(req: Request) {
  const user = await auth();
  if (!user || user.user.role !== "ADMIN")
    return new Response("Unauthorize", { status: 401 });
  try {
    const thisMonth = new Date().getUTCMonth();
    const thisYear = new Date().getFullYear();

    let oldMonth: number;
    let oldYear: number;
    if (thisMonth === 0) {
      oldMonth = 11;
      oldYear = thisYear - 1;
    } else {
      oldMonth = thisMonth - 1;
      oldYear = thisYear;
    }

    const oldStock = await db.aluminumStock.findMany({
      where: {
        AND: [
          {
            month: oldMonth,
          },
          {
            year: oldYear,
          },
        ],
      },
    });

    const groupedData: Record<string, { IN: number; OUT: number }> =
      oldStock.reduce((acc, item) => {
        const { aluminumType, weight, status } = item;

        // @ts-ignore
        if (!acc[aluminumType]) {
          // @ts-ignore
          acc[aluminumType] = { IN: 0, OUT: 0 };
        }

        // @ts-ignore
        acc[aluminumType][status] += weight;

        return acc;
      }, {});

    const openingStock = Object.entries(groupedData).map(
      ([aluminumType, item]) => {
        return {
          aluminumType: aluminumType,
          in: item.IN,
          out: item.OUT,
        };
      }
    );

    await db.aluminumStock.createMany({
      data: openingStock.map((old) => {
        return {
          aluminumType: old.aluminumType as ALUMINUMTYPE,
          month: thisMonth,
          year: thisYear,
          status: "IN",
          weight: old.in - old.out,
        };
      }),
    });

    return new Response("Ok");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }
    return new Response(
      "Could not update the oepning stock, please try again later",
      { status: 500 }
    );
  }
}
