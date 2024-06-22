"use client";
import { FC } from "react";
import PageHeader from "./PageHeader";
import Image from "next/image";
import Panel from "../../../public/panel.png";

interface LastPageProps {
  images: {
    image: string;
  }[];
}

const LastPage: FC<LastPageProps> = ({ images }) => {
  return (
    <div className="w-[210mm] h-[297mm] print:size-[A4] bg-exec overflow-x-hidden text-white shadow-[rgba(0,_0,_0,_0.4)_0px_30px_90px] flex flex-col relative py-20 pl-16">
      <PageHeader></PageHeader>
      <div className="flex items-center justify-center">
        <Image src={Panel} alt="panel" width={500} height={740}></Image>
      </div>
      <div className="grid grid-cols-5 ">
        {images.map((imagea) => {
          return (
            <Image
              src={imagea.image}
              className="object-cover"
              alt="panel"
              width={100}
              height={150}
            ></Image>
          );
        })}
      </div>
    </div>
  );
};

export default LastPage;
