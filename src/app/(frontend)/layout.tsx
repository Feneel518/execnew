import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Explosion Proof Electrical Control",
  description:
    "Explosion Proof Electrical Control, is a flameproof manufacturer in Vapi, gujarat India. Flameproof Junction boxes, JBS, Panels, Lightings, Instrumentations, Switch Gears, Clean Room Fittings, Led Fittings, wellGlass, bulkheads, Reactor vessel Lamps, rv Lamps, Push buttons, switch sockets, plug Tops, flood lights, exhaust fans, pedestal fans, wall fans, joint panels, limit switches, bootom openable bulkhead, top openablke bulkhead, sqaure bulkhead, hand lamps, proximity switches, rpm controller, temperature controller, DOL starter located in Vapi, near silvass as well as daman and also is near valsad.",
};

import { FC } from "react";

interface layoutProps {
  children: React.ReactNode;
}

const layout: FC<layoutProps> = ({ children }) => {
  return (
    <div className=" max-w-screen-2xl mx-auto  text-white max-lg:mx-4 flex flex-col min-h-screen">
      <div className="flex-1">
        <Navbar></Navbar>
        <div className="">{children}</div>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default layout;
