"use client";

import { CatalogTable } from "@/lib/types";
import { FC, useState } from "react";
import DiaryPage from "./DiaryPage";
import CatalogFooter from "@/components/catalog/CatalogFooter";
import PageHeader from "@/components/catalog/PageHeader";
import DiaryTable from "./DiaryTable";
import { chunkArray } from "@/lib/utils";

interface DiaryProps {
  products: {
    category: string;
    name: string;
    image: string;
    gasGroup: string | null;
  }[];
}

const Diary: FC<DiaryProps> = ({ products }) => {
  const [perPage, setPerPage] = useState([products.length]);

  //   let pages = perPage.map((amount, i) => {
  //     let offset = perPage
  //       .slice(0, i)
  //       .reduce((total, amount) => total + amount, 0);
  //     return products.slice(offset, offset + amount);
  //   });

  //   console.log(pages);

  const pages = chunkArray(products, 9);

  return (
    <div className="flex flex-col gap-4 print:gap-0 relative">
      {pages.map((group, pageIndex, list) => {
        return (
          <DiaryPage
            footer={<CatalogFooter></CatalogFooter>}
            heading={<PageHeader></PageHeader>}
            onResize={() => {
              setPerPage((perPage) => {
                let clone = perPage.slice();

                clone[pageIndex] -= 1;
                clone[pageIndex + 1] = clone[pageIndex + 1] || 0;
                clone[pageIndex + 1] += 1;

                return clone;
              });
            }}
            additionalNotes=""
            key={pageIndex}
            table={
              <DiaryTable
                // @ts-ignore
                products={group}
                categoryName={""}
              ></DiaryTable>
            }
          ></DiaryPage>
        );
      })}
    </div>
  );
};

export default Diary;
