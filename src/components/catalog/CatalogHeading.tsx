import { FC } from "react";
import PageHeader from "./PageHeader";

interface CatalogHeadingProps {}

const CatalogHeading: FC<CatalogHeadingProps> = ({}) => {
  return (
    <div className=" bg-white w-full h-full">
      <PageHeader></PageHeader>
    </div>
  );
};

export default CatalogHeading;
