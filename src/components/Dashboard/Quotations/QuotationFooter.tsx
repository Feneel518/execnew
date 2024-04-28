import { FC } from "react";

interface QuotationFooterProps {
  pageIndex?: number;
  totalLength?: number;
}

const QuotationFooter: FC<QuotationFooterProps> = ({
  pageIndex,
  totalLength,
}) => {
  return (
    <div className="w-full bg-exec h-8 px-8 flex items-center text-white text-xs justify-between">
      <div className="">info@explosionproofelectrical.com</div>
      <div className="">
        {pageIndex} of {totalLength}
      </div>
    </div>
  );
};

export default QuotationFooter;
