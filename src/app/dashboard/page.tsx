import { auth } from "@/auth";
import Unauthorized from "@/components/Global/Unauthorized";
import { Metadata } from "next";
import { FC } from "react";

interface pageProps {}

export const metadata: Metadata = {
  title: "Explosion Proof Electrical Control",
  description:
    "Explosion Proof Electrical Control is a leading provider of flameproof and explosion-proof solutions for a wide range of industries. Our team of experts is dedicated to helping our customers maintain a safe and compliant work environment, and we are committed to providing top-quality products and services that meet the highest industry standards.",
};
const page: FC<pageProps> = async ({}) => {
  return <div>page</div>;
};

export default page;
