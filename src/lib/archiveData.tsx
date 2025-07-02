"use server";

import { db } from "./db";

export const archiveData = async () => {
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
};
