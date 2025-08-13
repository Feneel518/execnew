import { NotebookText } from "lucide-react";
import Image from "next/image";
import { FC } from "react";
import { FaPenNib } from "react-icons/fa";
import { IoIosLaptop } from "react-icons/io";
import { SlNotebook } from "react-icons/sl";
import Logo from "../../../../public/logo1.png";

interface DiaryFirstPageProps {}

const DiaryFirstPage: FC<DiaryFirstPageProps> = ({}) => {
  return (
    <div className={`flex items-center justify-center`}>
      <div className="w-[148mm] h-[210mm] print:size-[A4] bg-exec text-white shadow-[rgba(0,_0,_0,_0.4)_0px_30px_90px] flex flex-col relative">
        <aside className="absolute w-32 bg-[#023450] h-full right-0 flex flex-col items-center justify-between py-10">
          <div className="flex flex-col gap-2 items-center  ">
            <div className="h-[1px] bg-white w-10"></div>
            <div className="h-[1px] bg-white w-10"></div>
            <div className="h-[1px] bg-white w-10"></div>
            <div className="h-[1px] bg-white w-10"></div>
          </div>
          <div className="-rotate-90 whitespace-nowrap text-xs">
            COMPANY PRODUCT CATALOG.
          </div>
          <div className="">
            <NotebookText size={50} strokeWidth={1} />
          </div>
        </aside>
        <aside className=" py-8 px-32 flex flex-col gap-4 h-full justify-between ">
          <div className=" font-light">
            <h1>ExEC</h1>
            <p>Flameproof Specialist</p>
            <p>Since 1996</p>
          </div>
          <div className="h-[4px] w-[320px] bg-white"></div>
          <div className="text-5xl">Product Catalog</div>
          <div className="relative w-[250px]  aspect-[1587/619]">
            <Image
              alt="Company Logo"
              src={Logo}
              fill
              className="object-contain"
            ></Image>
          </div>

          <div className="flex items-start gap-4 relative font-light">
            <SlNotebook
              size={40}
              className="absolute -left-20 top-1"
              strokeWidth={1}
            />
            <div className="">
              <h1>ExEC</h1>
              <p>Product Catalog</p>
            </div>
          </div>
          <div className="flex flex-col gap-4 font-light text-sm">
            <h1 className="uppercase w-64 ">Company Data and Contact</h1>
            <div className="flex items-start  gap-8 relative">
              <IoIosLaptop size={50} className="absolute -left-20 top-1" />
              <div className="">
                <h1>Company name:</h1>
                <p className="text-[15px] w-64 leading-5">
                  Explosion Proof Electrical Control
                </p>
              </div>
            </div>
            <div className="flex items-start  gap-8 relative">
              <div className="">
                <h1>Company Address:</h1>
                <p className="text-[15px] w-64 leading-5">
                  Plot no 920, phase 4, g.i.d.c, vapi, gujarat, india
                </p>
              </div>
            </div>
            <div className="flex  items-start  gap-8 relative">
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
                <h1>Feneel patel</h1>
                <h1>+91 9099064667</h1>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default DiaryFirstPage;
