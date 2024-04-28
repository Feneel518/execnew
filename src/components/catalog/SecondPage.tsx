import { FC } from "react";
import Tubelight from "../../../public/Tubeloight.png";
import PageHeader from "./PageHeader";
import Image from "next/image";
import CatalogFooter from "./CatalogFooter";

interface SecondPageProps {}

const SecondPage: FC<SecondPageProps> = ({}) => {
  return (
    <div className="w-[210mm] h-[297mm] print:size-[A4] bg-exec text-white shadow-[rgba(0,_0,_0,_0.4)_0px_30px_90px] flex flex-col relative py-20 pl-16">
      <PageHeader></PageHeader>
      <div className="w-full bg-[#023450] h-full p-10 pr-20">
        <div className="flex items-end justify-end">
          <div className="bg-white h-32 w-[500px] flex items-center justify-between px-8 ">
            <h1 className="text-exec text-3xl w-2/3 font-semibold">
              Explosion Proof Electrical Control
            </h1>
            <div className="">
              <svg
                className="h-16 -rotate-45"
                version="1.1"
                id="Capa_1"
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                viewBox="0 0 317.037 317.037"
                fill="#023450"
              >
                <g>
                  <polygon points="313.831,39.438 280.718,6.325 115.724,147.817 172.339,204.432 	" />
                  <polygon points="164.665,211.28 108.882,155.492 58.293,228.75 91.406,261.863 	" />
                  <path
                    d="M51.418,300.638l30.655-39.798l-23.143-22.724L22.988,265.23c0,0-1.556,33.428-22.898,51.807
		C0.095,317.037,25.261,297.75,51.418,300.638z M40.387,288.955c-3.911,0-7.082-3.171-7.082-7.082s3.171-7.082,7.082-7.082
		s7.082,3.171,7.082,7.082S44.298,288.955,40.387,288.955z"
                  />
                  <path d="M286.402,0.005l30.546,30.546C317.035-1.132,286.402,0.005,286.402,0.005z" />
                </g>
              </svg>
            </div>
          </div>
        </div>
        <div className="mt-10 flex items-center justify-between">
          <div className="flex flex-col gap-8">
            <h1 className="text-5xl w-60">Welcome to ExEC product catalog.</h1>
            <p>Your Safety, Our Priority</p>
            <p className="w-40 text-sm font-light ">
              Welcome to our Flameproof Product Catalog! Below, you'll find a
              wide range of high-quality flameproof products designed to provide
              exceptional safety and performance in hazardous environments. Our
              products are meticulously tested and certified to meet stringent
              industry standards. Explore the catalog to discover the perfect
              flameproof solutions for your needs.
            </p>
          </div>
          <div className="w-36">
            <Image
              alt="Tubelight"
              src={Tubelight}
              width={400}
              height={200}
            ></Image>
          </div>
        </div>
      </div>
      <CatalogFooter></CatalogFooter>
    </div>
  );
};

export default SecondPage;
