import { FC } from "react";

import FitContent from "./FitContent";
import { cn } from "@/lib/utils";

interface A4PageProps {
  table: React.ReactNode;
  heading: React.ReactNode;
  footer: React.ReactNode;
  onResize: () => void;
  additionalNotes?: string;
  className?: React.ReactNode;
}

const A4Page: FC<A4PageProps> = ({
  table,
  heading,
  footer,
  onResize,
  additionalNotes,
  className,
}) => {
  // w-[210mm] h-[297mm]
  return (
    <div
      className={cn(
        " w-screen max-w-[210mm] min-h-[297mm] mx-4 print:mx-0 print:size-[A4] bg-white text-black shadow-[rgba(0,_0,_0,_0.4)_0px_30px_90px] flex flex-col  ",
        className
      )}
    >
      <div className="">{heading}</div>
      <div className="flex-1 relative px-8 py-4">
        <FitContent onResize={onResize}>{table}</FitContent>
        {additionalNotes && (
          <div className="font-bold">Notes: {additionalNotes}</div>
        )}
      </div>
      <div className="">{footer}</div>
    </div>
  );
};

export default A4Page;
