import { Bebas_Neue } from "next/font/google";
import { FC } from "react";
import India from "../../../../public/india.png";
import Flood from "../../../../public/flood.png";
import Image from "next/image";

interface MissionProps {}

const bebas = Bebas_Neue({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-bebas",
});

const Mission: FC<MissionProps> = ({}) => {
  return (
    <div className=" border-color border-bottom relative ">
      <div className="flex  max-lg:flex-col">
        <div className="flex-1 border-color border-none flex items-center justify-center">
          <Image
            className="max-lg:w-[300px] w-[400px] object-contain "
            src={India}
            alt=""
          />
        </div>
        <div className=" flex-1 text-center border-color max-lg:border-b max-lg:border-top lg:border-left flex flex-col items-center justify-center ">
          <div className="">
            <h1 className={`${bebas.className} text-5xl mt-6 m md:text-6xl `}>
              OUR MISSION
            </h1>
            <div className="h-1 w-12 bg-white rounded-lg relative left-2/4 -translate-x-2/4 mt-2 mb-4"></div>
          </div>
          <p className=" text-md lg:text-lg lg:mx-2 text-center  mx-1  md:mx-4   md:mt-10 xl:text-xl font-thin mb-6 md:mb-20 ">
            "At Flameproof Manufacturing Company, our mission is to provide
            top-quality flameproof and explosion-proof solutions that keep our
            customers' employees, assets, and facilities safe. We are committed
            to excellence in everything we do, from research and development to
            manufacturing and customer service. We strive to be the industry
            leader in safety and compliance, and we work tirelessly to exceed
            the expectations of our customers."
          </p>
        </div>
        <div className="flex-1 pb-6 md:pb-20 flex items-center justify-center border-color border-left max-lg:border-none pt-6 md:pt-20 lg:mt-0">
          <Image
            className="w-[250px] lg:w-[450px] object-contain -rotate-90 "
            src={Flood}
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default Mission;
