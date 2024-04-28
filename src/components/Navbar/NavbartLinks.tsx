"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC } from "react";

interface NavbartLinksProps {}

const links = [
  { id: 1, name: "HOME", link: "/" },
  { id: 2, name: "GALLERY", link: "/gallery" },
  { id: 3, name: "OUR STORY", link: "/about-us" },
  { id: 4, name: "CONTACT", link: "/contact" },
];
const NavbartLinks: FC<NavbartLinksProps> = ({}) => {
  const pathname = usePathname();

  return (
    <div className="flex  items-center justify-around font-thin h-full">
      {links.map((link) => {
        const isActive = false;
        return (
          <Link
            href={`${link.link}`}
            className={`${
              isActive ? "font-bold  underline underline-offset-4" : ""
            }`}
            key={link.id}
          >
            {link.name}
          </Link>
        );
      })}
    </div>
  );
};

export default NavbartLinks;
