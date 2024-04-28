import { FC } from "react";

interface DebugProps {
  children?: React.ReactNode;
}

const Debug: FC<DebugProps> = ({ children }) => {
  return (
    <div className="bg-stripes bg-stripes-white bg-red-500 bg-opacity-25 absolute inset-0 z-10">
      {children}
    </div>
  );
};

export default Debug;
