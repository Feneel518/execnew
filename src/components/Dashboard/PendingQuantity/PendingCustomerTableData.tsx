import { PendingCustomerTable } from "@/lib/types";

import { FC } from "react";
import PendingOrderPage from "./PendingOrderPage";
import { getOrderDetailsForInvoice } from "@/lib/queries";
import { calculateRemainingQuantities } from "@/lib/utils";

interface PendingCustomerTableDataProps {
  order: PendingCustomerTable[];
}

const PendingCustomerTableData: FC<PendingCustomerTableDataProps> = async ({
  order,
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-10 w-full ">
      {order.map(async (ord) => {
        const orderDetails = await getOrderDetailsForInvoice(ord.id);

        if (!orderDetails?.success || orderDetails.error) return;
        const acc = calculateRemainingQuantities(
          orderDetails.success,
          orderDetails.success.Invoice
        );
        return (
          <div className="w-full" key={ord.id}>
            <PendingOrderPage
              order={ord}
              remainingQuantity={acc}
            ></PendingOrderPage>
          </div>
        );
      })}
    </div>
    // <>
    //   {order.map(async (ord) => {
    //     const orderDetails = await getOrderDetailsForInvoice(ord.id);

    //     if (!orderDetails?.success || orderDetails.error) return;
    //     const acc = calculateRemainingQuantities(
    //       orderDetails.success,
    //       orderDetails.success.Invoice
    //     );
    //     return (
    //       // <PendingOrderPage
    //       //   order={ord}
    //       //   remainingQuantity={acc}
    //       // ></PendingOrderPage>
    //       <div className=""></div>
    //     );
    //   })}
    // </>
    // <>
    //   <div className="print:hidden">
    //     {order.map((order) => {
    //       return (
    //         <div
    //           className="border-b transition-colors hover:bg-muted/50  "
    //           key={order.id}
    //         >
    //           <PendingOrderPage></PendingOrderPage>
    //           {/* <Order
    //             isWorkOrder={true}
    //             orderData={order}
    //             remainingQuantity={acc}
    //           ></Order> */}
    //           <div className="px-4 text-left align-middle font-medium flex items-center     ">
    //             <div className="p-4 align-middle text-sm font-normal w-32">
    //               {order.orderNumber}
    //             </div>
    //             <div className="p-4 align-middle text-sm font-normal flex-1 flex flex-col divide-y-2">
    //               {order.ProductInOrder.map((prod) => {
    //                 const pendingQuantity = prod.ProductInInvoiceOfOrder.reduce(
    //                   (acc, items) => {
    //                     return acc + items.supplidQuantity;
    //                   },
    //                   0
    //                 );

    //                 return (
    //                   <div className="grid grid-cols-3 gap-2">
    //                     <p>{prod.product.name}</p>
    //                     <p>{prod.description}</p>
    //                     <p>{prod.quantity - pendingQuantity}</p>
    //                   </div>
    //                 );
    //               })}
    //             </div>
    //             <div className="p-4 align-middle text-sm font-normal w-60">
    //               {order.poNumber}
    //             </div>
    //             <div className="p-4 align-middle text-sm font-normal w-40 lg:flex hidden">
    //               {format(order.poDate as Date, "PP")}
    //             </div>
    //             <div className="p-4 align-middle text-sm font-normal w-40 lg:flex hidden">
    //               {order.status}
    //             </div>

    //             <div className="p-4 align-middle text-sm font-normal lg:w-40">
    //               <DropdownMenu>
    //                 <DropdownMenuTrigger asChild>
    //                   <Button variant="ghost" className="h-8 w-8 p-0">
    //                     <span className="sr-only">Open menu</span>
    //                     <MoreHorizontal className="h-4 w-4" />
    //                   </Button>
    //                 </DropdownMenuTrigger>
    //                 <DropdownMenuContent align="end">
    //                   <DropdownMenuLabel>Actions</DropdownMenuLabel>
    //                   <DropdownMenuItem
    //                     onClick={async () => {
    //                       const response = await updateOrder(order.id);
    //                       router.refresh();

    //                       if (response?.success) {
    //                         return toast({
    //                           title: `Your order (${order.orderNumber}), has been updated`,
    //                         });
    //                       } else if (response?.error) {
    //                         return toast({
    //                           title: response.error,
    //                         });
    //                       }
    //                     }}
    //                   >
    //                     Mark as Complete
    //                   </DropdownMenuItem>
    //                   <DropdownMenuSeparator />
    //                   <DropdownMenuItem
    //                     onClick={() => window.open(`/order/view/${order.id}`)}
    //                   >
    //                     {" "}
    //                     View Order
    //                   </DropdownMenuItem>
    //                   <DropdownMenuItem
    //                     onClick={() =>
    //                       router.push(`/dashboard/orders/${order.id}`)
    //                     }
    //                   >
    //                     {" "}
    //                     Edit Order
    //                   </DropdownMenuItem>
    //                   <DropdownMenuItem
    //                     onClick={() => router.push(`/workorders/${order.id}`)}
    //                   >
    //                     {" "}
    //                     Generate Work Order
    //                   </DropdownMenuItem>
    //                   {/* <DropdownMenuItem
    //           onClick={async () => {
    //             await deleteQuotation(order.id);
    //             router.refresh();
    //           }}
    //         >
    //           Delete Order
    //         </DropdownMenuItem> */}
    //                 </DropdownMenuContent>
    //               </DropdownMenu>
    //             </div>
    //           </div>
    //         </div>
    //       );
    //     })}
    //   </div>
    // </>
  );
};

export default PendingCustomerTableData;
