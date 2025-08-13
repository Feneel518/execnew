import { FC } from "react";
import DiaryFirstPage from "./DiaryFirstPage";
import DiarySecondPage from "./DiarySecondPage";
import DiaryThirdPage from "./DiaryThirdPage";
import { getAllProducts } from "@/lib/queries";
import Diary from "./Diary";

interface ProductsDiaryPageProps {}

const ProductsDiaryPage: FC<ProductsDiaryPageProps> = async ({}) => {
  const products = await getAllProducts();

  if (!products || !products.success) return;

  const flatProducts = products.success.flatMap((category) =>
    category.product.map((product) => ({
      category: category.name,
      ...product,
    }))
  );

  return (
    <div className="space-y-3">
      <DiaryFirstPage></DiaryFirstPage>
      <DiarySecondPage></DiarySecondPage>
      <DiaryThirdPage></DiaryThirdPage>

      <Diary products={flatProducts}></Diary>
    </div>
  );
};

export default ProductsDiaryPage;
