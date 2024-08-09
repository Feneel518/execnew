import { buttonVariants } from "@/components/ui/button";
import clsx from "clsx";
import { Plus } from "lucide-react";
import Link from "next/link";
import { FC } from "react";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="">List of Challan</div>
        <Link
          href={"/dashboard/delivery-challan/new"}
          className={clsx(buttonVariants({ variant: "default" }), "flex gap-2")}
        >
          <Plus></Plus>
          <span>New</span>
        </Link>
      </div>
    </div>
  );
};

export default page;
