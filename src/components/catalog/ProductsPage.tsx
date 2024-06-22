import { db } from "@/lib/db";
import { FC } from "react";
import Catalog from "./Catalog";
import FirstPage from "./FirstPage";
import SecondPage from "./SecondPage";
import ThirdPage from "./ThirdPage";
import FouthPage from "./FouthPage";
import FifthPage from "./FifthPage";
import LastPage from "./LastPage";

interface ProductsPageProps {}

const ProductsPage: FC<ProductsPageProps> = async ({}) => {
  const categories = await db.category.findMany({
    where: {
      product: {
        some: {
          image: {
            not: "",
          },
        },
      },
    },
    select: {
      name: true,
      product: {
        where: {
          image: {
            not: "",
          },
        },
        select: {
          name: true,
          image: true,
          gasGroup: true,
        },
        orderBy: {
          name: "asc",
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  if (categories === undefined) return;

  return (
    <div className="flex flex-col gap-10 print:gap-0">
      <FirstPage></FirstPage>
      <SecondPage></SecondPage>
      <ThirdPage></ThirdPage>
      <FouthPage></FouthPage>
      <FifthPage></FifthPage>
      {categories.map((categor, index) => {
        return (
          <Catalog
            key={categor.name}
            catalogData={categor}
            index={index + 5}
          ></Catalog>
        );
      })}

      {/* <Catalog index={0 + 5} catalogData={categories[0]}></Catalog> */}
    </div>
  );
};

export default ProductsPage;
