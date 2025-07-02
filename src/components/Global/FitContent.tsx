"use client";

import { FC, useState } from "react";
import Debug from "../Dashboard/Quotations/Debug";

interface FitContentProps {
  children: React.ReactNode;
  onResize: () => void;
}

const FitContent: FC<FitContentProps> = ({ children, onResize }) => {
  const [availableHeight, setAvailableHeight] = useState<
    number | null | undefined
  >(null);

  if (availableHeight === null) {
    return (
      <div
        ref={(element) => {
          if (!element) return;
          setAvailableHeight(element.parentElement?.clientHeight);
        }}
      >
        <Debug></Debug>
      </div>
    );
  }

  return (
    <div
      ref={(element) => {
        if (!element) return;

        let height = element.parentElement?.scrollHeight;

        if (height && availableHeight) {
          if (height > availableHeight) {
            onResize();
            setAvailableHeight(null);
          }
        }
      }}
    >
      {/* <Debug></Debug> */}
      {children}{" "}
    </div>
  );
};

export default FitContent;
