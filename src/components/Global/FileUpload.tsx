"use client";

import { FileIcon, X } from "lucide-react";
import Image from "next/image";
import { FC } from "react";
import { Button } from "../ui/button";
import { UploadDropzone } from "@/lib/uploadthing";

interface FileUploadProps {
  apiEndPoint: "imageUploader" | "LrUpload" | "orderPDFUploader";
  onChange: (url?: string) => void;
  value?: string;
  orderPDF?: string;
}

const FileUpload: FC<FileUploadProps> = ({
  apiEndPoint,
  onChange,
  value,
  orderPDF,
}) => {
  const type = value?.split(".").pop();

  if (value) {
    return (
      <div className="flex flex-col justify-center items-center">
        {type !== "pdf" ? (
          <div className="relative w-40 h-40">
            <Image
              src={value}
              alt="uploaded image"
              className="object-contain"
              fill
            ></Image>
          </div>
        ) : (
          <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
            <FileIcon></FileIcon>
            <a
              href={value}
              target="_blank"
              rel="noopener_noreferrer"
              className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
            >
              {orderPDF ? orderPDF : "View PDF"}
            </a>
          </div>
        )}
        <Button
          variant={"ghost"}
          type="button"
          className=""
          onClick={() => onChange("")}
        >
          <X className="h-4 w-4"></X>{" "}
          {apiEndPoint === "orderPDFUploader" ? "Remove PDF" : "Remove image"}
        </Button>
      </div>
    );
  }
  return (
    <div className="w-full bg-muted/30 cursor-pointer">
      <UploadDropzone
        endpoint={apiEndPoint}
        onClientUploadComplete={(res) => {
          onChange(res?.[0].url);
        }}
        onUploadError={(error: Error) => {}}
      ></UploadDropzone>
    </div>
  );
};

export default FileUpload;
