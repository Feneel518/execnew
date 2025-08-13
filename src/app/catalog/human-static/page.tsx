import { NotebookText } from "lucide-react";
import Image from "next/image";
import { FC } from "react";
import { FaPenNib } from "react-icons/fa";
import Logo from "../../../../public/logo1.png";
import Human from "../../../../public/HumanStatic.png";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <div className={`flex items-center justify-center`}>
      <div className="w-[210mm] h-[297mm] print:size-[A4] bg-exec text-white shadow-[rgba(0,_0,_0,_0.4)_0px_30px_90px] flex flex-col relative">
        <aside className=" py-4 px-16 flex flex-col gap-4 h-full  ">
          <div className="text-xl font-light">
            <Image src={Logo} alt="logo" width={200} height={200}></Image>
            <p>Human Body Static Discharge </p>
          </div>
          <div className="h-[4px] w-[500px] bg-white"></div>
          <div className="flex flex-col gap-4 text-[14px]">
            <div className=" flex flex-col items-center">
              <div className="">
                <p>
                  To safely dissipate the static charge accumulated in the human
                  body and prevent potential hazards, the human body static
                  discharge unit offers a comprehensive solution. It gauges the
                  resistance of the human body and establishes a conductive
                  pathway for the discharge of static electricity to the ground.
                  This ensures that the body's resistance remains below 1000
                  kilo-ohms, minimizing the risk of spark formation from static
                  discharge before entering hazardous environments.
                </p>
                <p>
                  The human body static discharge unit evaluates the body's
                  resistance and indicates either a "PASS" or "OPEN" status
                  based on the measured resistance value. Additionally, it
                  facilitates the discharge of static charge from the human body
                  to the earth.
                </p>
                <p>
                  Furthermore, the device features a relay output contact, which
                  can be utilized for notification purposes or integrated with
                  access control systems such as doors or gates to permit entry
                  only after static charge dissipation has been ensured.
                </p>
              </div>
              <div className="relative size-80 ">
                <Image
                  src={Human}
                  alt="Human Static"
                  fill
                  className="object-contain"
                ></Image>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-xl">Technical Specifications</h2>
              <div className="h-[1px] w-[500px] bg-white"></div>
              <div className="grid grid-cols-3 ">
                <h3 className="">Power Supply</h3>
                <p className="col-span-2 whitespace-nowrap">
                  : 230V AC +10% (110V AC Available on Request)
                </p>
                <h3 className="">Max Test Voltage</h3>
                <p className="col-span-2 whitespace-nowrap">: 1.5 V DC Max.</p>
                <h3 className="">Interlock Relay/Output</h3>
                <p className="col-span-2 whitespace-nowrap ">
                  : 1 C/O Potential Free Contact Relay
                </p>
                <h3 className="">Mounting</h3>
                <p className="col-span-2 whitespace-nowrap">
                  : Wall Mounting SS plate
                </p>
                <h3 className="">Handles</h3>
                <p className="col-span-2 whitespace-nowrap">
                  : Test & Ref. Ground Handle
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-xl">
                General Flame Proof Enclosure Specifications
              </h2>
              <div className="h-[1px] w-[500px] bg-white"></div>

              <div className="grid grid-cols-3 ">
                <h3 className="">FLP Unit size</h3>
                <p className="col-span-2 whitespace-nowrap">
                  : 200 x 200 x 160 mm
                </p>
                <h3 className="">Type of Ex-Protection</h3>
                <p className="col-span-2 whitespace-nowrap">: 1.5 V DC Max.</p>
                <h3 className="">Interlock Relay/Output</h3>
                <p className="col-span-2 whitespace-nowrap ">
                  : AS PER IS/IEC-60079-1:20014
                </p>

                <h3 className="">Zone Classification</h3>
                <p className="col-span-2 whitespace-nowrap">
                  : Zone 1 & Zone 2
                </p>
                <h3 className="">Gas Group</h3>
                <p className="col-span-2 whitespace-nowrap">
                  : Gas Group I, IIA, IIB and IIC
                </p>
                <h3 className="">Ingress Protection (IP)</h3>
                <p className="col-span-2 whitespace-nowrap">
                  : IP-66 IS / IEC60529-2001
                </p>
                <h3 className="">Material of Construction</h3>
                <p className="col-span-2 whitespace-nowrap">
                  : Die Cast Aluminum Alloy LM6
                </p>
                <h3 className="">Paint</h3>
                <p className="col-span-2 whitespace-nowrap">
                  : Epoxy Polyester Powder Coating
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default page;
