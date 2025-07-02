import { db } from "@/lib/db";
import { FC } from "react";
import Catalog from "./Catalog";
import FirstPage from "./FirstPage";
import SecondPage from "./SecondPage";
import ThirdPage from "./ThirdPage";
import FouthPage from "./FouthPage";
import FifthPage from "./FifthPage";
import LastPage from "./LastPage";
import { getCategoriesWithProductsForCatalog } from "@/lib/queries";
import ClientsPage from "./ClientsPage";

interface ProductsPageProps {}

const ProductsPage: FC<ProductsPageProps> = async ({}) => {
  const categories = await getCategoriesWithProductsForCatalog();

  if (!categories?.success || categories.error) return;

  return (
    <div className="flex flex-col gap-10 print:gap-0">
      <FirstPage></FirstPage>
      <SecondPage></SecondPage>
      <ThirdPage></ThirdPage>
      <FouthPage></FouthPage>
      <FifthPage></FifthPage>
      {categories.success.map((categor, index) => {
        return (
          <Catalog
            key={categor.name}
            catalogData={categor}
            index={index + 5}
          ></Catalog>
        );
      })}
      {/* <ClientsPage></ClientsPage> */}

      {/* <Catalog index={0 + 5} catalogData={categories[0]}></Catalog> */}
    </div>
  );
};

export default ProductsPage;
