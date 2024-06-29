import Image from "next/image";
import { FC } from "react";
import Logo from "../../../public/logo1.png";

interface SmallHeadingProps {
  isPacking?: boolean;
}

const SmallHeading: FC<SmallHeadingProps> = ({ isPacking }) => {
  return (
    <div>
      <div className="bg-exec w-full h-[25.4mm] flex items-center justify-center flex-col text-white ">
        <div className="">
          <Image
            draggable={false}
            src={Logo}
            alt="Explosion Proof Electrical Logo"
            width={200}
            height={75}
          ></Image>
        </div>
      </div>
      <div className="bg-execorange h-2 w-full"></div>
      {isPacking && <h1 className="text-3xl text-center my-8">Packing List</h1>}
    </div>
  );
};

export default SmallHeading;
