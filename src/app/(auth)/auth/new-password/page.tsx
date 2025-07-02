import NewPasswordForm from "@/components/auth/Forms/NewPasswordForm";
import { FC, Suspense } from "react";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <Suspense>
      <NewPasswordForm></NewPasswordForm>
    </Suspense>
  );
};

export default page;
