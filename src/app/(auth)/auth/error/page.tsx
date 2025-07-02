import ErrorCard from "@/components/auth/ErrorCard";
import { FC, Suspense } from "react";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <Suspense>
      <ErrorCard></ErrorCard>
    </Suspense>
  );
};

export default page;
