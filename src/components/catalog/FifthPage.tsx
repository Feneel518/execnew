import { FC } from "react";

interface FifthPageProps {}

const FifthPage: FC<FifthPageProps> = ({}) => {
  return (
    <div className="w-[210mm] h-[297mm] print:size-[A4] bg-exec text-white shadow-[rgba(0,_0,_0,_0.4)_0px_30px_90px] flex flex-col relative py-20 pr-16">
      <div className="w-full bg-[#023450] h-full p-10 pl-20 flex flex-col gap-8">
        <h1 className="text-5xl font-semibold">Our Process</h1>
        <div className="w-full h-[2px] bg-white"></div>
        <h2 className="text-2xl font-semibold">Mission</h2>
        <p className="text-justify">
          &quot;At Flameproof Manufacturing Company, our mission is to provide
          top-quality flameproof and explosion-proof solutions that keep our
          customers' employees, assets, and facilities safe. We are committed to
          excellence in everything we do, from research and development to
          manufacturing and customer service. We strive to be the industry
          leader in safety and compliance, and we work tirelessly to exceed the
          expectations of our customers.&quot;
        </p>
        <div className="w-full h-[2px] bg-white"></div>
        <h2 className="text-2xl font-semibold">Vision</h2>
        <p className="text-justify">
          &quot;Our vision is to be the leading provider of innovative and
          reliable flameproof solutions, recognized for our commitment to
          excellence, safety, and sustainability. We aim to continuously push
          the boundaries of flameproof technology, developing products that not
          only meet but exceed industry standards. Through our dedication to
          customer satisfaction and our values of integrity, teamwork, and
          accountability, we strive to be the go-to flameproof manufacturing
          company for our customers worldwide..&quot;
        </p>
      </div>
    </div>
  );
};

export default FifthPage;
