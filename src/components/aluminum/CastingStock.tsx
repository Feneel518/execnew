import { getCastingStock } from "@/lib/aluminumQueries";
import { FC } from "react";

interface CastingStockProps {}

const CastingStock: FC<CastingStockProps> = async ({}) => {
  const casting = await getCastingStock();

  return (
    <div>
      {casting?.success?.map((cast) => {
        return (
          <div className="">
            {cast.name}
            {cast.ProductsForCasting.map((cas) => {
              return (
                <div className="">
                  {cas.casting.name}{" "}
                  {cas.casting.CastingForTransaction.map((a) => {
                    return (
                      <div className="">
                        {a.quantity} {a.weight}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default CastingStock;
