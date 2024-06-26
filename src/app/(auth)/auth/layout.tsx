import { FC } from "react";

interface layoutProps {
  children: React.ReactNode;
}

const layout: FC<layoutProps> = ({ children }) => {
  return (
    <div className="h-screen flex items-center justify-center ">{children}</div>
  );
};

export default layout;
