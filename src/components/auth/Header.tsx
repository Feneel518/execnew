import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import Image from "next/image";
import { FC } from "react";

const font = Poppins({ subsets: ["latin"], weight: ["600"] });

interface HeaderProps {
  label: string;
  firmName?: string;
  firmLogo?: string;
}

const Header: FC<HeaderProps> = ({ label, firmLogo, firmName }) => {
  return (
    <div className={cn("w-full flex flex-col gap-y-4 items-center")}>
      {firmLogo ? (
        <Image
          src={firmLogo}
          alt="Logo"
          width={200}
          height={200}
          className="w-64"
        ></Image>
      ) : firmName ? (
        <h1 className={cn("text-3xl font-semibold", font.className)}>
          {firmName}
        </h1>
      ) : (
        <h1 className={cn("text-3xl font-semibold", font.className)}>Auth</h1>
      )}
      <p className="text-muted-foreground text-sm">{label}</p>
    </div>
  );
};

export default Header;
