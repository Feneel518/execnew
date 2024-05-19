"use client";

import { FC } from "react";
import { Button } from "../ui/button";

interface DownloadButtonProps {
  quotationNumber?: number;
  clientName?: string;
  isOrder?: boolean;
}

const DownloadButton: FC<DownloadButtonProps> = ({
  quotationNumber,
  clientName,
  isOrder,
}) => {
  return (
    <div>
      <Button
        onClick={() => {
          document.title = isOrder
            ? `ExOr=${quotationNumber} - ${clientName}`
            : `ExQn-${quotationNumber} - ${clientName}`;
          window.print();
        }}
        className="print:hidden"
      >
        Download PDF
      </Button>
    </div>
  );
};

export default DownloadButton;
