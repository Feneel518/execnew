import {
  GST,
  PackingCharges,
  PaymentTerms,
  TransportationPayment,
} from "@prisma/client";
import { format } from "date-fns";
import { FC } from "react";

interface QuotationTermsShortProps {
  discount?: string;
  gst: GST;
  packingCharges: PackingCharges;
  transportation: TransportationPayment;
  delivery: string;
  payment: PaymentTerms;
  footer: React.ReactNode;
}

const QuotationTermsShort: FC<QuotationTermsShortProps> = ({
  discount,
  gst,
  packingCharges,
  transportation,
  delivery,
  payment,
  footer,
}) => {
  let gstData = "";
  let paymentData = "";
  switch (gst) {
    case "CGST_SGST_0_1":
      gstData = "CGST 0.05% & SGST 0.05%";
      break;
    case "CGST_SGST_12":
      gstData = "CGST 6% & SGST 6%";
      break;

    case "CGST_SGST_18":
      gstData = "CGST 9% & SGST 9%";
      break;

    case "CGST_SGST_28":
      gstData = "CGST 14% & SGST 14%";
      break;

    case "CGST_SGST_5":
      gstData = "CGST 2.5% & SGST 2.5%";
      break;

    case "IGST_0_1":
      gstData = "IGST 0.1% ";
      break;

    case "IGST_12":
      gstData = "IGST 12% ";
      break;

    case "IGST_18":
      gstData = "IGST 18% ";
      break;

    case "IGST_28":
      gstData = "IGST 28% ";
      break;

    case "IGST_5":
      gstData = "IGST 5% ";
      break;

    default:
      gstData = "";
      break;
  }
  switch (payment) {
    case "ADVANCE":
      paymentData = "Advance";
      break;
    case "AGAINST_PERFOMA_INVOICE":
      paymentData = "Against Perfoma Invoice";
      break;
    case "AGAINST_DELIVERY":
      paymentData = "Against Delivery";
      break;
    case "CREDIT_30":
      paymentData = "30 Days Credit ";
      break;
    case "CREDIT_45":
      paymentData = "45 Days Credit";
      break;
    case "CREDIT_60":
      paymentData = "60 Days Credit";
      break;
    default:
      paymentData = "Advance";
      break;
  }

  const termsData = [
    {
      section: "Scope of Quotation",
      points: [
        "This quotation is provided for the supply of flameproof items as specified in the accompanying documentation or as agreed upon between the parties.",
        "Any additional services or modifications beyond the scope of this quotation shall be subject to negotiation and may incur extra charges.",
      ],
    },
    {
      section: "Validity",
      points: [
        `This quotation is valid for a period of ${delivery} from the date of issuance, unless otherwise specified in writing.`,
        "Prices and availability of items are subject to change after the validity period.",
      ],
    },
    {
      section: "Price",
      points: [
        "The prices quoted are in rupees and are exclusive of any applicable taxes, duties, or shipping charges unless stated otherwise.",
        "Any taxes or duties imposed by the relevant authorities shall be the responsibility of the purchaser and added to the final invoice.",
      ],
    },
    {
      section: "Payment Terms",
      points: [
        `Payment terms are ${paymentData}, unless otherwise agreed upon in writing.`,
        "Payment shall be made in full within the specified period from the date of invoice.",
        "Late payments may incur interest at a rate of 0.7% per month on the outstanding balance.",
      ],
    },
    {
      section: "Delivery",
      points: [
        "Delivery dates are estimates and subject to availability of stock and manufacturing lead times.",
        "The seller shall not be liable for any delays in delivery beyond their control, including but not limited to acts of nature, transportation delays, or supplier issues.",
        "The risk of loss or damage to the items shall pass to the purchaser upon delivery.",
      ],
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="p-8 flex-1">
        <h1 className="text-center mb-4 underline underline-offset-4">
          Terms and Conditions.
        </h1>
        {discount && (
          <div className="grid grid-cols-2">
            <div className="">Discount</div>
            <div className="">: {discount}%</div>
          </div>
        )}
        {gst && (
          <div className="grid grid-cols-2">
            <div className="">GST</div>
            <div className="">: {gstData}</div>
          </div>
        )}
        {packingCharges && (
          <div className="grid grid-cols-2">
            <div className="">Packing Charges</div>
            <div className="">
              : {packingCharges === "EXCLUDED" ? "Excluded" : "Included"}
            </div>
          </div>
        )}
        {transportation && (
          <div className="grid grid-cols-2">
            <div className="">Transportation Options</div>
            <div className="">
              : {transportation === "PAID" ? "Paid" : "To Pay"}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2">
          <div className="">Delivery</div>
          <div className="">
            : within {delivery ? delivery : "4 Weeks"} from Purchase Order
          </div>
        </div>

        <div className="grid grid-cols-2">
          <div className="">Inspection</div>
          <div className="">: At our works only</div>
        </div>
        {payment && (
          <div className="grid grid-cols-2">
            <div className="">Payment Terms</div>
            <div className="">: {paymentData}</div>
          </div>
        )}

        <div className="mt-6 ">
          {termsData.map((terms, index) => {
            return (
              <div className="">
                <h1 className="font-bold">
                  {index + 1} {terms.section}:
                </h1>
                {terms.points.map((point, pointIndex) => {
                  return (
                    <p>
                      {index + 1}.{pointIndex + 1} {point}
                    </p>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
      {footer}
    </div>
  );
};

export default QuotationTermsShort;
