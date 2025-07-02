import { auth } from "@/auth";
import { db } from "@/lib/db";
import { ALUMINUMTYPE } from "@prisma/client";
import { z } from "zod";

export async function GET(req: Request) {
  const user = await auth();
  if (!user || user.user.role !== "ADMIN")
    return new Response("Unauthorize", { status: 401 });
  try {
    const now = new Date();
    const currentMonth = now.getMonth() + 1; // 0-indexed
    const currentYear = new Date().getFullYear();
    const archiveYear = currentYear - 1;

    const fyStartYear = currentMonth >= 4 ? currentYear : currentYear - 1;
    const fyEndYear = fyStartYear + 1;

    const start = String(fyStartYear).slice(-2);
    const end = String(fyEndYear).slice(-2);

    // const response = await db.order.findMany({});

    await db.order.updateMany({
      data: {
        archived: true,
      },
    });

    // response.map(async (res) => {
    //   return await db.order.update({
    //     where: {
    //       id: res.id,
    //     },
    //     data: {
    //       uniqueOrderNumber: `${archiveYear.toString().slice(-2)}-${currentYear
    //         .toString()
    //         .slice(-2)}/${res.orderNumber}`,
    //     },
    //   });
    // });

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
