import { FC } from "react";

interface NoResultsProps {}

const NoResults: FC<NoResultsProps> = ({}) => {
  return (
    <div className="py-4 flex items-center justify-center">No Results</div>
  );
};

export default NoResults;
