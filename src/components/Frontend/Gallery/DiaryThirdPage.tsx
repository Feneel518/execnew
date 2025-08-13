import PageHeader from "@/components/catalog/PageHeader";
import Image from "next/image";
import { FC } from "react";
import industry from "../../../../public/pexels-pixabay-236722.jpg";
import CatalogFooter from "@/components/catalog/CatalogFooter";

interface DiaryThirdPageProps {}

const DiaryThirdPage: FC<DiaryThirdPageProps> = ({}) => {
  return (
    <div className="w-[148mm] h-[210mm] print:size-[A4] bg-exec overflow-x-hidden text-white shadow-[rgba(0,_0,_0,_0.4)_0px_30px_90px] flex flex-col relative py-20 pl-16">
      <PageHeader></PageHeader>
      <div className="w-full bg-[#023450] h-full p-10 pr-20 ">
        <div className="-ml-40 -mt-6 relative">
          <Image
            alt="Industry"
            src={industry}
            width={769.705}
            height={472.083}
          ></Image>
          <div className="absolute  bg-exec/50 inset-0  top-0 z-20 pb-20 text-5xl left-0">
            <h1 className="ml-28 mt-12 flex items-end h-full font-semibold w-80">
              Company Overview
            </h1>
          </div>
        </div>
        <div className="flex flex-col gap-2 mt-6 text-xs">
          <div className="w-full h-[2px] bg-white font-light"></div>
          <h1 className="text-xl font-semibold ">About Us</h1>
          <p className="text-justify">
            Explosion Proof Electrical Control is a leading provider of
            flameproof and explosion-proof solutions for a wide range of
            industries. Our team of experts is dedicated to helping our
            customers maintain a safe and compliant work environment, and we are
            committed to providing top-quality products and services that meet
            the highest industry standards.
          </p>
          <p className="text-justify">
            Founded in 1996, we have built a reputation for excellence by
            consistently delivering innovative solutions and exceptional
            customer service. Our advanced manufacturing/ facilities and
            cutting-edge technologies allow us to provide reliable,
            high-performance products that are durable and long-lasting.
          </p>
        </div>
      </div>
      <CatalogFooter></CatalogFooter>
    </div>
  );
};

export default DiaryThirdPage;
