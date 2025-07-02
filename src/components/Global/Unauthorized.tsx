import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { FC } from "react";
import { buttonVariants } from "../ui/button";

interface UnauthorizedProps {}

const Unauthorized: FC<UnauthorizedProps> = ({}) => {
  return (
    <div className="p-4 text-center h-screen w-screen flex justify-center items-center flex-col text-white">
      <h1 className="text-3xl md:text-6xl">Unauthorized access!</h1>
      <p>This page is for admins only.</p>
      <Link
        href={"/"}
        className={`flex items-center text-white mt-4 bg-exec P-2 ${buttonVariants(
          {
            variant: "link",
          }
        )}`}
      >
        <ChevronLeft size={20}></ChevronLeft>Back to home
      </Link>
    </div>
  );
};

export default Unauthorized;
