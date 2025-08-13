import { db } from "@/lib/db";
import { FC } from "react";

interface pageProps {}

const page: FC<pageProps> = async ({}) => {
  const product = await db.product.findMany({
    select: {
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  });
  return (
    <div className="max-w-[210mm] min-h-[297mm] border grid grid-cols-3">
      {product.map((prod, index) => {
        return (
          <div className="text-white text-xs">
            {index + 1}. {prod.name}
          </div>
        );
      })}
    </div>
  );
};

export default page;
