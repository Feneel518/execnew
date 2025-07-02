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

    const quotationToArchive = await db.order.findMany({
      where: {
        createdAt: {
          gte: new Date(`${archiveYear}-04-01T00:00:00.000Z`),
          lt: new Date(`${currentYear}-04-01T00:00:00.000Z`),
        },
      },
      include: {
        Invoice: true,
        ProductInOrder: true,
        customer: true,
      },
    });

    await db.$transaction([
      ...quotationToArchive.map((q) =>
        db.archiveOrder.create({
          data: {
            originalId: q.id,
            uniqueOrderNumber: `${archiveYear
              .toString()
              .slice(-2)}-${currentYear.toString().slice(-2)}/${q.orderNumber}`,
            orderNumber: q.orderNumber!,
            customerId: q.customerId as string,
            notes: q.notes,
            poDate: q.poDate,
            poNumber: q.poNumber,
            quotationNumber: q.quotationNumber,
            status: q.status,
            orderPDFFile: q.orderPDFFile,
            ArchiveProductInOrder: {
              create: q.ProductInOrder?.map((item) => {
                return {
                  price: item?.price as number,
                  index: item?.index as number,
                  // productId: item?.productId,
                  quantity: item?.quantity as number,
                  description: item?.description,
                  orderId: q.id,
                  productId: item.id,
                };
              }),
            },
          },
        })
      ),
      // db.quotation.deleteMany({
      //   where: {
      //     createdAt: {
      //       gte: new Date(`${archiveYear}-04-01T00:00:00.000Z`),
      //       lt: new Date(`${currentYear}-04-01T00:00:00.000Z`),
      //     },
      //   },
      // }),
    ]);

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
