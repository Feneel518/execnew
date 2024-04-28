import Link from "next/link";
import { FC } from "react";
import Logo1 from "../../../public/logo1.png";
import Image from "next/image";
import { Facebook, Instagram, Twitter } from "lucide-react";

interface FooterProps {}

const Footer: FC<FooterProps> = ({}) => {
  return (
    <div className=" flex mb-20 border-color border-bottom print:!hidden">
      <Link
        href="/"
        className="flex-1 flex p-2 items-center border-color border-right justify-center"
      >
        <Image className="w-64 object-cover" src={Logo1} alt="" />
      </Link>
      <div className="flex-1 flex item-center justify-center">
        <div className="text-xs  text-md lg:text-2xl flex items-center justify-end pr-6 font-thin text-center flex-1 border-color border-right ">
          FOLLOW US
        </div>
        <div className=" flex-1 flex items-center justify-center gap-8 max-lg:gap-2 max-lg:ml-4">
          <Instagram size={40} className="font-thin stroke-1 max-lg:w-6" />
          <Facebook
            size={40}
            className="font-thin stroke-1 max-lg:w-6"
          ></Facebook>
          <Twitter
            size={40}
            className="font-thin stroke-1 max-lg:w-6"
          ></Twitter>
        </div>
      </div>
    </div>
  );
};

export default Footer;
