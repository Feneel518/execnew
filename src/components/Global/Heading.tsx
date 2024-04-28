import Image from "next/image";
import { FC } from "react";
import Logo from "../../../public/logo1.png";

interface HeadingProps {}

const Heading: FC<HeadingProps> = ({}) => {
  return (
    <div>
      <div className="bg-exec w-full h-[50.4mm] flex items-center justify-center flex-col text-white ">
        <div className="">
          <Image
            draggable={false}
            src={Logo}
            alt="Explosion Proof Electrical Logo"
            width={300}
            height={100}
          ></Image>
        </div>

        <div className="text-center text-xs">
          Plot no. 920, GIDC, phase 4 , vapi, Gujarat, India
        </div>
      </div>
      <div className="bg-execorange h-2 w-full"></div>
    </div>
  );
};

export default Heading;
