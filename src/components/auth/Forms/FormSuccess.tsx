import { CheckCircle } from "lucide-react";
import { FC } from "react";

interface FormSuccessProps {
  message?: string;
}

const FormSuccess: FC<FormSuccessProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="bg-emerald-500/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-emerald-500">
      <CheckCircle className="w-4 h-4" />
      {message}
    </div>
  );
};

export default FormSuccess;
