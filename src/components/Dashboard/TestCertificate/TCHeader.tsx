import Heading from "@/components/Global/Heading";
import { OrderToView } from "@/lib/types";
import { format } from "date-fns";
import { FC } from "react";

interface TCHeaderProps {
  details: OrderToView;
}

const TCHeader: FC<TCHeaderProps> = ({ details }) => {
  return (
    <div>
      <div>
        <Heading></Heading>

        <div className={`w-full p-8  flex justify-between border-b`}>
          <div className={`flex flex-col w-[180px] gap-2 `}>
            <h1 className="text-lg leading-tight">{details.customer.name}</h1>

            <div className="">
              {/* Change its name */}
              {/* <h1 className="text-lg leading-tight">{details.customer.name}</h1> */}
              <p className="text-xs">{details.customer.addressLine1}</p>
              <p className="text-xs">
                {details.customer.state}, {details.customer.pincode}
              </p>
              {details.customer.GST && (
                <p className="text-xs">{details.customer.GST}</p>
              )}
            </div>
          </div>
          <div className="text-right flex flex-col justify-between">
            <h1 className="text-3xl uppercase tracking-tighter">
              Test Certificate
            </h1>
            <div className="">
              <h3> TC no. ExTC-{details.orderNumber} </h3>
              {details.poNumber && (
                <h3 className="">
                  PO Number: <strong>{details.poNumber} </strong>
                </h3>
              )}
              {details.poDate && (
                <h3 className="">
                  PO Date:{" "}
                  <strong>{format(details.poDate as Date, "PP")}</strong>
                </h3>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TCHeader;
