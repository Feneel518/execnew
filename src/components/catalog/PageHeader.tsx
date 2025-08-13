import { FC } from "react";

interface PageHeaderProps {}

const PageHeader: FC<PageHeaderProps> = ({}) => {
  return (
    <div className="absolute top-8 flex gap-4 items-center text-xs">
      <h4>ExEC</h4>
      <div className="h-4 w-[1px] bg-white/50 "></div>
      <p className="font-light">Product Catalog</p>
    </div>
  );
};

export default PageHeader;
