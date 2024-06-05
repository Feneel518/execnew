import { auth } from "@/auth";
import Unauthorized from "@/components/Global/Unauthorized";
import { Progress } from "@/components/ui/progress";
import { ArrowUpRight } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import { FC } from "react";
import { Button } from "@/components/ui/button";
import { HiDotsVertical } from "react-icons/hi";
import ChartComponent from "@/components/Dashboard/ChartComponent";
import FirstBlock from "@/components/Dashboard/Dashboard/FirstBlock";
import SecondBlock from "@/components/Dashboard/Dashboard/SecondBlock";
import ThirdBlock from "@/components/Dashboard/Dashboard/ThirdBlock";

interface pageProps {}

// export const metadata: Metadata = {
//   title: "Explosion Proof Electrical Control",
//   description:
//     "Explosion Proof Electrical Control is a leading provider of flameproof and explosion-proof solutions for a wide range of industries. Our team of experts is dedicated to helping our customers maintain a safe and compliant work environment, and we are committed to providing top-quality products and services that meet the highest industry standards.",
// };

const page: FC<pageProps> = async ({}) => {
  return (
    <div className="  grid grid-cols-2 lg:grid-cols-4 lg:grid-rows-5 gap-4 overflow-hidden text-woodsmoke-200">
      {/* <div className="border">Helo</div>
  <div className="border">Helo</div>
  <div className="border">Helo</div>
  <div className="border">Helo</div> */}

      {/* first block*/}
      <div className=" grid grid-rows-2 row-span-2 gap-4   ">
        <FirstBlock></FirstBlock>
        <SecondBlock></SecondBlock>
      </div>
      {/* first block*/}

      {/* second block*/}

      <ThirdBlock></ThirdBlock> 

      {/* second block*/}

      {/* third block*/}
      <div className="bg-black/10 row-span-2 col-span-2 p-4 lg:p-8 text-woodsmoke-200 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="uppercase">total balance (BTC)</div>
          <div className="flex items-center gap-4">
            <Button variant={"chart"} size={"chart"}>
              7D
            </Button>
            <Button variant={"chart"} size={"chart"}>
              30D
            </Button>
            <Button variant={"chart"} size={"chart"}>
              5M
            </Button>
            <Button variant={"chart"} size={"chart"}>
              12M
            </Button>
          </div>
        </div>
        <div className="flex items-end justify-between">
          <h1 className="text-3xl sm:text-5xl lg:text-7xl ">1.592</h1>
          <div className="">
            <ChartComponent></ChartComponent>
          </div>
        </div>
      </div>
      {/* third block*/}

      {/* <div className="bg-black/10"></div> */}
      {/* fourth block*/}
      <div className="bg-black/10 row-span-3 p-4 lg:p-8 text-woodsmoke-200">
        <div className="flex flex-col items-start justify-between h-full w-full">
          <div className="flex items-center justify-between w-full">
            <div className="uppercase whitespace-nowrap">Inventory</div>
            <div className="border rounded-full p-1 bg-woodsmoke-200 text-elbg-black/10 hover:scale-110 transition-all ease-in-out duration-100 cursor-pointer max-md:-mr-4">
              <ArrowUpRight />
            </div>
          </div>

          <div className="w-full flex flex-col gap-2">
            <div className="flex items-end justify-between ">
              <div className="">
                <h1 className="text-3xl sm:text-5xl lg:text-7xl">6.9</h1>
              </div>
              <div className="text-sm lg:text-lg">/ 15H</div>
            </div>
            <div className=" h-[1px] bg-white/50 w-full"></div>
            <div className="">
              <div className="uppercase mb-2">mj fast hours</div>
              <div className="grid grid-cols-3  items-center justify-center lg:gap-4 gap-1">
                {/* {Images.map((image) => {
              return (
                <div className=" h-24 relative">
                  <Image
                    className="object-contain bg-woodsmoke-200"
                    src={image}
                    alt="avatar"
                    fill
                  ></Image>
                </div>
              );
            })} */}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* fourth block*/}

      {/* fifth block*/}
      <div className="bg-bamboo-500 row-span-3  overflow-hidden flex flex-col justify-between">
        <div className="relative  ">
          <svg
            className="absolute -top-40 lg:-top-80 -right-60 opacity-70"
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            viewBox="0 0 800 800"
          >
            <g stroke-width="2" stroke="#dcd9de" fill="none">
              <path d="M611.3218060511215 253.2700274085836C641.8541105844616 346.80636274616074 543.4013086684951 585.6384420482552 455.82329995927455 630.4866308525769C368.24529125005415 675.3348196568986 221.47966878020418 562.077669006904 190.94736424686414 468.54133366932683C160.41505971352404 375.0049983317497 221.6902294900222 226.3604100365273 309.26823819924266 181.5122212322056C396.8462469084632 136.6640324278839 580.7895015177814 159.73369207100643 611.3218060511215 253.2700274085836C641.8541105844616 346.80636274616074 543.4013086684951 585.6384420482552 455.82329995927455 630.4866308525769 "></path>
              <path d="M596.2273804340493 263.7507397365419C624.5788060721507 350.6059082642921 533.1583471501818 572.3785533305227 451.83591049161987 614.0233000773928C370.513473833058 655.668046824263 234.23111011105453 550.5006926492681 205.87968447295304 463.64552412151784C177.5282588348516 376.7903555937676 234.42663077017124 238.76323789106107 315.74906742873316 197.1184911441909C397.071504087295 155.4737443973208 567.8759547959478 176.8955712087917 596.2273804340493 263.7507397365419C624.5788060721507 350.6059082642921 533.1583471501818 572.3785533305227 451.83591049161987 614.0233000773928 "></path>
              <path d="M581.132970075766 274.2314215469221C607.303516818629 354.40542326484547 522.9154008906576 559.1186340952122 447.84853628275437 597.5599387846307C372.78167167485105 636.0012434740493 246.98256670069395 538.9236857740539 220.81201995783107 458.7496840561307C194.6414732149682 378.57568233820734 247.1630473091094 251.1660352280167 322.2299119170127 212.72473053859812C397.296776524916 174.28342584917954 554.9624233329031 194.05741982899883 581.132970075766 274.2314215469221C607.303516818629 354.40542326484547 522.9154008906576 559.1186340952122 447.84853628275437 597.5599387846307 "></path>
              <path d="M566.0385444586937 284.71216439245853C590.0282123063181 358.20499930055485 512.6724393723443 545.8587758950578 443.8611468150997 581.0966385270248C375.04985425785503 616.3345011589918 259.73400803154436 527.3467399339961 235.74434018392003 453.85390502589973C211.7546723362957 380.36107011780337 259.8994485892585 263.5688936001286 328.71074114650315 228.33103096816154C397.52203370374787 193.09316833619454 542.0488766110694 211.21932948436216 566.0385444586937 284.71216439245853C590.0282123063181 358.20499930055485 512.6724393723443 545.8587758950578 443.8611468150997 581.0966385270248 "></path>
              <path d="M550.9441493591995 295.19287672041685C572.7529383115852 362.00454481868627 502.42950837160924 532.5988871773252 439.87378786502313 564.6333077518407C377.3180673584371 596.6677283263562 272.48547987997284 515.76976357636 250.67669092758712 448.9580954780906C228.86790197520133 382.14642737982126 272.6358803869857 275.9717214546624 335.1916008935718 243.9373008801469C397.74732140015783 211.90288030563136 529.1353604068138 228.38120862214743 550.9441493591995 295.19287672041685C572.7529383115852 362.00454481868627 502.42950837160924 532.5988871773252 439.87378786502313 564.6333077518407 "></path>
              <path d="M535.8497390009163 305.67355853079704C555.4776490580634 365.8040598192395 492.18656211208497 519.3389679420145 435.8864136561575 548.1699464590786C379.58626520023006 577.0009249761424 285.23693646961226 504.192756701146 265.6090264124651 444.0622554127034C245.9811163553179 383.931754124261 285.3722969259239 288.374518791618 341.67244538185133 259.54354027455406C397.97259383777873 230.7125617574901 516.2218289437692 245.54305724235456 535.8497390009163 305.67355853079704C555.4776490580634 365.8040598192395 492.18656211208497 519.3389679420145 435.8864136561575 548.1699464590786 "></path>
              <path d="M520.755298125055 316.1542861175444C538.2023292869635 369.60362059615994 481.9435853349827 506.0790944830711 431.8990089297138 531.7066309426834C381.854432524445 557.3341674022959 297.9883625416736 492.61579560229893 280.541331379765 439.16646112368346C263.09430021785636 385.71712664506794 298.1086829472839 300.77736190494085 348.1532593525527 275.1498254453284C398.1978357578216 249.52228898571605 503.30826696314637 262.7049516389289 520.755298125055 316.1542861175444C538.2023292869635 369.60362059615994 481.9435853349827 506.0790944830711 431.8990089297138 531.7066309426834 "></path>
              <path d="M505.6608877667717 326.63502896308086C520.9270400334417 373.40319663186943 471.7006390754584 492.8192362829167 427.9116347208482 515.2433306850776C384.122630366238 537.6674250872384 310.739819131313 481.03884976224106 295.473666864643 434.2706820934525C280.207514597973 387.5025144246639 310.845099486222 313.18022027705274 354.63410384083227 290.7561258748919C398.4231081954425 268.33203147273105 490.39473550010166 279.8668612942923 505.6608877667717 326.63502896308086C520.9270400334417 373.40319663186943 471.7006390754584 492.8192362829167 427.9116347208482 515.2433306850776 "></path>
              <path d="M490.56649266727754 337.11574129103917C503.65176603870896 377.20274215000086 461.4577080747233 479.5593475651842 423.9242757707717 498.7799999098935C386.39084346682006 518.0006522546028 323.4912909797415 469.46187340460506 310.4060176083101 429.3748725456435C297.3207442368786 389.2878716866818 323.58153128394923 325.58304813158645 361.1149635879009 306.3623957868772C398.64839589185254 287.14174344216786 477.48121929584613 297.02874043207754 490.56649266727754 337.11574129103917C503.65176603870896 377.20274215000086 461.4577080747233 479.5593475651842 423.9242757707717 498.7799999098935 "></path>
              <path d="M475.47206705020517 347.59642310141936C486.3764615263981 381.0022571505541 451.2147465564101 466.29942832987354 419.93688630311703 482.3166386171313C388.659026049824 498.333848904389 336.2427323105919 457.88486652939093 325.338337834399 424.47903248025625C314.43394335820614 391.07319843112157 336.3179325640983 337.9858454685421 367.5957928173914 321.96863518128436C398.8736530706844 305.9514248940266 464.56767257401236 314.1905890522847 475.47206705020517 347.59642310141936C486.3764615263981 381.0022571505541 451.2147465564101 466.29942832987354 419.93688630311703 482.3166386171313 "></path>
              <path d="M460.37764143313296 358.07715068816674C469.1011570140872 384.80181792747453 440.9717850380968 453.0395548709301 415.94949683546236 465.85332310073625C390.92720863282796 478.66709133054246 348.9941736414423 446.307905430544 340.27065806048796 419.58323819123626C331.54714247953365 392.85857095192847 349.0543338442474 350.3886885818649 374.0766220468818 337.57492035205877C399.0989102495163 324.76115212225255 451.65412585217865 331.352483448859 460.37764143313296 358.07715068816674C469.1011570140872 384.80181792747453 440.9717850380968 453.0395548709301 415.94949683546236 465.85332310073625 "></path>
              <path d="M445.2832310748497 368.5578782749141C451.8258677605654 388.60137870439496 430.7288387785726 439.77968141198664 411.9621226265968 449.3900075843413C393.195406474621 459.0003337566959 361.7456302310817 434.73094433169706 355.202993545366 414.6874439022163C348.6603568596502 394.64394347273543 361.7907503831856 362.79153169518776 380.5574665351614 353.1812055228331C399.3241826871372 343.5708793504785 438.740594389134 348.5143778454333 445.2832310748497 368.5578782749141C451.8258677605654 388.60137870439496 430.7288387785726 439.77968141198664 411.9621226265968 449.3900075843413 "></path>
              <path d="M430.1888359753555 379.03857534408337C434.5505937658327 392.40090896373727 420.4859077778375 426.519777435465 407.97476367652024 432.9266615503681C395.46361957520304 439.33354566527123 374.49710207951017 423.153952715272 370.13534428903307 409.7916190956181C365.7735864985559 396.42928547596426 374.52718218091275 375.19434429093246 387.03832628223 368.78746017602936C399.5494703835472 362.38057606112625 425.82707818487836 365.6762417244295 430.1888359753555 379.03857534408337C434.5505937658327 392.40090896373727 420.4859077778375 426.519777435465 407.97476367652024 432.9266615503681 "></path>
              <path d="M415.09441035828326 389.5192876720417C417.2752892535218 396.20045448186863 410.2429462595242 413.2598887177325 403.9873742088656 416.4633307751841C397.73180215820696 419.6667728326356 387.2485434103606 411.576976357636 385.067664515122 404.89580954780905C382.8867856198834 398.2146427379821 387.26358346106184 387.59717214546623 393.51915551172044 384.3937300880147C399.77472756237904 381.1902880305631 412.91353146304465 382.83812086221474 415.09441035828326 389.5192876720417C417.2752892535218 396.20045448186863 410.2429462595242 413.2598887177325 403.9873742088656 416.4633307751841 "></path>
            </g>
          </svg>
        </div>
        <div className="uppercase p-4 lg:p-8 text-woodsmoke-200 text-2xl sm:text-3xl lg:text-5xl tracking-widest">
          <h1>Aesthetic-</h1>
          <h1 className="-mt-2">usability</h1>
          <h1 className="-mt-2">effect</h1>
          <p className=" text-xs lg:text-sm tracking-wider mt-4">
            users often perceive aesthetically pleasing design as design that
            more usable.
          </p>
          <div className="mt-4 flex items-center gap-2">
            <div className="w-2 h-2 border border-woodsmoke-200 rounded-full"></div>
            <div className="w-2 h-2 border border-woodsmoke-200 rounded-full"></div>
            <div className="w-2 h-2 bg-woodsmoke-200 border border-woodsmoke-200 rounded-full"></div>
            <div className="w-2 h-2 border border-woodsmoke-200 rounded-full"></div>
            <div className="w-2 h-2 border border-woodsmoke-200 rounded-full"></div>
          </div>
        </div>
      </div>
      {/* fifth block*/}

      {/* sixth block*/}
      <div className="bg-black/10 row-span-2 text-woodsmoke-200 flex flex-col  justify-between p-4 lg:p-8 ">
        <div className="flex items-center justify-between">
          <div className="uppercase">paid invoices</div>
          <div className="">
            <HiDotsVertical />
          </div>
        </div>
        <div className="flex flex-col  justify-between gap-2">
          <div className="flex items-end justify-between w-full">
            <h1 className="text-3xl sm:text-5xl lg:text-7xl">5.01</h1>
            <div className="max-lg:text-sm">/ $18.00</div>
          </div>
          <Progress value={60} className="w-[60%] " />
        </div>
      </div>
      {/* sixth block*/}

      {/* seventh block*/}
      <div className="bg-black/10 text-woodsmoke-200 row-span-2  flex items-center justify-center w-full h-full">
        <h1 className="absolute">
          <div className="uppercase flex items-center justify-center flex-col">
            <h1 className="text-3xl sm:text-5xl lg:text-7xl">7.89</h1>
            <p className="max-lg:text-sm">work-life balance</p>
          </div>
        </h1>
        {/* <svg className="transform -rotate-90 ">
      <circle
        cx="145"
        cy="145"
        r="80"
        stroke="currentColor"
        stroke-width="8"
        fill="transparent"
        className="text-white/20"
      />

      <circle
        cx="145"
        cy="145"
        r="80"
        stroke="currentColor"
        stroke-width="8"
        fill="transparent"
        strokeDashoffset={circumference - (75 / 100) * circumference}
        strokeDasharray={circumference}
        className="text-elebg-bamboo-500 "
      />
    </svg> */}
      </div>
      {/* seventh block*/}

      {/* eigth block*/}
      <div className="bg-elephant-100 col-span-2 p-4 flex flex-col items-start justify-between uppercase text-black">
        <div className="flex items-center justify-between w-full">
          <div className="uppercase"></div>
          <div className="border rounded-full p-1 bg-black text-elephant-100 hover:scale-110 transition-all ease-in-out duration-100 cursor-pointer">
            <ArrowUpRight />
          </div>
        </div>

        <div className="flex items-end justify-between w-full">
          <h1 className="uppercase text-3xl sm:text-5xl ">
            Custom <br></br>Dashboard
          </h1>
          <div className="text-lg">10/20 templates</div>
        </div>
      </div>
      {/* eigth block*/}
    </div>
  );
};

export default page;
