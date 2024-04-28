import { Minus, NotebookText } from "lucide-react";

import { FC } from "react";
import Logo from "../../../public/logo1.png";
import Image from "next/image";
import { SlNotebook } from "react-icons/sl";
import { IoIosLaptop } from "react-icons/io";
import { FaPenNib } from "react-icons/fa6";
interface FirstPageProps {}

const FirstPage: FC<FirstPageProps> = ({}) => {
  return (
    <div className={`flex items-center justify-center`}>
      <div className="w-[210mm] h-[297mm] print:size-[A4] bg-exec text-white shadow-[rgba(0,_0,_0,_0.4)_0px_30px_90px] flex flex-col relative">
        <aside className="absolute w-32 bg-[#023450] h-full right-0 flex flex-col items-center justify-between py-10">
          <div className="flex flex-col gap-2 items-center  ">
            <div className="h-[2px] bg-white w-10"></div>
            <div className="h-[2px] bg-white w-10"></div>
            <div className="h-[2px] bg-white w-10"></div>
            <div className="h-[2px] bg-white w-10"></div>
          </div>
          <div className="-rotate-90 whitespace-nowrap">
            COMPANY PRODUCT CATALOG.
          </div>
          <div className="">
            <NotebookText size={50} />
          </div>
        </aside>
        <aside className=" py-10 px-32 flex flex-col gap-10 h-full justify-between ">
          <div className="text-xl font-light">
            <h1>ExEC</h1>
            <p>Flameproof Specialist</p>
            <p>Since 1996</p>
          </div>
          <div className="h-[4px] w-[500px] bg-white"></div>
          <div className="text-7xl">Product Catalog</div>
          <div className="">
            <Image
              alt="Company Logo"
              src={Logo}
              width={300}
              height={300}
            ></Image>
          </div>

          <div className="flex items-start text-xl gap-8 relative font-light">
            <SlNotebook size={40} className="absolute -left-20 top-1" />
            <div className="">
              <h1>ExEC</h1>
              <p>Product Catalog</p>
            </div>
          </div>
          <div className="flex flex-col gap-8 font-light">
            <h1 className="uppercase w-64 text-xl">Company Data and Contact</h1>
            <div className="flex items-start text-xl gap-8 relative">
              <IoIosLaptop size={50} className="absolute -left-20 top-1" />
              <div className="">
                <h1>Company name:</h1>
                <p className="text-[15px] w-64 leading-5">
                  Explosion Proof Electrical Control
                </p>
              </div>
            </div>
            <div className="flex items-start text-xl gap-8 relative">
              <div className="">
                <h1>Company Address:</h1>
                <p className="text-[15px] w-64 leading-5">
                  Plot no 920, phase 4, g.i.d.c, vapi, gujarat, india
                </p>
              </div>
            </div>
            <div className="flex  items-start text-xl gap-8 relative">
              <FaPenNib
                size={40}
                className="absolute -left-20 top-1 -rotate-45"
              />
              <div className="">
                <h1>Contacts:</h1>
                <p className="text-[15px] w-64 leading-5">
                  info@explosionproofelectrical.com
                </p>
                <p className="text-[15px] w-64 leading-5">
                  exec@rediffmail.com
                </p>
              </div>
            </div>
            <div className="flex flex-col w-64">
              <div className="grid grid-cols-2">
                <h1>Ajit patel</h1>
                <h1>+91 9824418868</h1>
              </div>
              <div className="grid grid-cols-2">
                <h1>feneel patel</h1>
                <h1>+91 9099064667</h1>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default FirstPage;
