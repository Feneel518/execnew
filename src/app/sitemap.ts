import { fetchProductsForSelect } from "@/lib/queries";

export default async function sitemap() {
  const getProducts = await fetchProductsForSelect();
  const products = getProducts?.success?.map((product) => {
    return {
      url: `https://explosionproofelectrical.com/products/${product.slug}`,
      lastModified: product.createdAt,
    };
  });

  return [
    {
      url: "https://explosionproofelectrical.com",
      lastModified: new Date(),
    },
    ...products!,
  ];
}
