import CategoryForm from "@/components/Dashboard/Categories/CategoryForm";
import { getCategoryDetailsBasedOnSlug } from "@/lib/queries";
import { Category } from "@prisma/client";
import { redirect } from "next/navigation";
import { FC } from "react";

interface pageProps {
  params: {
    slug: string;
  };
}

const page: FC<pageProps> = async ({ params }) => {
  const categoryDetails: Category = await getCategoryDetailsBasedOnSlug(
    params.slug
  );

  if (!categoryDetails) redirect("/dashboard/categories");

  return (
    <div>
      <CategoryForm data={categoryDetails}></CategoryForm>
    </div>
  );
};

export default page;
