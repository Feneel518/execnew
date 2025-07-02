"use client";

import { Bebas_Neue, Inter } from "next/font/google";
import { FC } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../ui/carousel";
import Arrow from "../../../../public/arrow.png";
import Image from "next/image";
import Gujarat from "../../../../public/gujarat.png";
import { Card, CardContent } from "../../ui/card";
import { getRandomProducts } from "@/lib/queries";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";
import { FeasturedProducts } from "@/lib/types";
import { bebas, inter } from "@/lib/fonts";

interface FeaturedProductsProps {
  products: FeasturedProducts[] | undefined;
}

const FeaturedProducts: FC<FeaturedProductsProps> = ({ products }) => {
  // const products = await getRandomProducts();

  return (
    <div className="mt-2 md:mt-24 relative">
      <h1
        className={`${bebas.className} text-7xl max-md:text-5xl text-center my-10 `}
      >
        GETTING IT RIGHT SINCE 1996
      </h1>
      {/* sectio */}
      <div className=" flex  md:mt-24 border-color border-l-0 border-r-0 mb-10 max-lg:flex-col">
        <div className=" flex-1 ">
          <h1
            className={`${bebas.className} text-center mt-6 md:mt-10 text-4xl`}
          >
            FEATURED PRODUCTS
          </h1>
          <div className="h-1 w-12 bg-white rounded-lg relative left-2/4 -translate-x-2/4 mt-2 mb-4"></div>
          <div className="flex items-center justify-center max-lg:border-color max-lg:border-bottom ">
            {/* <Carousel
         className="max-md:px-10 mb-4 "
         autoPlay
         infiniteLoop
         showIndicators={false}
         showStatus={false}
         showThumbs={false}
         interval={5000}
       >
         {featured.map((feature) => {
           return (
             <div key={feature._id} className="">
               <img
                 className=" h-72 lg:h-[450px] object-contain mb-4 "
                 src={urlFor(feature.image).url()}
                 alt=""
               />
               <h1 className=" font-light text-sm tracking-wider mt-2">
                 {feature.name}
               </h1>
               <p className=" text-[10px] tracking-wide font-thin">
                 {feature.description}
               </p>
               <Link href={`/product/${feature.slug.current}`}>
                 <button className="mt-4 font-light tracking-wide underline underline-offset-4 mb-8 decoration-amber-600">
                   INQUIRE NOW
                 </button>
               </Link>
             </div>
           );
         })}
       </Carousel> */}
            <Carousel
              plugins={[
                Autoplay({
                  delay: 5000,
                }),
              ]}
              className="w-[85%] flex items-center justify-center  max-lg:mb-10"
            >
              <CarouselContent>
                {products?.map((product, index) => (
                  <CarouselItem key={index}>
                    <div
                      key={product.id}
                      className={`${inter.className} flex flex-col items-center justify-between h-full `}
                    >
                      <img
                        className=" h-72 lg:h-[450px] object-contain mb-4 "
                        src={product.image}
                        alt=""
                      />
                      <h1 className=" font-light text-sm tracking-wider mt-2">
                        {product.name}
                      </h1>

                      <Link href={`/product/${product.id}`}>
                        <button className="mt-4 font-light tracking-wide underline underline-offset-4 mb-8 decoration-amber-600">
                          INQUIRE NOW
                        </button>
                      </Link>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </div>
        <div className=" flex-1 border-color border-left text-sm flex flex-col ">
          <div className=" flex-1 flex border-color border-bottom">
            <div
              className={` ${bebas.className} flex-1 flex flex-col border-color border-none `}
            >
              <div
                className={` flex flex-col flex-1 items-center justify-center border-color border-bottom`}
              >
                <h1 className="text-2xl tracking-[4px] relative top-4 max-lg:top-3 lg:text-4xl">
                  IT'S A
                </h1>
                <Image className="max-lg:w-[200px]" src={Arrow} alt="" />
                <h1 className="text-2xl tracking-[4px] relative bottom-2 lg:text-4xl">
                  THING
                </h1>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center max-sm:mt-4">
                <h1 className="text-6xl">CIMFR</h1>
                <h4 className=" tracking-[4px] relative -top-3">CERTIFIED</h4>
              </div>
            </div>
            <div className=" flex-1 flex items-center justify-center border-color border-left">
              <Image className="max-lg:w-[300px]" src={Gujarat} alt="" />
            </div>
          </div>
          <div className="flex-1 p-4 flex flex-col space-y-4 lg:space-y-4 mt-4">
            <h1 className={` ${bebas.className} text-3xl`}>WHY CHOOSE US?</h1>
            <p className="text-xs  font-thin lg:text-lg">
              <span className="font-bold">Expertise:</span> Our team has years
              of experience in the flameproof and explosion-proof industry, and
              we have the knowledge and expertise to provide the best solutions
              for your needs.
            </p>
            <p className="text-xs font-thin lg:text-lg">
              <span className="font-bold">Quality:</span> We use advanced
              manufacturing techniques and the highest-quality materials to
              produce reliable, long-lasting products.
            </p>
            <p className="text-xs font-thin lg:text-lg">
              <span className="font-bold">Safety:</span> Safety is our top
              priority, and we go above and beyond to ensure that our products
              meet the highest industry standards and regulations.
            </p>
            <p className="text-xs font-thin lg:text-lg">
              <span className="font-bold">Fast delivery</span> is another reason
              why you should choose us. We understand that timely delivery is
              important to our customers, and we do everything we can to get
              your orders to you as quickly as possible.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProducts;
