import React, { useState } from "react";
import Image from "next/image";
import logo from "../../../public/Logo.png";
import { Facebook, Instagram, Twitter } from "lucide-react";
import NavbartLinks from "./NavbartLinks";
import MobileNavigationBar from "./MobileNavigationBar";
import { auth } from "@/auth";
import Link from "next/link";

const Navbar = async () => {
  const session = await auth();
  return (
    <>
      <div className=" lg:flex hidden my-10  border-t-0 border-white  items-center border-[0.5px] h-24 print:!hidden">
        <div className="p-2 border-r border-white flex items-center justify-center">
          <Image className="" src={logo} height={80} width={80} alt="" />
        </div>
        <div className="flex-1 flex flex-col h-full">
          <div className="border-b flex  items-center justify-end flex-1">
            <div className="p-2 font-thin text-sm pr-8 flex items-center gap-8">
              GIDC, PHASE 4, VAPI{"     "}
              {session?.user.email === "info@explosionproofelectrical.com" ||
              session?.user.email === "feneelp@gmail.com" ? (
                <Link href={"/dashboard"}>Dashboard</Link>
              ) : (
                ""
              )}
            </div>
            <div className="border-l h-full p-2 flex gap-4 items-center px-8">
              <Instagram className="font-thin stroke-1 " />
              <Facebook className="font-thin stroke-1 "></Facebook>
              <Twitter className="font-thin stroke-1 "></Twitter>
            </div>
          </div>
          <div className="flex-1 ">
            <NavbartLinks></NavbartLinks>
          </div>
        </div>
      </div>
      <MobileNavigationBar></MobileNavigationBar>
    </>
  );
};

export default Navbar;
