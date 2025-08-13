import { FC } from "react";

interface CatalogFooterProps {}

const CatalogFooter: FC<CatalogFooterProps> = ({}) => {
  return (
    <div className="absolute bottom-8 flex gap-2  items-center text-xs ">
      <h4>info@explosionproofelectrical.com</h4>
      <p className="font-light flex"></p>
    </div>
  );
};

export default CatalogFooter;
