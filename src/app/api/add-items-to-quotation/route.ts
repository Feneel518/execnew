import { auth } from "@/auth";
import { db } from "@/lib/db";
import ObjectID from "bson-objectid";
import { NextApiRequest, NextApiResponse } from "next";
import { redirect } from "next/navigation";

interface QuotationItems {
  id?: string;
  price: string;
  index: number;
  quantity: string;
  cableEntry: string;
  cutoutSize: string;
  earting: string;
  gasket: string;
  glass: string;
  hardware: string;
  HorsePower: string;
  hsnCode: string;
  kW: string;
  mounting: string;
  plateSize: string;
  poReferrence: string;
  productId: string;
  rating: string;
  rpm: string;
  size: string;
  terminals: string;
  typeNumber: string;
  variant: string;
  wireGuard: string;
  components: [
    {
      compId: string;
      items: string;
    }
  ];
}

interface AddItemsRequest extends NextApiRequest {
  body: {
    quotationId: string;
    items: QuotationItems[];
  };
}

export async function POST(req: Request, res: Response) {
  const user = await auth();
  if (!user || user.user.role !== "ADMIN") return null;

  try {
    const {
      data,
    }: {
      data: {
        quotationId: string;
        items: QuotationItems[];
      };
    } = await req.json();

    const { items, quotationId } = data;

    const quotation = await db.quotation.findUnique({
      where: {
        id: quotationId,
      },
    });
    if (!quotation)
      return new Response("Quotation id is not provided", { status: 402 });

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
          create: items.map((product) => {
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
          upsert: items.map((product) => {
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

    return new Response("Ok");
  } catch (error: any) {
    console.error("Error adding items:", error);
    return new Response(error.message, { status: 500 });
  }
}
