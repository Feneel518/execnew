import ProductForm from "@/components/Dashboard/Products/ProductForm";
import {
  fetchCategoryForSelect,
  getProductDetailsBasedOnSlug,
} from "@/lib/queries";
import { Product, ProductComponentsOnProducts } from "@prisma/client";
import { FC } from "react";
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";

interface pageProps {
  params: {
    slug: string;
  };
}

const page: FC<pageProps> = async ({ params }) => {
  const queryClient = new QueryClient();
  const productDetails: Product & {
    ProductComponentsOnProducts: ProductComponentsOnProducts[];
  } = await getProductDetailsBasedOnSlug(params.slug);

  await queryClient.prefetchQuery({
    queryKey: ["categoryForSelect"],
    queryFn: fetchCategoryForSelect,
  });

  return (
    <div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        {/* @ts-ignore */}
        <ProductForm productData={productDetails}></ProductForm>
      </HydrationBoundary>
    </div>
  );
};

export default page;
