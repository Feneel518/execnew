import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";
import { FC } from "react";

interface loadingProps {}

const loading: FC<loadingProps> = ({}) => {
  return (
    <div className="flex justify-center  gap-4 text-2xl  ">
      <Loader2 className="animate-spin"></Loader2>
      Loading...
    </div>
  );
};

export default loading;
