import { db } from "@/lib/db";
import { FC } from "react";

interface ThirdPageProps {}

const ThirdPage: FC<ThirdPageProps> = async ({}) => {
  const categories = await db.category.findMany({
    where: {
      product: {
        some: {
          image: {
            not: "",
          },
        },
      },
    },
    select: {
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  });
  return (
    <div className="w-[210mm] h-[297mm] print:size-[A4] bg-exec text-white shadow-[rgba(0,_0,_0,_0.4)_0px_30px_90px] flex flex-col relative py-20 pr-16">
      <div className="w-full bg-[#023450] h-full p-10 pl-20">
        <div className="">
          <h1 className="text-5xl font-semibold">Table of Content</h1>
        </div>
        <div className="mt-10 flex flex-col gap-[12px]">
          <div className="h-[2px] w-full bg-white"></div>
          <div className="flex items-center justify-between px-8">
            <h1 className="">Welcome</h1>
            <p>02</p>
          </div>
          <div className="h-[2px] w-full bg-white"></div>
          <div className="flex items-center justify-between px-8">
            <h1 className="">Company Overview</h1>
            <p>04</p>
          </div>
          <div className="h-[2px] w-full bg-white"></div>
          <div className="flex items-center justify-between px-8">
            <h1 className="">Our Process</h1>
            <p>05</p>
          </div>
          <div className="h-[2px] w-full bg-white"></div>
          <div className="flex items-center justify-between px-8">
            <h1 className="">Clean Room Lightings</h1>
            <p>06</p>
          </div>
          <div className="h-[2px] w-full bg-white"></div>
          <div className="flex items-center justify-between px-8">
            <h1 className="">Clean Room Switch Gears</h1>
            <p>07</p>
          </div>
          <div className="h-[2px] w-full bg-white"></div>
          <div className="flex items-center justify-between px-8">
            <h1 className="">Fire Alarm</h1>
            <p>09</p>
          </div>
          <div className="h-[2px] w-full bg-white"></div>
          <div className="flex items-center justify-between px-8">
            <h1 className="">Junction Box</h1>
            <p>11</p>
          </div>
          <div className="h-[2px] w-full bg-white"></div>
          <div className="flex items-center justify-between px-8">
            <h1 className="">Lighting Fittings</h1>
            <p>13</p>
          </div>
          <div className="h-[2px] w-full bg-white"></div>
          <div className="flex items-center justify-between px-8">
            <h1 className="">Panel Boxes</h1>
            <p>15</p>
          </div>
          <div className="h-[2px] w-full bg-white"></div>
          <div className="flex items-center justify-between px-8">
            <h1 className="">Switch Gears</h1>
            <p>17</p>
          </div>
          <div className="h-[2px] w-full bg-white"></div>
          {/* {categories.map((category) => {
            return (
              <div className="flex flex-col gap-[12px]">
                <h1 className="pl-8">{category.name}</h1>
                <div className="h-[2px] w-full bg-white"></div>
              </div>
            );
          })} */}
        </div>
      </div>
    </div>
  );
};

export default ThirdPage;
