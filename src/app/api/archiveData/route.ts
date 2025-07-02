import { auth } from "@/auth";
import { db } from "@/lib/db";
import { ALUMINUMTYPE } from "@prisma/client";
import { z } from "zod";

export async function GET(req: Request) {
  const user = await auth();
  if (!user || user.user.role !== "ADMIN")
    return new Response("Unauthorize", { status: 401 });
  try {
    const currentYear = new Date().getFullYear();
    const archiveYear = currentYear - 1;

    const quotationToArchive = await db.quotation.findMany({
      where: {
        createdAt: {
          gte: new Date(`${archiveYear}-04-01T00:00:00.000Z`),
          lt: new Date(`${currentYear}-04-01T00:00:00.000Z`),
        },
      },
      include: {
        ProductInQuotation: true,
        customer: true,
      },
    });

    await db.$transaction([
      ...quotationToArchive.map((q) =>
        db.archivedQuotation.create({
          data: {
            originalId: q.id,
            clientName: q.clientName,
            quotationNumber: q.quotationNumber,
            additionalNotes: q.additionalNotes,
            gst: q.gst,
            packingCharges: q.packingCharges,
            paymentTerms: q.paymentTerms,
            transportationPayment: q.transportationPayment,
            deliveryDate: q.deliveryDate,
            deliverDateNew: q.deliverDateNew,
            discount: q.discount,
            createdAt: q.createdAt,
            customerId: q.customerId,
            orderNumber: q.orderNumber,
            ArchivedProductInQuotation: {
              create: q.ProductInQuotation.map((prod) => {
                return {
                  price: prod.price,
                  quotationId: prod.quotationId,
                  cableEntry: prod.cableEntry,
                  cutoutSize: prod.cutoutSize,
                  earting: prod.earting,
                  gasket: prod.gasket,
                  glass: prod.glass,
                  hardware: prod.hardware,
                  HorsePower: prod.HorsePower,
                  hsnCode: prod.hsnCode,
                  index: prod.index,
                  kW: prod.kW,
                  mounting: prod.mounting,
                  plateSize: prod.plateSize,
                  poReferrence: prod.poReferrence,
                  quantity: prod.quantity,
                  rating: prod.rating,
                  rpm: prod.rpm,
                  size: prod.size,
                  terminals: prod.terminals,
                  typeNumber: prod.typeNumber,
                  variant: prod.variant,
                  wireGuard: prod.wireGuard,
                  createdAt: prod.createdAt,
                  updatedAt: prod.updatedAt,
                  productId: prod.productId,
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
