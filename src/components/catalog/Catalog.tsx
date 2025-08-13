"use client";
import { FC, useState } from "react";
import CatalogPage from "./CatalogPage";
import PageHeader from "./PageHeader";
import { CatalogTable } from "@/lib/types";
import CatalogTables from "./CatalogTable";
import CatalogFooter from "./CatalogFooter";

interface CatalogProps {
  catalogData: CatalogTable;
  index: number;
}

const Catalog: FC<CatalogProps> = ({ catalogData, index }) => {
  const [perPage, setPerPage] = useState([catalogData.product.length]);

  let pages = perPage.map((amount, i) => {
    let offset = perPage
      .slice(0, i)
      .reduce((total, amount) => total + amount, 0);
    return catalogData.product.slice(offset, offset + amount);
  });

  return (
    <div className="flex flex-col gap-4 print:gap-0 relative">
      {pages.map((group, pageIndex, list) => {
        return (
          <CatalogPage
            className="bg-exec text-white relative "
            onResize={() => {
              setPerPage((perPage) => {
                let clone = perPage.slice();

                clone[pageIndex] -= 1;
                clone[pageIndex + 1] = clone[pageIndex + 1] || 0;
                clone[pageIndex + 1] += 1;

                return clone;
              });
            }}
            key={pageIndex}
            table={
              //   <QuotationTable
              //     itemsIndex={
              //       index === 0 ? index : list[index - 1].length + index - 1
              //     }
              //     products={group}
              //   ></QuotationTable>
              <CatalogTables
                categoryName={catalogData.name}
                // @ts-ignore
                products={group}
                index={pageIndex}
              ></CatalogTables>
            }
            heading={<PageHeader></PageHeader>}
            footer={
              // <div className=""></div>
              <CatalogFooter></CatalogFooter>
            }
          ></CatalogPage>
        );
      })}
    </div>
  );
};

export default Catalog;
