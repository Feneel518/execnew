import { getCastingStock } from "@/lib/aluminumQueries";
import { FC } from "react";
import { Card, CardContent } from "../ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

interface CastingStockProps {}

const CastingStock: FC<CastingStockProps> = async ({}) => {
  const casting = await getCastingStock();

  return (
    <Card className="">
      <div className="flex items-center justify-between">
        <div className="text-3xl px-8 py-4">Casting Stock</div>
      </div>
      <Card className="border-b-0 shadow-none">
        <CardContent>
          {" "}
          <Accordion type="single" collapsible className="w-full">
            {casting?.success?.map((cast, index) => {
              return (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger>{cast.name}</AccordionTrigger>
                  <AccordionContent>
                    <div className="">
                      {cast.ProductsForCasting.map((cas, ind) => {
                        return (
                          <div key={ind} className="">
                            {cas.casting.name}
                          </div>
                        );
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </CardContent>
      </Card>
    </Card>
    // <div>
    //   {casting?.success?.map((cast) => {
    //     return (
    //       <div className="">
    //         {cast.name}
    //         {cast.ProductsForCasting.map((cas) => {
    //           return (
    //             <div className="">
    //               {cas.casting.name}{" "}
    //               {cas.casting.CastingForTransaction.map((a) => {
    //                 return (
    //                   <div className="">
    //                     {a.quantity} {a.weight}
    //                   </div>
    //                 );
    //               })}
    //             </div>
    //           );
    //         })}
    //       </div>
    //     );
    //   })}
    // </div>
  );
};

export default CastingStock;
