import { Job, Queue, QueueEvents, Worker } from "bullmq";
import { defaultQueueOptions, redisConnection } from "../queue";
import { db } from "../db";
import { QuotationCreationRequest } from "../Validators/QuotationValidator";
import ObjectID from "bson-objectid";
export const quotationCreationName = "quotationCreation";

export const quotationCreation = new Queue(quotationCreationName, {
  connection: redisConnection,
  defaultJobOptions: defaultQueueOptions,
});

export const queueWorker = new Worker(
  quotationCreationName,
  async (job: Job<{ quotation: QuotationCreationRequest }>) => {
    const { quotation } = job.data;

    const response = await db.quotation.upsert({
      where: {
        id: quotation.id ?? ObjectID().toString(),
      },
      create: {
        gst: quotation.gst,
        quotationNumber: quotation.quotationNumber,
        additionalNotes: quotation.additionalNotes,
        clientName: quotation.clientName ?? "",
        customerId: quotation.customerId ?? "",
        deliveryDate: quotation.deliveryDate ?? new Date(),
        deliverDateNew: quotation.deliverDateNew ?? "",
        discount: quotation.discount,
        packingCharges: quotation.packingCharges,
        paymentTerms: quotation.paymentTerms,
        transportationPayment: quotation.transportationPayment,
        ProductInQuotation: {
          create: quotation.items.map((product) => {
            return {
              productId: product.productId,
              index: product?.index,
              cableEntry: product?.cableEntry,
              cutoutSize: product?.cutoutSize,
              earting: product?.earting,
              gasket: product?.gasket,
              glass: product?.glass,
              hardware: product?.hardware,
              HorsePower: product?.HorsePower,
              hsnCode: product?.hsnCode,
              kW: product?.kW,
              plateSize: product?.plateSize,
              mounting: product?.mounting,
              poReferrence: product?.poReferrence,
              rating: product?.rating,
              rpm: product?.rpm,
              size: product?.size,
              terminals: product?.terminals,
              typeNumber: product?.typeNumber,
              variant: product?.variant,
              wireGuard: product?.wireGuard,
              price: Number(product?.price) ?? 1,
              quantity: product?.quantity,
              ComponentsOfProductInQuotation: {
                create: product.components?.map((comp) => {
                  return {
                    componentsOfQuotation: {
                      create: {
                        item: comp.items,
                      },
                    },
                  };
                }),
              },
            };
          }),
        },
      },
      update: {
        gst: quotation.gst,
        quotationNumber: quotation.quotationNumber,
        additionalNotes: quotation.additionalNotes,
        clientName: quotation.clientName ?? "",
        customerId: quotation.customerId ?? "",
        deliveryDate: quotation.deliveryDate ?? new Date(),
        deliverDateNew: quotation.deliverDateNew ?? "",
        discount: quotation.discount,
        packingCharges: quotation.packingCharges,
        paymentTerms: quotation.paymentTerms,
        transportationPayment: quotation.transportationPayment,
        ProductInQuotation: {
          upsert: quotation.items.map((product) => {
            return {
              where: {
                id: product.id ?? ObjectID().toString(),
              },
              create: {
                productId: product.productId,
                index: product?.index,
                cableEntry: product?.cableEntry,
                cutoutSize: product?.cutoutSize,
                earting: product?.earting,
                gasket: product?.gasket,
                glass: product?.glass,
                hardware: product?.hardware,
                HorsePower: product?.HorsePower,
                hsnCode: product?.hsnCode,
                kW: product?.kW,
                plateSize: product?.plateSize,
                mounting: product?.mounting,
                poReferrence: product?.poReferrence,
                rating: product?.rating,
                rpm: product?.rpm,
                size: product?.size,
                terminals: product?.terminals,
                typeNumber: product?.typeNumber,
                variant: product?.variant,
                wireGuard: product?.wireGuard,
                price: Number(product?.price) ?? 1,
                quantity: product?.quantity,
                ComponentsOfProductInQuotation: {
                  create: product.components?.map((comp) => {
                    return {
                      componentsOfQuotation: {
                        create: {
                          item: comp.items ?? "",
                        },
                      },
                    };
                  }),
                },
              },
              update: {
                productId: product.productId,
                index: product?.index,
                cableEntry: product?.cableEntry,
                cutoutSize: product?.cutoutSize,
                earting: product?.earting,
                gasket: product?.gasket,
                glass: product?.glass,
                hardware: product?.hardware,
                HorsePower: product?.HorsePower,
                hsnCode: product?.hsnCode,
                kW: product?.kW,
                plateSize: product?.plateSize,
                mounting: product?.mounting,
                poReferrence: product?.poReferrence,
                rating: product?.rating,
                rpm: product?.rpm,
                size: product?.size,
                terminals: product?.terminals,
                typeNumber: product?.typeNumber,
                variant: product?.variant,
                wireGuard: product?.wireGuard,
                price: Number(product?.price) ?? 1,
                quantity: product?.quantity,
                ComponentsOfProductInQuotation: {
                  upsert: product.components?.map((comp) => {
                    return {
                      where: {
                        componentsOfQuotationId:
                          comp.compId ?? ObjectID().toString(),
                      },
                      create: {
                        componentsOfQuotation: {
                          create: {
                            item: comp.items,
                          },
                        },
                      },
                      update: {
                        componentsOfQuotation: {
                          create: {
                            item: comp.items,
                          },
                        },
                      },
                    };
                  }),
                },
              },
            };
          }),
        },
      },
    });

    return response;
  },
  {
    connection: redisConnection,
  }
);
