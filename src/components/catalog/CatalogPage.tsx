import { FC } from "react";
import FitContent from "../Global/FitContent";
import { cn } from "@/lib/utils";

interface CatalogPageProps {
  table: React.ReactNode;
  heading: React.ReactNode;
  footer: React.ReactNode;
  onResize: () => void;
  additionalNotes?: string;
  className?: React.ReactNode;
  index: number;
  pageIndex: number;
}

const CatalogPage: FC<CatalogPageProps> = ({
  table,
  heading,
  footer,
  onResize,
  additionalNotes,
  className,
  index,
  pageIndex,
}) => {
  return (
    <div
      className={cn(
        "w-[210mm] h-[297mm] print:size-[A4] bg-white text-black shadow-[rgba(0,_0,_0,_0.4)_0px_30px_90px] flex flex-col py-20 pl-16 relative",
        className
      )}
    >
      <div className="">{heading}</div>
      <div className="w-full bg-[#023450] h-full relative p-10 pr-20">
        <FitContent onResize={onResize}>{table}</FitContent>
        {additionalNotes && (
          <div className="font-bold">Notes: {additionalNotes}</div>
        )}
      </div>
      <div className="">{footer}</div>
    </div>
  );
};

export default CatalogPage;
