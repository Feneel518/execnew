import QuotationForm from "@/components/Dashboard/Quotations/QuotationForm";
import { db } from "@/lib/db";
import { FC } from "react";

interface pageProps {
  params: {
    id: string;
  };
}

const page: FC<pageProps> = async ({ params }) => {
  const quotation = await db.quotation.findUnique({
    where: {
      id: params.id,
    },
    include: {
      customer: {
        select: {
          id: true,
        },
      },
      ProductInQuotation: {
        include: {
          ComponentsOfProductInQuotation: {
            include: {
              componentsOfQuotation: {
                select: {
                  id: true,
                  item: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!quotation) return;
  return (
    <div>
      {/* @ts-ignore */}
      <QuotationForm quotationData={quotation}></QuotationForm>
    </div>
  );
};

export default page;
