"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC } from "react";

interface NavbartLinksProps {}

const links = [
  { id: 1, name: "HOME", link: "/" },
  { id: 2, name: "GALLERY", link: "/gallery" },
  { id: 2, name: "CATALOG", link: "/catalog" },
  { id: 3, name: "OUR STORY", link: "/about-us" },
  { id: 4, name: "CONTACT", link: "/contact-us" },
];
const NavbartLinks: FC<NavbartLinksProps> = ({}) => {
  const pathname = usePathname();

  return (
    <div className="flex  items-center justify-around font-light tracking-widest h-full">
      {links.map((link) => {
        return (
          <Link
            href={`${link.link}`}
            className={`${
              pathname === link.link
                ? "font-bold  underline underline-offset-4"
                : ""
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
