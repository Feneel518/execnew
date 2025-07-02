import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } }).onUploadComplete(
    async ({ metadata, file }) => {}
  ),
  orderPDFUploader: f({ pdf: { maxFileSize: "8MB" } }).onUploadComplete(
    async ({ metadata, file }) => {
      const fileName = file.key;
    }
  ),
  LrUpload: f({ image: { maxFileSize: "4MB" } }).onUploadComplete(
    async ({ metadata, file }) => {}
  ),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
