import { Loader2 } from "lucide-react";
import { FC } from "react";

interface LoadingProps {}

const Loading: FC<LoadingProps> = ({}) => {
  return (
    <div className="flex items-center gap-2 ">
      <Loader2 className="animate-spin"></Loader2>Loading
    </div>
  );
};

export default Loading;
