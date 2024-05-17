import StoreProductForm from "@/components/Dashboard/StoreProduct/StoreProductForm";
import { getStoreProductDetailsBasedOnSlug } from "@/lib/queries";
import { FC } from "react";

interface pageProps {
  params: {
    slug: string;
  };
}

const page: FC<pageProps> = async ({ params }) => {
  const productDetails = await getStoreProductDetailsBasedOnSlug(params.slug);

  return (
    <div>
      <StoreProductForm
        productData={productDetails?.success}
      ></StoreProductForm>
    </div>
  );
};

export default page;
