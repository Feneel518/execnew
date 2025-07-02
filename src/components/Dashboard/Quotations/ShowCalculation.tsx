"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import { FC, useState } from "react";

interface ShowCalculationProps {
  quotationTotal: number;
}

const ShowCalculation: FC<ShowCalculationProps> = ({ quotationTotal }) => {
  const discounts = [0, 1, 2, 2.5, 3, 5, 7.5, 8, 10, 12, 15];
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col items-center justify-center gap-8 print:hidden">
      <div>
        <Button
          onClick={() => {
            setShow(!show);
          }}
          className="print:hidden"
        >
          {show ? "Hide Calculation" : "Show Calculation"}
        </Button>
      </div>
      {show && (
        <div className="text-white flex flex-col gap-4 transition-all duration-300 ease-in-out">
          <div className="grid grid-cols-4 gap-8">
            <div className="">Item</div>
            <div className="">Net Total</div>
            <div className="">GST Total</div>
            <div className="">Discount Amount</div>
          </div>
          {discounts.map((disc) => {
            return (
              <>
                <div className="grid grid-cols-4 gap-8">
                  <div className="">
                    {disc === 0 ? "Quotation total" : `${disc}% discount`}
                  </div>
                  <div className="">
                    {formatPrice(
                      quotationTotal *
                        (disc === 0 ? 100 / 100 : (100 - disc) / 100),
                      true
                    )}
                  </div>
                  <div className="">
                    {formatPrice(
                      quotationTotal *
                        (disc === 0 ? 100 / 100 : (100 - disc) / 100) *
                        1.18,
                      true
                    )}
                  </div>
                  <div className="">
                    {formatPrice(
                      quotationTotal * (disc === 0 ? 0 / 100 : disc / 100),

                      true
                    )}
                  </div>
                </div>
                <Separator></Separator>
              </>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ShowCalculation;
