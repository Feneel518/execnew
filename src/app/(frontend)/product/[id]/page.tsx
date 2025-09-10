import { bebas } from "@/lib/fonts";
import { getProductDetailsBasedOnSlug } from "@/lib/queries";
import { FC } from "react";
import India from "../../../../../public/india.png";
import Image from "next/image";
import { Metadata, ResolvingMetadata } from "next";

interface pageProps {
  params: {
    id: string;
  };
}
export async function generateMetadata(
  { params }: pageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const id = params.id;

  // fetch data
  const productDetails = await getProductDetailsBasedOnSlug(params.id);

  return {
    title: productDetails?.success?.name,
  };
}
const page: FC<pageProps> = async ({ params }) => {
  const productDetails = await getProductDetailsBasedOnSlug(params.id);

  if (productDetails?.error) {
    return <div className="">{productDetails.error}</div>;
  } else {
    return (
      <div>
        <div className="max-2xl:mx-10 mt-8 md:mt-14">
          <h1 className={`${bebas.className} text-5xl md:text-7xl`}>
            FLAMEPROOF
          </h1>
          <h1 className={`${bebas.className} text-5xl md:text-7xl`}>
            PRODUCTS
          </h1>
          {/* separator */}
          <div className="h-1 md:h-2 w-10 md:w-20 bg-white rounded-lg mt-8 md:mt-14 "></div>
        </div>
        <div className="flex max-lg:flex-col max-md:items-center  border-color mt-11 border-r-0 border-l-0">
          <div className="border-color border-bottom lg:border-right flex-1 max-md:border-r-0 flex items-center justify-center ">
            {/* Category Image */}
            {productDetails?.success?.image ? (
              <div className="w-[511.33px] h-[511.33px] flex items-center justify-center relative">
                <Image
                  className="  object-contain my-8"
                  src={productDetails?.success?.image}
                  alt={productDetails.success.name}
                fill
                />
              </div>
            ) : (
              <div className="">Image will be added soon.</div>
            )}
          </div>
          <div className=" flex-1 border-color border-t-0 border-b-0 w-full px-8 font-thin">
            <h1
              className={`${bebas.className} text-3xl text-center mt-6 md:mt-10  lg:mt-12 xl:text-5xl`}
            >
              {/* Category Name */}
              {productDetails?.success?.name}
              <div className="h-1 w-12 bg-white rounded-lg relative left-2/4 -translate-x-2/4 mt-2 mb-4"></div>
            </h1>
            <div className="">
              <strong>"ExEC"</strong>
              {` make ${productDetails?.success?.name} suitable for installation in Hazardous location zone-1 & 2 as per IS: 5572/94.`}
            </div>
            {productDetails?.success?.type && (
              <div className="flex ">
                <p className="w-[120px]">Type</p>
                <p>:{productDetails?.success?.type}</p>
              </div>
            )}
            {productDetails?.success?.protection && (
              <div className="flex ">
                <p className="w-[120px]">Protection</p>
                <p>:{productDetails?.success?.protection}</p>
              </div>
            )}
            {productDetails?.success?.gasGroup && (
              <div className="flex ">
                <p className="w-[120px]">Gas Group</p>
                <p>:{productDetails?.success?.gasGroup}</p>
              </div>
            )}
            {productDetails?.success?.material && (
              <div className="flex ">
                <p className="w-[120px]">Material</p>
                <p>:{productDetails?.success?.material}</p>
              </div>
            )}

            {productDetails?.success?.finish && (
              <div className="flex ">
                <p className="w-[120px]">Finish</p>
                <p>:{productDetails?.success?.finish}</p>
              </div>
            )}

            {productDetails?.success?.rating ? (
              <div className="flex ">
                <p className="w-[120px]">Rating</p>
                <p>:{productDetails?.success?.rating}</p>
              </div>
            ) : (
              productDetails?.success?.rating && (
                <div className="flex ">
                  <p className="w-[120px]">Rating</p>
                  <p>:{productDetails?.success?.rating}</p>
                </div>
              )
            )}
            {productDetails?.success?.variant ? (
              <div className="flex ">
                <p className="w-[120px]">Variant</p>
                <p>:{productDetails?.success?.variant}</p>
              </div>
            ) : (
              productDetails?.success?.variant && (
                <div className="flex ">
                  <p className="w-[120px]">Variant</p>
                  <p>:{productDetails?.success?.variant}</p>
                </div>
              )
            )}

            {productDetails?.success?.size ? (
              <div className="flex ">
                <p className="w-[120px]">Size</p>
                <p>:{productDetails?.success?.size}</p>
              </div>
            ) : (
              productDetails?.success?.size && (
                <div className="flex ">
                  <p className="w-[120px]">Size</p>
                  <p>:{productDetails?.success?.size}</p>
                </div>
              )
            )}
            {productDetails?.success?.rpm ? (
              <div className="flex ">
                <p className="w-[120px]">R.P.M</p>
                <p>:{productDetails?.success?.rpm}</p>
              </div>
            ) : (
              productDetails?.success?.rpm && (
                <div className="flex ">
                  <p className="w-[120px]">R.P.M</p>
                  <p>:{productDetails?.success?.rpm}</p>
                </div>
              )
            )}
            {productDetails?.success?.kW ? (
              <div className="flex ">
                <p className="w-[120px]">K.W.</p>
                <p>:{productDetails?.success?.kW}</p>
              </div>
            ) : (
              productDetails?.success?.kW && (
                <div className="flex ">
                  <p className="w-[120px]">K.W.</p>
                  <p>:{productDetails?.success?.kW}</p>
                </div>
              )
            )}
            {productDetails?.success?.HorsePower ? (
              <div className="flex ">
                <p className="w-[120px]">H.P.</p>
                <p>:{productDetails?.success?.HorsePower}</p>
              </div>
            ) : (
              productDetails?.success?.HorsePower && (
                <div className="flex ">
                  <p className="w-[120px]">H.P.</p>
                  <p>:{productDetails?.success?.HorsePower}</p>
                </div>
              )
            )}

            {productDetails?.success?.ProductComponentsOnProducts.length! > 0 &&
            productDetails?.success?.ProductComponentsOnProducts[0]
              .productComponents.item !== "" ? (
              <div className="flex ">
                <p className="w-[120px] ">Components</p>
                <div className="flex flex-col">
                  {productDetails?.success?.ProductComponentsOnProducts.map(
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
            ) : (
              productDetails?.success?.ProductComponentsOnProducts.length! >
                0 &&
              productDetails?.success?.ProductComponentsOnProducts[0]
                .productComponents.item !== "" && (
                <div className="flex ">
                  <p className="w-[120px] ">Components</p>
                  <div className="flex flex-col">
                    {productDetails?.success?.ProductComponentsOnProducts.map(
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
            {/* {productDetails?.success?.ProductComponentsOnProducts.length > 0 && (
                      <div className="flex ">
                        <p className="w-[120px] ">Components</p>
                        <div className="flex flex-col">
                          {productDetails?.success?.ProductComponentsOnProducts.map(
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

            {productDetails?.success?.cutoutSize ? (
              <div className="flex ">
                <p className="w-[120px]">Cutout Size</p>
                <p>:{productDetails?.success?.cutoutSize}</p>
              </div>
            ) : (
              productDetails?.success?.cutoutSize && (
                <div className="flex ">
                  <p className="w-[120px]">Cutout Size</p>
                  <p>:{productDetails?.success?.cutoutSize}</p>
                </div>
              )
            )}
            {productDetails?.success?.plateSize ? (
              <div className="flex ">
                <p className="w-[120px]">Plate Size</p>
                <p>:{productDetails?.success?.plateSize}</p>
              </div>
            ) : (
              productDetails?.success?.plateSize && (
                <div className="flex ">
                  <p className="w-[120px]">Plate Size</p>
                  <p>:{productDetails?.success?.plateSize}</p>
                </div>
              )
            )}
            {productDetails?.success?.glass ? (
              <div className="flex ">
                <p className="w-[120px]">Glass</p>
                <p>:{productDetails?.success?.glass}</p>
              </div>
            ) : (
              productDetails?.success?.glass && (
                <div className="flex ">
                  <p className="w-[120px]">Glass</p>
                  <p>:{productDetails?.success?.glass}</p>
                </div>
              )
            )}
            {productDetails?.success?.wireGuard ? (
              <div className="flex ">
                <p className="w-[120px]">Wire Guard</p>
                <p>:{productDetails?.success?.wireGuard}</p>
              </div>
            ) : (
              productDetails?.success?.wireGuard && (
                <div className="flex ">
                  <p className="w-[120px]">Wire Guard</p>
                  <p>:{productDetails?.success?.wireGuard}</p>
                </div>
              )
            )}
            {productDetails?.success?.terminals ? (
              <div className="flex ">
                <p className="w-[120px]">Terminals</p>
                <p>:{productDetails?.success?.terminals}</p>
              </div>
            ) : (
              productDetails?.success?.terminals && (
                <div className="flex ">
                  <p className="w-[120px]">Terminals</p>
                  <p>:{productDetails?.success?.terminals}</p>
                </div>
              )
            )}
            {productDetails?.success?.hardware ? (
              <div className="flex ">
                <p className="w-[120px]">Hardware</p>
                <p>:{productDetails?.success?.hardware}</p>
              </div>
            ) : (
              productDetails?.success?.hardware && (
                <div className="flex ">
                  <p className="w-[120px]">Hardware</p>
                  <p>:{productDetails?.success?.hardware}</p>
                </div>
              )
            )}
            {productDetails?.success?.gasket ? (
              <div className="flex ">
                <p className="w-[120px]">Gasket</p>
                <p>:{productDetails?.success?.gasket}</p>
              </div>
            ) : (
              productDetails?.success?.gasket && (
                <div className="flex ">
                  <p className="w-[120px]">Gasket</p>
                  <p>:{productDetails?.success?.gasket}</p>
                </div>
              )
            )}
            {productDetails?.success?.mounting ? (
              <div className="flex ">
                <p className="w-[120px]">Mounting</p>
                <p>:{productDetails?.success?.mounting}</p>
              </div>
            ) : (
              productDetails?.success?.mounting && (
                <div className="flex ">
                  <p className="w-[120px]">Mounting</p>
                  <p>:{productDetails?.success?.mounting}</p>
                </div>
              )
            )}
            {productDetails?.success?.cableEntry ? (
              <div className="flex ">
                <p className="w-[120px]">CableEntry</p>
                <p>:{productDetails?.success?.cableEntry}</p>
              </div>
            ) : (
              productDetails?.success?.cableEntry && (
                <div className="flex ">
                  <p className="w-[120px]">CableEntry</p>
                  <p>:{productDetails?.success?.cableEntry}</p>
                </div>
              )
            )}
            {productDetails?.success?.earting ? (
              <div className="flex ">
                <p className="w-[120px]">Earting</p>
                <p>:{productDetails?.success?.earting}</p>
              </div>
            ) : (
              productDetails?.success?.earting && (
                <div className="flex ">
                  <p className="w-[120px]">Earting</p>
                  <p>:{productDetails?.success?.earting}</p>
                </div>
              )
            )}
            {productDetails?.success?.typeNumber ? (
              <div className="flex ">
                <p className="w-[120px]">Type Number</p>
                <p>:{productDetails?.success?.typeNumber}</p>
              </div>
            ) : (
              productDetails?.success?.typeNumber && (
                <div className="flex ">
                  <p className="w-[120px]">Type Number</p>
                  <p>:{productDetails?.success?.typeNumber}</p>
                </div>
              )
            )}
            {productDetails?.success?.hsnCode ? (
              <div className="flex ">
                <p className="w-[120px]">HSN Code</p>
                <p>:{productDetails?.success?.hsnCode}</p>
              </div>
            ) : (
              productDetails?.success?.hsnCode && (
                <div className="flex ">
                  <p className="w-[120px]">HSN Code</p>
                  <p>:{productDetails?.success?.hsnCode}</p>
                </div>
              )
            )}
            <div className="mb-10 "></div>
          </div>
          <div className=" flex-1 flex  items-center justify-center border-color border-top lg:border-none">
            <Image
              className="flex items-center justify-center "
              src={India}
              alt=""
              width={511.33}
              height={511.33}
            />
          </div>
        </div>
      </div>
    );
  }
};

export default page;
