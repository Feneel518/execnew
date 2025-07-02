import Heading from "@/components/Global/Heading";
import { Customer } from "@prisma/client";
import { format } from "date-fns";
import { FC } from "react";

interface OrderHeadingProps {
  customerDetails: Partial<Customer> & {
    poNumber?: string;
    poDate?: Date;
    orderNumber: string;
    status?: string;
    quotationNumber?: string;
    invoiceNumber?: string;
    invoiceDate?: Date;
  };
  isWorkOrder?: boolean;
  isInvoice?: boolean;
}

const OrderHeading: FC<OrderHeadingProps> = ({
  customerDetails,
  isWorkOrder,
  isInvoice,
}) => {
  return (
    <div>
      <Heading></Heading>
      {isWorkOrder && (
        <div className="p-8">
          <h1 className="text-3xl uppercase tracking-tighter">Work Order</h1>
          <div className="">
            <h3>Qtn no. ExOr-{customerDetails.orderNumber} </h3>
          </div>
        </div>
      )}
      {!isWorkOrder && (
        <div className={`w-full p-8  flex justify-between border-b`}>
          <div className={`flex flex-col w-[180px] gap-2 `}>
            <h1 className="text-lg leading-tight">{customerDetails.name}</h1>

            <div className="">
              {/* Change its name */}
              {/* <h1 className="text-lg leading-tight">{customerDetails.name}</h1> */}
              <p className="text-xs">{customerDetails.addressLine1}</p>
              <p className="text-xs">
                {customerDetails.state}, {customerDetails.pincode}
              </p>
              {customerDetails.GST && (
                <p className="text-xs">{customerDetails.GST}</p>
              )}
            </div>
            {customerDetails.status && (
              <div className="">Status: {customerDetails.status}</div>
            )}
          </div>
          <div className="text-right flex flex-col justify-between">
            <h1 className="text-3xl uppercase tracking-tighter">
              {isInvoice ? "Invoice" : "Order"}
            </h1>
            <h1 className="">
              {format(
                customerDetails.invoiceDate
                  ? customerDetails.invoiceDate
                  : new Date(),
                "PP"
              )}
            </h1>
            <div className="">
              <h3>
                {isInvoice ? (
                  <div className="">
                    Invoice no. ExIN {customerDetails.invoiceNumber}
                  </div>
                ) : (
                  <div className="">
                    Order no. ExOr-{customerDetails.orderNumber}
                  </div>
                )}{" "}
              </h3>
              {customerDetails.poNumber && (
                <h3 className="">
                  PO Number: <strong>{customerDetails.poNumber} </strong>
                </h3>
              )}
              {customerDetails.poDate && (
                <h3 className="">
                  PO Date:{" "}
                  <strong>
                    {format(customerDetails.poDate as Date, "PP")}
                  </strong>
                </h3>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHeading;
