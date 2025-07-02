"use client";
import { FC, useEffect, useMemo, useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { BadgeIndianRupee, Menu } from "lucide-react";
import clsx from "clsx";
import { AspectRatio } from "../ui/aspect-ratio";
import Image from "next/image";
import Logo from "../../../public/logo1.png";
import Link from "next/link";
import { Separator } from "../ui/separator";
import { FaLightbulb, FaShoppingCart } from "react-icons/fa";
import { TbCategoryFilled } from "react-icons/tb";
import { IoPeopleSharp, IoDocumentText } from "react-icons/io5";
import { FaFileInvoiceDollar } from "react-icons/fa6";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { User } from "next-auth";

interface MenuOptionsProps {
  defaultOpen?: boolean;
  session: User & {
    role: string;
  };
  aluminum: boolean;
}

const MenuOptions: FC<MenuOptionsProps> = ({
  defaultOpen,
  session,
  aluminum,
}) => {
  const [openSheet, setOpenSheet] = useState(false);
  // const openState = useMemo(
  //   () =>
  //     defaultOpen ? { open: true } : { open: openSheet, setOpen: setOpenSheet },
  //   []
  // );

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const ADMINROLEMASTER = [
    {
      id: 0,
      icon: <FaLightbulb />,
      label: "Products",
      link: "/dashboard/products",
    },
    {
      id: 1,
      icon: <TbCategoryFilled />,
      label: "Categories",
      link: "/dashboard/categories",
    },
    {
      id: 2,
      icon: <IoPeopleSharp />,
      label: "Customers",
      link: "/dashboard/customers",
    },
    {
      id: 3,
      icon: <FaLightbulb />,
      label: "Store Products",
      link: "/dashboard/store-products",
    },
    {
      id: 4,
      icon: <IoPeopleSharp />,
      label: "Employees",
      link: "/dashboard/employees",
    },
  ];
  const ADMINROLESTOCK = [
    {
      id: 0,
      icon: <IoPeopleSharp />,
      label: "Pending Items Quantity",
      link: "/dashboard/pending-quantity",
    },
    {
      id: 1,
      icon: <IoDocumentText />,
      label: "Inventory",
      link: "/dashboard/inventory",
    },
    {
      id: 2,
      icon: <IoDocumentText />,
      label: "Stock",
      link: "/dashboard/stock",
    },
  ];
  const ADMINROLEITEMS = [
    {
      id: 0,
      icon: <IoDocumentText />,
      label: "Quotations",
      link: "/dashboard/quotations",
    },
    {
      id: 1,
      icon: <FaShoppingCart />,
      label: "Orders",
      link: "/dashboard/orders",
    },
    {
      id: 2,
      icon: <FaFileInvoiceDollar />,
      label: "Invoice",
      link: "/dashboard/invoice",
    },
    {
      id: 3,
      icon: <BadgeIndianRupee size={20} />,
      label: "Peroma Invoice",
      link: "/dashboard/perfoma",
    },
    {
      id: 4,
      icon: <FaFileInvoiceDollar />,
      label: "Delivery Challan",
      link: "/dashboard/delivery-challan",
    },
  ];
  const ARCHIVEITEMS = [
    {
      id: 0,
      icon: <IoDocumentText />,
      label: "Quotations",
      link: "/dashboard/archive/quotations",
    },
    {
      id: 1,
      icon: <FaShoppingCart />,
      label: "Orders",
      link: "/dashboard/archive/orders",
    },
    {
      id: 2,
      icon: <FaFileInvoiceDollar />,
      label: "Transactions",
      link: "/aluminum/transactions",
    },
    {
      id: 3,
      icon: <IoDocumentText />,
      label: "Stock",
      link: "/aluminum/stock",
    },
    {
      id: 4,
      icon: <FaFileInvoiceDollar />,
      label: "Monthly Usage",
      link: "/aluminum/usage",
    },
  ];
  const ALUMINUMITEMS = [
    {
      id: 0,
      icon: <IoDocumentText />,
      label: "Clients",
      link: "/aluminum/clients",
    },
    {
      id: 1,
      icon: <FaLightbulb />,
      label: "Products",
      link: "/aluminum/products",
    },
    {
      id: 2,
      icon: <FaFileInvoiceDollar />,
      label: "Transactions",
      link: "/aluminum/transactions",
    },
    {
      id: 3,
      icon: <IoDocumentText />,
      label: "Stock",
      link: "/aluminum/stock",
    },
    {
      id: 4,
      icon: <FaFileInvoiceDollar />,
      label: "Monthly Usage",
      link: "/aluminum/usage",
    },
  ];
  if (!isMounted) return;
  return (
    <Sheet
      modal={false}
      open={defaultOpen ? true : openSheet}
      onOpenChange={setOpenSheet}
    >
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
            {!aluminum ? (
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem
                  className="border-none text-white  flex flex-col "
                  value="item-1"
                >
                  <AccordionTrigger className="p-2 cursor-pointer rounded-md flex items-center gap-2">
                    Master
                  </AccordionTrigger>
                  {session.role === "ADMIN" ? (
                    <>
                      {ADMINROLEMASTER.map((link) => {
                        return (
                          <AccordionContent>
                            <Link
                              onClick={() => setOpenSheet(!open)}
                              href={link.link}
                              draggable={false}
                              className="p-2 hover:bg-white/10 cursor-pointer rounded-md flex items-center gap-2"
                            >
                              {link.icon}
                              {link.label}
                            </Link>
                          </AccordionContent>
                        );
                      })}
                    </>
                  ) : (
                    <>
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
                    </>
                  )}
                </AccordionItem>
                <Separator className="bg-white/40"></Separator>
                {session.role === "ADMIN" && (
                  <div className="flex flex-col my-4">
                    {ADMINROLEITEMS.map((link) => {
                      return (
                        <Link
                          onClick={() => !defaultOpen && setOpenSheet(!open)}
                          key={link.id}
                          href={link.link}
                          draggable={false}
                          className="p-2 hover:bg-white/10 cursor-pointer rounded-md flex items-center gap-2"
                        >
                          {link.icon}
                          {link.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
                <AccordionItem
                  className="border-none text-white  flex flex-col "
                  value="item-2"
                >
                  <AccordionTrigger className="p-2 cursor-pointer rounded-md flex items-center gap-2">
                    Stock
                  </AccordionTrigger>
                  {ADMINROLESTOCK.map((link) => {
                    return (
                      <AccordionContent key={link.id}>
                        <Link
                          onClick={() => !defaultOpen && setOpenSheet(!open)}
                          href={link.link}
                          draggable={false}
                          className="p-2 hover:bg-white/10 cursor-pointer rounded-md flex items-center gap-2"
                        >
                          {link.icon}
                          {link.label}
                        </Link>
                      </AccordionContent>
                    );
                  })}
                </AccordionItem>
                <AccordionItem
                  className="border-none text-white  flex flex-col "
                  value="item-3"
                >
                  <AccordionTrigger className="p-2 cursor-pointer rounded-md flex items-center gap-2">
                    Archive
                  </AccordionTrigger>
                  {ARCHIVEITEMS.map((link) => {
                    return (
                      <AccordionContent key={link.id}>
                        <Link
                          onClick={() => !defaultOpen && setOpenSheet(!open)}
                          href={link.link}
                          draggable={false}
                          className="p-2 hover:bg-white/10 cursor-pointer rounded-md flex items-center gap-2"
                        >
                          {link.icon}
                          {link.label}
                        </Link>
                      </AccordionContent>
                    );
                  })}
                </AccordionItem>
              </Accordion>
            ) : (
              <div className="">
                {session.role === "ADMIN" && (
                  <div className="flex flex-col my-4">
                    {ALUMINUMITEMS.map((link) => {
                      return (
                        <Link
                          onClick={() => !defaultOpen && setOpenSheet(!open)}
                          key={link.id}
                          href={link.link}
                          draggable={false}
                          className="p-2 hover:bg-white/10 cursor-pointer rounded-md flex items-center gap-2"
                        >
                          {link.icon}
                          {link.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MenuOptions;
