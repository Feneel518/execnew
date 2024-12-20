"use client";

import { FC, useState } from "react";
import { Button } from "../ui/button";
import { Menu, Navigation } from "lucide-react";
import Image from "next/image";
import logo from "../../../public/Logo.png";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";

interface MobileNavigationBarProps {}

const links = [
  { id: 1, name: "HOME", link: "/" },
  { id: 2, name: "GALLERY", link: "/gallery" },
  { id: 3, name: "OUR STORY", link: "/about-us" },
  { id: 4, name: "CONTACT", link: "/contact-us" },
];

const MobileNavigationBar: FC<MobileNavigationBarProps> = ({}) => {
  const [menu, setMenu] = useState(false);
  const [open, setOpen] = useState(false);
  return (
    <div className="lg:hidden border-b my-2 py-4 flex items-center justify-between print:!hidden">
      <div className=" flex-1 flex justify-start">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost">
              <Navigation onClick={() => setMenu(!menu)}></Navigation>
            </Button>
          </SheetTrigger>
          <SheetContent
            side={"left"}
            className="bg-exec text-white h-full flex flex-col justify-between items-center"
          >
            <SheetHeader>
              <SheetTitle className="text-white">Address </SheetTitle>
              <SheetDescription>How to reach us.</SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4 flex-1">
              <div className="flex flex-col items-center justify-start font-thin h-full gap-2">
                <div className="p-2 font-thin text-sm ">
                  GIDC, PHASE 4, VAPI
                </div>
              </div>
            </div>
            <SheetFooter className="flex items-center justify-center">
              <Image className="" src={logo} height={80} width={80} alt="" />
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
      <div className=" flex-1 flex justify-center -ml-2">
        <Image className="" src={logo} height={80} width={80} alt="" />
      </div>
      <div className=" flex-1 flex justify-end">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost">
              <Menu onClick={() => setMenu(!menu)}></Menu>
            </Button>
          </SheetTrigger>
          <SheetContent className="bg-exec text-white h-full flex flex-col justify-between">
            <SheetHeader>
              <SheetTitle className="text-white">Navigation Menu</SheetTitle>
              <SheetDescription>Navigate between pages.</SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4 flex-1">
              <div className="flex flex-col items-center justify-start font-thin h-full gap-2">
                {links.map((link, index) => {
                  const isActive = false;
                  return (
                    <SheetClose asChild key={index}>
                      <Link
                        href={`${link.link}`}
                        className={`${
                          isActive
                            ? "font-bold  underline underline-offset-4"
                            : ""
                        }`}
                        key={link.id}
                      >
                        {link.name}
                      </Link>
                    </SheetClose>
                  );
                })}
              </div>
            </div>
            <SheetFooter className="flex items-center justify-center">
              <Image className="" src={logo} height={80} width={80} alt="" />
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default MobileNavigationBar;
