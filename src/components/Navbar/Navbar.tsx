import React, { useState } from "react";
import Image from "next/image";
import logo from "../../../public/Logo.png";
import { Facebook, Instagram, Twitter } from "lucide-react";
import NavbartLinks from "./NavbartLinks";
import MobileNavigationBar from "./MobileNavigationBar";

const Navbar = () => {
  return (
    <>
      <div className=" lg:flex hidden my-10  border-t-0 border-white  items-center border-[0.5px] h-24 print:!hidden">
        <div className="p-2 border-r border-white flex items-center justify-center">
          <Image className="" src={logo} height={80} width={80} alt="" />
        </div>
        <div className="flex-1 flex flex-col h-full">
          <div className="border-b flex  items-center justify-end flex-1">
            <div className="p-2 font-thin text-sm pr-8">
              GIDC, PHASE 4, VAPI
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
    // <div className="max-2xl:mx-10 md:flex items-center md:border-color md:border-t-0 md:mt-8  ">
    //   {/* logo + mobile icons */}
    //   <div className="max-md:flex items-center justify-between p-2 max-md:p-4 max-md:border-color max-md:border-bottom ">
    //     <div onClick={() => setLocation(!location)} className="md:hidden">
    //       {location ? (
    //         <ShieldCloseIcon className="text-2xl md:hidden cursor-pointer"></ShieldCloseIcon>
    //       ) : (
    //         // <LocationOnIcon className="text-2xl md:hidden cursor-pointer" />
    //         <div className=""></div>
    //       )}
    //     </div>
    //     <Link className="curser-pointer" href="/">
    //       <Image className="" src={logo} height={80} width={80} alt="" />
    //     </Link>
    //     <div onClick={() => setMenu(!menu)} className="md:hidden">
    //       {menu ? (
    //         <ShieldCloseIcon className="text-2xl  cursor-pointer"></ShieldCloseIcon>
    //       ) : (
    //         <MenuIcon className="text-2xl  cursor-pointer"></MenuIcon>
    //       )}
    //     </div>
    //   </div>

    //   {/* location + list items */}
    //   <div
    //     className={`md:flex flex-col md:border-color border-left w-full  md:h-24 justify-center ${
    //       menu || location ? "h-28" : "h-0"
    //     }`}
    //   >
    //     {/* loction */}
    //     <div
    //       className={`md:flex item-center h-12 w-full absolute md:static  left-10 max-sm:pl-6 max-sm:pt-4 ${
    //         location ? "top-24" : "-top-48"
    //       }`}
    //     >
    //       <h1 className="md:flex-grow tracking-[1px] md:flex md:items-center md:justify-end font-thin md:text-xs md:border-color md:border-right md:text-end pr-4">
    //         GIDC, PHASE 4, VAPI
    //       </h1>

    //       {/* social */}
    //       {/* <div className="hidden md:flex items-center justify-center h-12 w-32">
    //         <Social></Social>
    //       </div> */}
    //     </div>

    //     {/* menus */}
    //     <div className=" w-full ">
    //       <ul
    //         className={`md:border-color md:border-top h-12 md:flex flex-col items-end md:flex-row md:items-center md:justify-around font-light sm:max-lg:text-xs text-md text-right tracking-[2px] absolute right-10 md:pr-4 w-full max-sm:space-y-4  md:static  ${
    //           menu ? "top-24" : "-top-48"
    //         }`}
    //       >
    //         <li>
    //           <Link className="" href="/">
    //             HOME
    //           </Link>
    //         </li>
    //         <li>
    //           <Link className="" href="/gallery">
    //             GALLERY
    //           </Link>
    //         </li>
    //         <li>
    //           <Link className="" href="/about">
    //             OUR STORY
    //           </Link>
    //         </li>
    //         <li>
    //           <Link className="" href="/contact">
    //             CONTACT
    //           </Link>
    //         </li>
    //       </ul>
    //     </div>
    //   </div>
    // </div>
  );
};

export default Navbar;
