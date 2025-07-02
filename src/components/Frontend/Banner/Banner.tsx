import Image from "next/image";
import { FC } from "react";
import WellGlass from "../../../../public/wellglass.png";
import flame from "../../../../public/flame.png";
import sketchfl from "../../../../public/sketchfl.png";
import { Bebas_Neue } from "next/font/google";
import { cn } from "@/lib/utils";

interface BannerProps {}

const bebas = Bebas_Neue({
  weight: ["400"],
  subsets: ["latin"],
});

const Banner: FC<BannerProps> = ({}) => {
  return (
    <div className=" mt-10 md:mt-20 relative">
      <h1 className={cn(" text-4xl md:text-7xl", bebas.className)}>
        WELCOME TO
      </h1>
      <h1 className={cn(" text-5xl md:text-7xl", bebas.className)}>
        EXPLOSION PROOF ELECTRICAL CONTROL
      </h1>
      {/* separator */}
      <div className="h-1 md:h-2 w-10 md:w-20 bg-white rounded-lg mt-8 md:mt-14 "></div>

      {/* scroll */}
      <div className="flex absolute left-2/4 px-4  bg-exec border-color border-t-0 border-b-0 h-10 top-[190px] max-sm:top-[190px] max-md:top-[145px] max-lg:top-[320px] xl:top-[247px] -translate-x-2/4 ">
        <h1 className=" justify-center mt-2 z-20 ">SCROLL DOWN</h1>
      </div>

      {/* component */}
      <div className="flex max-lg:flex-col max-md:items-center  border-color mt-10 md:mt-14 border-r-0 border-l-0">
        <div className="max-lg:my-8 border-color border-right flex-1 max-lg:border-r-0 flex items-center justify-center">
          <Image
            className="object-contain w-[500px] max-lg:w-[300px] "
            src={WellGlass}
            draggable={false}
            alt="image"
            width={500}
            height={500}
            priority
          ></Image>
        </div>
        <div className=" flex-1 border-color max-lg:border-top max-lg:border-b lg:border-right w-full">
          <h1
            className={`${bebas.className} text-5xl text-center mt-6 md:mt-10  lg:mt-12 xl:text-5xl`}
          >
            ABOUT US
            <div className="h-1 w-12  bg-white rounded-lg relative left-2/4 -translate-x-2/4 mt-2 mb-4"></div>
          </h1>
          <p className="text-md lg:text-lg lg:mx-2 text-center md:mt-10 font-thin mx-1 mb-6 md:mb-0">
            Explosion Proof Electrical Control is a leading provider of
            flameproof and explosion-proof solutions for a wide range of
            industries. Our team of experts is dedicated to helping our
            customers maintain a safe and compliant work environment, and we are
            committed to providing top-quality products and services that meet
            the highest industry standards.
          </p>
          <p className="hidden md:flex text-md lg:text-lg lg:mx-2 text-center md:mt-10 font-thin mb-6 mx-1">
            Founded in 1996, we have built a reputation for excellence by
            consistently delivering innovative solutions and exceptional
            customer service. Our advanced manufacturing/ facilities and
            cutting-edge technologies allow us to provide reliable,
            high-performance products that are durable and long-lasting.
          </p>
        </div>
        <div className=" flex-1 flex lg:flex-col items-center justify-center">
          <div className="border-color border-right lg:border-color lg:border-bottom flex items-center justify-center  lg:w-full ">
            <Image
              className=" object-contain lg:w-[300px] w-[200px]"
              src={flame}
              width={300}
              height={300}
              alt="image"
            ></Image>
          </div>
          <div className="h-full flex items-center justify-center w-64">
            <Image
              src={sketchfl}
              alt="image"
              width={256}
              height={171}
              className="max-lg:w-[170px]"
            ></Image>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
