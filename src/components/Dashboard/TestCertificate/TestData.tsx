import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TESTS } from "@/lib/data";
import { FC } from "react";
import QuotationFooter from "../Quotations/QuotationFooter";
import Image from "next/image";
import Logo from "../../../../public/logo1.png";

interface TestDataProps {}

const TestData: FC<TestDataProps> = ({}) => {
  return (
    <section className="flex flex-col h-full">
      <div className="p-8 flex flex-col gap-4 flex-1">
        <p className="text-xs text-center">
          This is to certify that the follwoing inspections and tests were
          carried out as per specifications relevant Indian Standards.
        </p>
        <p className="text-xs text-center font-bold">
          This certificate shall be valid if it is Orignal and only for above
          quantity for reference projects mentioned above.
        </p>
        <Separator></Separator>
        <Table className="">
          <TableHeader>
            <TableRow>
              <TableHead className="">#</TableHead>
              <TableHead className="">Nature of Test</TableHead>
              <TableHead className=" ">Test Parameters</TableHead>
              <TableHead className=" ">Result</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {TESTS.map((test, index) => {
              return (
                <>
                  <TableRow key={test.nature} className="">
                    <TableCell className="font-medium p-1 pl-4">
                      {1 + index}
                    </TableCell>
                    <TableCell className="p-1 px-4">{test.nature}</TableCell>
                    <TableCell className="text-sm  p-1">
                      {test.parameters}
                    </TableCell>

                    <TableCell className="p-1 pl-4">{test.result}</TableCell>
                  </TableRow>
                  {/* <Separator></Separator> */}
                </>
              );
            })}
          </TableBody>
        </Table>

        <div className="text-xs">
          All the above test were found satisfactory and clear for dispatch
        </div>
        <div className="place-self-end font-bold -mt-4">
          Explosion Proof Electrical Control
          <div className="flex items-center justify-center">
            <Image
              draggable={false}
              src={Logo}
              alt="Explosion Proof Electrical Logo"
              width={200}
              height={75}
            ></Image>
          </div>
        </div>
      </div>
      <div className="w-full bg-exec h-8 px-8 flex items-center text-white text-xs justify-between">
        <div className="">info@explosionproofelectrical.com</div>
      </div>
    </section>
  );
};

export default TestData;
