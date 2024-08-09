// "use client";

import { auth } from "@/auth";
import Banner from "@/components/Frontend/Banner/Banner";
import FeaturedProducts from "@/components/Frontend/FeaturedProducts/FeaturedProducts";
import Mission from "@/components/Frontend/Mission/Mission";
import NewsLetter from "@/components/Frontend/NewsLetter/NewsLetter";
import { Button } from "@/components/ui/button";
import { getRandomProducts } from "@/lib/queries";
import { Metadata } from "next";
import { signOut } from "next-auth/react";

export const metadata: Metadata = {
  title: "Explosion Proof Electrical Control",
  description:
    "Explosion Proof Electrical Control is a leading provider of flameproof and explosion-proof solutions for a wide range of industries. Our team of experts is dedicated to helping our customers maintain a safe and compliant work environment, and we are committed to providing top-quality products and services that meet the highest industry standards.",
};

export default async function Home() {
  const products = await getRandomProducts();

  return (
    <main className="max-2xl:mx-4">
      <Banner></Banner>
      <FeaturedProducts products={products?.success}></FeaturedProducts>
      <NewsLetter></NewsLetter>
      <Mission></Mission>
    </main>
  );
}
