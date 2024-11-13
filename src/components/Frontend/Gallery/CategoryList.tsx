import { buttonVariants } from "@/components/ui/button";
import { bebas, inter } from "@/lib/fonts";
import { CategoriesAndProducts } from "@/lib/types";
import Link from "next/link";
import { FC } from "react";

interface CategoryListProps {
  category: CategoriesAndProducts;
  index: number;
}

const CategoryList: FC<CategoryListProps> = ({ category, index }) => {
  return (
    <div className="max-2xl:mx-10 max-md:mx-2 mt-8 md:mt-20 relative">
      <div className=" grid grid-cols-3 max-md:grid-cols-1">
        <div className="border-color border-l-0 border-r-0 flex items-start justify-center">
          {(index + 2) % 2 === 0 ? (
            <div className="w-full h-full flex items-center justify-center">
              <img
                className=" w-[200px] md:w-[400px] my-10 "
                src={category.image}
                alt={category.name}
              ></img>
            </div>
          ) : (
            <div className=" flex-1 flex flex-col items-start mb-10">
              <h1
                className={`${bebas.className} text-4xl text-center mt-10  lg:mt-12 xl:text-5xl`}
              >
                Types
              </h1>
              {/* Types */}
              {category.product.map((item, index) => {
                return (
                  <Link
                    href={`/product/${item.slug}`}
                    key={item.id}
                    className={`text-[20px] font-extralight mt-4 lg:text-md tracking-[3px] whitespace-pre-line ${buttonVariants(
                      { variant: "whiteLink", size: "withoutPadding" }
                    )}`}
                  >
                    {index + 1}. {item.name}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
        <div className="border-color flex items-start justify-center p-4">
          <h1
            className={`${bebas.className} text-5xl text-center mt-6 md:mt-10  lg:mt-12 xl:text-5xl`}
          >
            {/* Category Name */}
            {category.name}

            <div className="h-1 w-12 bg-white rounded-lg relative left-2/4 -translate-x-2/4 mt-2 mb-4"></div>
            <div
              className={`${inter.className} text-[18px] leading-6 font-thin flex flex-col gap-2`}
            >
              {category.description?.split(/\n\s*\n/).map((des) => {
                return <p className="text-justify">{des}</p>;
              })}
            </div>
          </h1>
        </div>
        <div className="border-color border-r-0 border-l-0 flex items-start justify-center pl-4">
          {(index + 2) % 2 === 0 ? (
            <div className=" flex-1 flex flex-col items-start  mb-10">
              <h1
                className={`${bebas.className} text-4xl text-center mt-10  lg:mt-12 xl:text-5xl`}
              >
                Types
              </h1>
              {/* Types */}
              {category.product.map((item, index) => {
                return (
                  <Link
                    href={`/product/${item.slug}`}
                    key={item.id}
                    className={`text-[20px] font-extralight mt-4 lg:text-md tracking-[3px] whitespace-pre-line ${buttonVariants(
                      { variant: "whiteLink", size: "withoutPadding" }
                    )}`}
                  >
                    {index + 1}. {item.name}
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <img
                className=" w-[200px] md:w-[400px] my-10 "
                src={category.image}
                alt={category.name}
              ></img>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryList;
