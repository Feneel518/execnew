import { bebas } from "@/lib/fonts";
import { Metadata } from "next";
import { FC } from "react";

interface pageProps {}

export const metadata: Metadata = {
  title: "About Us",
};

const page: FC<pageProps> = ({}) => {
  return (
    <div>
      <div className="max-2xl:mx-10 max-md:mx-2 mt-8 md:mt-14 relative">
        <h1 className={`${bebas.className} text-5xl md:text-7xl`}>About Us</h1>

        {/* separator */}
        <div className="h-1 md:h-2 w-10 md:w-20 bg-white rounded-lg mt-8 md:mt-14 "></div>

        {/* scroll */}

        {/* component */}
        <div className="flex max-lg:flex-col max-md:items-center  border-color mt-11 border-r-0 border-l-0">
          <div className="border-color border-right flex-1 max-lg:border-r-0 text-justify p-4 ">
            <h1
              className={`${bebas.className} text-5xl text-center mt-6 md:mt-10  lg:mt-12 xl:text-5xl max-md:hidden`}
            >
              ABOUT US
              <div className="h-1 w-12  bg-white rounded-lg relative left-2/4 -translate-x-2/4 mt-2 mb-4"></div>
            </h1>
            <p className="text-md lg:text-lg lg:mx-2 text-justify md:mt-10 font-thin mx-1 mb-6 md:mb-0 ">
              Explosion Proof Electrical Control is a leading provider of
              flameproof and explosion-proof solutions for a wide range of
              industries. Our team of experts is dedicated to helping our
              customers maintain a safe and compliant work environment, and we
              are committed to providing top-quality products and services that
              meet the highest industry standards.
            </p>
            <p className="text-md lg:text-lg lg:mx-2 text-justify md:mt-10 font-thin mx-1 mb-6 md:mb-0">
              Founded in 1996, we have built a reputation for excellence by
              consistently delivering innovative solutions and exceptional
              customer service. Our advanced manufacturing/ facilities and
              cutting-edge technologies allow us to provide reliable,
              high-performance products that are durable and long-lasting.
            </p>
          </div>
          <div className=" flex-1 border-color lg:border-right  w-full p-4">
            <div className=" w-full h-full">
              <h1
                className={`${bebas.className} text-5xl text-center mt-6 md:mt-10  lg:mt-12 xl:text-5xl uppercase`}
              >
                Our Expertise
                <div className="h-1 w-12 bg-white rounded-lg relative left-2/4 -translate-x-2/4 mt-2 mb-4"></div>
              </h1>
              <p className="text-md lg:text-lg lg:mx-2 text-justify md:mt-10 font-thin mx-1 mb-6 md:mb-0">
                With years of experience in flameproof technology, our team of
                engineers and technicians are experts in designing and
                manufacturing electrical enclosures, junction boxes, and fire
                detection systems that withstand the rigors of hazardous
                environments. We leverage cutting-edge materials and advanced
                manufacturing techniques to ensure the utmost safety and
                performance of our products.
              </p>
              <h1
                className={`${bebas.className} text-5xl text-center mt-6 md:mt-10  lg:mt-12 xl:text-5xl`}
              >
                Quality Assurance
                <div className="h-1 w-12 bg-white rounded-lg relative left-2/4 -translate-x-2/4 mt-2 mb-4"></div>
              </h1>
              <p className="text-md lg:text-lg lg:mx-2 text-justify md:mt-10 font-thin mx-1 mb-6 md:mb-0">
                Quality is at the heart of everything we do. Each product
                undergoes rigorous testing and certification to meet
                international safety standards. Our commitment to quality
                assurance ensures that our customers receive products that are
                reliable and durable.
              </p>
            </div>
          </div>
          <div className=" flex-1 flex flex-col items-center p-4">
            <div className=" w-full h-full">
              <h1
                className={`${bebas.className} text-5xl text-center mt-6 md:mt-10  lg:mt-12 xl:text-5xl`}
              >
                OUR MISSION
                <div className="h-1 w-12 bg-white rounded-lg relative left-2/4 -translate-x-2/4 mt-2 mb-4"></div>
              </h1>
              <p className="text-md lg:text-lg lg:mx-2 text-justify md:mt-10 font-thin mx-1 mb-6 md:mb-0">
                "At Flameproof Manufacturing Company, our mission is to provide
                top-quality flameproof and explosion-proof solutions that keep
                our customers' employees, assets, and facilities safe. We are
                committed to excellence in everything we do, from research and
                development to manufacturing and customer service. We strive to
                be the industry leader in safety and compliance, and we work
                tirelessly to exceed the expectations of our customers."
              </p>
              <h1
                className={`${bebas.className} text-5xl text-center mt-6 md:mt-10  lg:mt-12 xl:text-5xl`}
              >
                OUR Vision
                <div className="h-1 w-12 bg-white rounded-lg relative left-2/4 -translate-x-2/4 mt-2 mb-4"></div>
              </h1>
              <p className="text-md lg:text-lg lg:mx-2 text-justify md:mt-10 font-thin mx-1 mb-6 md:mb-0">
                "Our vision is to be the leading provider of innovative and
                reliable flameproof solutions, recognized for our commitment to
                excellence, safety, and sustainability. We aim to continuously
                push the boundaries of flameproof technology, developing
                products that not only meet but exceed industry standards.
                Through our dedication to customer satisfaction and our values
                of integrity, teamwork, and accountability, we strive to be the
                go-to flameproof manufacturing company for our customers
                worldwide."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
