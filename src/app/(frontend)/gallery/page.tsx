import CategoryList from "@/components/Frontend/Gallery/CategoryList";
import { bebas } from "@/lib/fonts";
import {
  fetchCategoryForCatalog,
  getCategoriesAndProducts,
} from "@/lib/queries";
import { Metadata } from "next";
import { FC } from "react";

interface pageProps {}

export const metadata: Metadata = {
  title: "Gallery",
};

const page: FC<pageProps> = async ({}) => {
  const categoriesWithProducts = await getCategoriesAndProducts();
  return (
    <div>
      <div className="max-2xl:mx-10 mt-10 md:mt-20">
        <h1 className={`${bebas.className} text-5xl md:text-7xl`}>
          FLAMEPROOF
        </h1>
        <h1 className={`${bebas.className} text-5xl md:text-7xl`}>
          CATEGORIES
        </h1>
        {/* separator */}
        <div className="h-1 md:h-2 w-10 md:w-20 bg-white rounded-lg mt-8 md:mt-14 "></div>
      </div>
      <div className="">
        {categoriesWithProducts?.success?.map((category, index, arr) => {
          return (
            <div className="flex flex-col  justify-center">
              <CategoryList category={category} index={index}></CategoryList>
              {index + 1 === arr.length ? (
                ""
              ) : (
                <div className="flex justify-between h-full max-md:mb-8">
                  <div className=" max-2xl:mx-10 mt-20  h-2 w-12 bg-white rounded-lg  "></div>
                  <div className=" max-2xl:mx-10 mt-20  h-2 w-12 bg-white rounded-lg  "></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default page;
