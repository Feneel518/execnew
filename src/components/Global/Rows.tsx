import { FC } from "react";

interface RowsProps {
  item: string;
}

const Rows: FC<RowsProps> = ({ item }) => {
  return (
    <div className="flex items-center gap-2  p-1 text-ellipsis  ">
      <span>{item}</span>
    </div>
  );
};

export default Rows;
