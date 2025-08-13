import FitContent from "@/components/Global/FitContent";
import { cn } from "@/lib/utils";
import { FC } from "react";

interface DiaryPageProps {
  table: React.ReactNode;
  heading: React.ReactNode;
  footer: React.ReactNode;
  onResize: () => void;
  additionalNotes?: string;
  className?: React.ReactNode;
}

const DiaryPage: FC<DiaryPageProps> = ({
  table,
  heading,
  footer,
  onResize,
  additionalNotes,
  className,
}) => {
  return (
    <div
      className={cn(
        "w-[148mm] h-[210mm] print:size-[A4] bg-exec text-white shadow-[rgba(0,_0,_0,_0.4)_0px_30px_90px] flex flex-col py-16 pl-12 relative",
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

export default DiaryPage;
