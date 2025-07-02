import { FC } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { ProductInQuotation, ProductInQuotationTypes } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

interface AQuotationTableProps {
  products: ProductInQuotationTypes[];
  itemsIndex: number;
}

const AQuotationTable: FC<AQuotationTableProps> = ({
  products,
  itemsIndex,
}) => {
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">#</TableHead>
            <TableHead className="w-[500px]">Items</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead className="text-right">Unit Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((invoice, index) => {
            return (
              <>
                <TableRow key={invoice.id} className="">
                  <TableCell className="font-medium">
                    {invoice.index ? invoice.index : itemsIndex + 1 + index}
                  </TableCell>
                  <TableCell>
                    <div className="">
                      <strong>"ExEC"</strong>
                      {` make ${invoice.product.name} suitable for installation in Hazardous location zone-1 & 2 as per IS: 5572/94.`}
                    </div>
                    {invoice.product.type && (
                      <div className="flex ">
                        <p className="w-[120px]">Type</p>
                        <p>:{invoice.product.type}</p>
                      </div>
                    )}
                    {invoice.product.protection && (
                      <div className="flex ">
                        <p className="w-[120px]">Protection</p>
                        <p>:{invoice.product.protection}</p>
                      </div>
                    )}
                    {invoice.product.gasGroup && (
                      <div className="flex ">
                        <p className="w-[120px]">Gas Group</p>
                        <p>:{invoice.product.gasGroup}</p>
                      </div>
                    )}
                    {invoice.product.material && (
                      <div className="flex ">
                        <p className="w-[120px]">Material</p>
                        <p>:{invoice.product.material}</p>
                      </div>
                    )}

                    {invoice.product.finish && (
                      <div className="flex ">
                        <p className="w-[120px]">Finish</p>
                        <p>:{invoice.product.finish}</p>
                      </div>
                    )}

                    {invoice.rating ? (
                      <div className="flex ">
                        <p className="w-[120px]">Rating</p>
                        <p>:{invoice.rating}</p>
                      </div>
                    ) : (
                      invoice.product.rating && (
                        <div className="flex ">
                          <p className="w-[120px]">Rating</p>
                          <p>:{invoice.product.rating}</p>
                        </div>
                      )
                    )}
                    {invoice.variant ? (
                      <div className="flex ">
                        <p className="w-[120px]">Variant</p>
                        <p>:{invoice.variant}</p>
                      </div>
                    ) : (
                      invoice.product.variant && (
                        <div className="flex ">
                          <p className="w-[120px]">Variant</p>
                          <p>:{invoice.product.variant}</p>
                        </div>
                      )
                    )}

                    {invoice.size ? (
                      <div className="flex ">
                        <p className="w-[120px]">Size</p>
                        <p>:{invoice.size}</p>
                      </div>
                    ) : (
                      invoice.product.size && (
                        <div className="flex ">
                          <p className="w-[120px]">Size</p>
                          <p>:{invoice.product.size}</p>
                        </div>
                      )
                    )}
                    {invoice.rpm ? (
                      <div className="flex ">
                        <p className="w-[120px]">R.P.M</p>
                        <p>:{invoice.rpm}</p>
                      </div>
                    ) : (
                      invoice.product.rpm && (
                        <div className="flex ">
                          <p className="w-[120px]">R.P.M</p>
                          <p>:{invoice.product.rpm}</p>
                        </div>
                      )
                    )}
                    {invoice.kW ? (
                      <div className="flex ">
                        <p className="w-[120px]">K.W.</p>
                        <p>:{invoice.kW}</p>
                      </div>
                    ) : (
                      invoice.product.kW && (
                        <div className="flex ">
                          <p className="w-[120px]">K.W.</p>
                          <p>:{invoice.product.kW}</p>
                        </div>
                      )
                    )}
                    {invoice.HorsePower ? (
                      <div className="flex ">
                        <p className="w-[120px]">H.P.</p>
                        <p>:{invoice.HorsePower}</p>
                      </div>
                    ) : (
                      invoice.product.HorsePower && (
                        <div className="flex ">
                          <p className="w-[120px]">H.P.</p>
                          <p>:{invoice.product.HorsePower}</p>
                        </div>
                      )
                    )}

                    {invoice.ComponentsOfProductInQuotation &&
                    invoice.ComponentsOfProductInQuotation?.length > 0 &&
                    invoice.ComponentsOfProductInQuotation[0]
                      .componentsOfQuotation.item !== "" ? (
                      <div className="flex ">
                        <p className="w-[120px] ">Components</p>
                        <div className="flex flex-col">
                          {invoice.ComponentsOfProductInQuotation.map((com) => {
                            return (
                              <p className="w-[300px]">
                                :{com.componentsOfQuotation.item}
                              </p>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      invoice.product.ProductComponentsOnProducts.length > 0 &&
                      invoice.product.ProductComponentsOnProducts[0]
                        .productComponents.item !== "" && (
                        <div className="flex ">
                          <p className="w-[120px] ">Components</p>
                          <div className="flex flex-col">
                            {invoice.product.ProductComponentsOnProducts.map(
                              (com) => {
                                return (
                                  <p className="w-[300px]">
                                    :{com.productComponents.item}
                                  </p>
                                );
                              }
                            )}
                          </div>
                        </div>
                      )
                    )}
                    {/* {invoice.product.ProductComponentsOnProducts.length > 0 && (
                      <div className="flex ">
                        <p className="w-[120px] ">Components</p>
                        <div className="flex flex-col">
                          {invoice.product.ProductComponentsOnProducts.map(
                            (com) => {
                              return (
                                <p className="w-[300px]">
                                  :{com.productComponents.item}
                                </p>
                              );
                            }
                          )}
                        </div>
                      </div>
                    )} */}

                    {invoice.cutoutSize ? (
                      <div className="flex ">
                        <p className="w-[120px]">Cutout Size</p>
                        <p>:{invoice.cutoutSize}</p>
                      </div>
                    ) : (
                      invoice.product.cutoutSize && (
                        <div className="flex ">
                          <p className="w-[120px]">Cutout Size</p>
                          <p>:{invoice.product.cutoutSize}</p>
                        </div>
                      )
                    )}
                    {invoice.plateSize ? (
                      <div className="flex ">
                        <p className="w-[120px]">Plate Size</p>
                        <p>:{invoice.plateSize}</p>
                      </div>
                    ) : (
                      invoice.product.plateSize && (
                        <div className="flex ">
                          <p className="w-[120px]">Plate Size</p>
                          <p>:{invoice.product.plateSize}</p>
                        </div>
                      )
                    )}
                    {invoice.glass ? (
                      <div className="flex ">
                        <p className="w-[120px]">Glass</p>
                        <p>:{invoice.glass}</p>
                      </div>
                    ) : (
                      invoice.product.glass && (
                        <div className="flex ">
                          <p className="w-[120px]">Glass</p>
                          <p>:{invoice.product.glass}</p>
                        </div>
                      )
                    )}
                    {invoice.wireGuard ? (
                      <div className="flex ">
                        <p className="w-[120px]">Wire Guard</p>
                        <p>:{invoice.wireGuard}</p>
                      </div>
                    ) : (
                      invoice.product.wireGuard && (
                        <div className="flex ">
                          <p className="w-[120px]">Wire Guard</p>
                          <p>:{invoice.product.wireGuard}</p>
                        </div>
                      )
                    )}
                    {invoice.terminals ? (
                      <div className="flex ">
                        <p className="w-[120px]">Terminals</p>
                        <p>:{invoice.terminals}</p>
                      </div>
                    ) : (
                      invoice.product.terminals && (
                        <div className="flex ">
                          <p className="w-[120px]">Terminals</p>
                          <p>:{invoice.product.terminals}</p>
                        </div>
                      )
                    )}
                    {invoice.hardware ? (
                      <div className="flex ">
                        <p className="w-[120px]">Hardware</p>
                        <p>:{invoice.hardware}</p>
                      </div>
                    ) : (
                      invoice.product.hardware && (
                        <div className="flex ">
                          <p className="w-[120px]">Hardware</p>
                          <p>:{invoice.product.hardware}</p>
                        </div>
                      )
                    )}
                    {invoice.gasket ? (
                      <div className="flex ">
                        <p className="w-[120px]">Gasket</p>
                        <p>:{invoice.gasket}</p>
                      </div>
                    ) : (
                      invoice.product.gasket && (
                        <div className="flex ">
                          <p className="w-[120px]">Gasket</p>
                          <p>:{invoice.product.gasket}</p>
                        </div>
                      )
                    )}
                    {invoice.mounting ? (
                      <div className="flex ">
                        <p className="w-[120px]">Mounting</p>
                        <p>:{invoice.mounting}</p>
                      </div>
                    ) : (
                      invoice.product.mounting && (
                        <div className="flex ">
                          <p className="w-[120px]">Mounting</p>
                          <p>:{invoice.product.mounting}</p>
                        </div>
                      )
                    )}
                    {invoice.cableEntry ? (
                      <div className="flex ">
                        <p className="w-[120px]">CableEntry</p>
                        <p>:{invoice.cableEntry}</p>
                      </div>
                    ) : (
                      invoice.product.cableEntry && (
                        <div className="flex ">
                          <p className="w-[120px]">CableEntry</p>
                          <p>:{invoice.product.cableEntry}</p>
                        </div>
                      )
                    )}
                    {invoice.earting ? (
                      <div className="flex ">
                        <p className="w-[120px]">Earting</p>
                        <p>:{invoice.earting}</p>
                      </div>
                    ) : (
                      invoice.product.earting && (
                        <div className="flex ">
                          <p className="w-[120px]">Earting</p>
                          <p>:{invoice.product.earting}</p>
                        </div>
                      )
                    )}
                    {invoice.typeNumber ? (
                      <div className="flex ">
                        <p className="w-[120px]">Type Number</p>
                        <p>:{invoice.typeNumber}</p>
                      </div>
                    ) : (
                      invoice.product.typeNumber && (
                        <div className="flex ">
                          <p className="w-[120px]">Type Number</p>
                          <p>:{invoice.product.typeNumber}</p>
                        </div>
                      )
                    )}
                    {invoice.hsnCode ? (
                      <div className="flex ">
                        <p className="w-[120px]">HSN Code</p>
                        <p>:{invoice.hsnCode}</p>
                      </div>
                    ) : (
                      invoice.product.hsnCode && (
                        <div className="flex ">
                          <p className="w-[120px]">HSN Code</p>
                          <p>:{invoice.product.hsnCode}</p>
                        </div>
                      )
                    )}
                    {invoice.product.image && (
                      <div className="w-full h-[150px] flex justify-start">
                        <Image
                          draggable={false}
                          src={invoice.product.image}
                          alt={invoice.product.name}
                          width={100}
                          height={150}
                          className="object-contain w-full object-top h-[150px]"
                        ></Image>
                      </div>
                    )}
                    {invoice.poReferrence && (
                      <div className="flex ">
                        <p className="w-[120px]">PO Referrence</p>
                        <p>:{invoice.poReferrence}</p>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {invoice.quantity}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatPrice(invoice.price)}
                  </TableCell>
                </TableRow>
                <Separator></Separator>
              </>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default AQuotationTable;
