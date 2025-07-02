import { AlertTriangle } from "lucide-react";
import { FC } from "react";

interface FormErrorProps {
  message?: string;
}

const FormError: FC<FormErrorProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive">
      <AlertTriangle className="w-4 h-4" />
      {message}
    </div>
  );
};

export default FormError;
