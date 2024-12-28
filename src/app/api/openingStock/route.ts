import { auth } from "@/auth";
import { db } from "@/lib/db";
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
          {
            status: "IN",
          },
        ],
      },
    });

    await db.aluminumStock.createMany({
      data: oldStock.map((old) => {
        return {
          aluminumType: old.aluminumType,
          month: thisMonth,
          year: thisYear,
          status: old.status,
          weight: old.weight,
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
