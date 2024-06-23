"use client";
import { FC, useEffect, useMemo, useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { Menu } from "lucide-react";
import clsx from "clsx";
import { AspectRatio } from "../ui/aspect-ratio";
import Image from "next/image";
import Logo from "../../../public/logo1.png";
import Link from "next/link";
import { Separator } from "../ui/separator";
import { FaLightbulb, FaShoppingCart } from "react-icons/fa";
import { TbCategoryFilled } from "react-icons/tb";
import { IoPeopleSharp, IoDocumentText } from "react-icons/io5";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface MenuOptionsProps {
  defaultOpen?: boolean;
}

const MenuOptions: FC<MenuOptionsProps> = ({ defaultOpen }) => {
  const openState = useMemo(() => (defaultOpen ? { open: true } : {}), []);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) return;
  return (
    <Sheet modal={false} {...openState}>
      <SheetTrigger
        asChild
        className="absolute left-4 top-4 z-[100] lg:!hidden flex print:hidden"
      >
        <Button variant={"outline"} size={"icon"}>
          <Menu className="text-black"></Menu>
        </Button>
      </SheetTrigger>
      <SheetContent
        showX={!defaultOpen}
        side={"left"}
        className={clsx(
          "bg-exec/80 backdrop-blur-xl fixed top-0 border-r-[1px] p-6",
          {
            "hidden lg:inline-block z-0 w-[300px]": defaultOpen,
            "inline-block lg:hidden z-[100] w-full": !defaultOpen,
          }
        )}
      >
        <div className="">
          <Link href={"/dashboard"}>
            <AspectRatio ratio={16 / 5}>
              <Image
                draggable={false}
                src={Logo}
                alt="Exec Logo"
                fill
                className="rounded-md object-contain select-none"
              ></Image>
            </AspectRatio>
          </Link>
          <Separator className="h-[1px] bg-slate-600 mt-2"></Separator>
          <div
            draggable={false}
            className="text-white my-10 flex flex-col justify-center gap-2"
          >
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem
                className="border-none text-white  flex flex-col "
                value="item-1"
              >
                <AccordionTrigger className="p-2 cursor-pointer rounded-md flex items-center gap-2">
                  Master
                </AccordionTrigger>
                <AccordionContent>
                  <Link
                    href={"/dashboard/products"}
                    draggable={false}
                    className="p-2 hover:bg-white/10 cursor-pointer rounded-md flex items-center gap-2"
                  >
                    <FaLightbulb />
                    Products
                  </Link>
                </AccordionContent>
                <AccordionContent>
                  <Link
                    href={"/dashboard/categories"}
                    draggable={false}
                    className="p-2 hover:bg-white/10 cursor-pointer rounded-md flex items-center gap-2"
                  >
                    <TbCategoryFilled />
                    Categories
                  </Link>
                </AccordionContent>
                <AccordionContent>
                  <Link
                    href={"/dashboard/customers"}
                    draggable={false}
                    className="p-2 hover:bg-white/10 cursor-pointer rounded-md flex items-center gap-2"
                  >
                    <IoPeopleSharp />
                    Customers
                  </Link>
                </AccordionContent>
                <AccordionContent>
                  <Link
                    href={"/dashboard/store-products"}
                    draggable={false}
                    className="p-2 hover:bg-white/10 cursor-pointer rounded-md flex items-center gap-2"
                  >
                    <FaLightbulb />
                    Store Products
                  </Link>
                </AccordionContent>
                <AccordionContent>
                  <Link
                    href={"/dashboard/employees"}
                    draggable={false}
                    className="p-2 hover:bg-white/10 cursor-pointer rounded-md flex items-center gap-2"
                  >
                    <IoPeopleSharp />
                    Employees
                  </Link>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem
                className="border-none text-white  flex flex-col "
                value="item-2"
              >
                <AccordionTrigger className="p-2 cursor-pointer rounded-md flex items-center gap-2">
                  Documents
                </AccordionTrigger>
                <AccordionContent>
                  <Link
                    href={"/dashboard/quotations"}
                    draggable={false}
                    className="p-2 hover:bg-white/10 cursor-pointer rounded-md flex items-center gap-2"
                  >
                    <IoDocumentText />
                    Quotations
                  </Link>
                </AccordionContent>
                <AccordionContent>
                  <Link
                    href={"/dashboard/orders"}
                    draggable={false}
                    className="p-2 hover:bg-white/10 cursor-pointer rounded-md flex items-center gap-2"
                  >
                    <FaShoppingCart />
                    Orders
                  </Link>
                </AccordionContent>
                <AccordionContent>
                  <Link
                    href={"/dashboard/pending-quantity"}
                    draggable={false}
                    className="p-2 hover:bg-white/10 cursor-pointer rounded-md flex items-center gap-2"
                  >
                    <IoPeopleSharp />
                    Pending Items Quantity
                  </Link>
                </AccordionContent>
                <AccordionContent>
                  <Link
                    href={"/dashboard/inventory"}
                    draggable={false}
                    className="p-2 hover:bg-white/10 cursor-pointer rounded-md flex items-center gap-2"
                  >
                    <IoDocumentText />
                    Inventory
                  </Link>
                </AccordionContent>
                <AccordionContent>
                  <Link
                    href={"/dashboard/stock"}
                    draggable={false}
                    className="p-2 hover:bg-white/10 cursor-pointer rounded-md flex items-center gap-2"
                  >
                    <IoDocumentText />
                    Stock
                  </Link>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MenuOptions;
