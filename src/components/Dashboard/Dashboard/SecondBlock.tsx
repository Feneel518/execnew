import { db } from "@/lib/db";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { FC } from "react";
import { HiDotsVertical } from "react-icons/hi";

interface SecondBlockProps {}

const SecondBlock: FC<SecondBlockProps> = async ({}) => {
  const products = await db.product.count();
  return (
    <div>
      <div className="bg-black/10 p-4 lg:p-8 text-woodsmoke-200 h-full flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="uppercase">Total Products</div>
          <Link
            href={"/dashboard/products"}
            className=" hover:bg-execorange rounded-full p-1 transition-all duration-100 ease-in-out"
          >
            <ArrowUpRight />
          </Link>
        </div>
        <div className="flex items-end justify-between">
          <div className="">
            <h1 className="text-5xl lg:text-7xl">{products}</h1>
          </div>
          <div className="text-sm lg:text-lg">Nos.</div>
        </div>
      </div>
    </div>
  );
};

export default SecondBlock;
