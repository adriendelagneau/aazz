"use client";

import { CldUploadWidget } from "next-cloudinary";
import { useCallback } from "react";

import { Button } from "@/components/ui/button";

type CloudinaryUploadButtonProps = {
  onUpload: (url: string) => void;
};

export function CloudinaryUploadButton({
  onUpload,
}: CloudinaryUploadButtonProps) {
  const handleUpload = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (result: any, { close }: { close: () => void }) => {
      if (result?.info?.secure_url) {
        onUpload(result.info.secure_url);
        close(); // Close widget to fix scroll blocking
      }
    },
    [onUpload]
  );

  return (
    <CldUploadWidget
      signatureEndpoint={"/api/image-upload"}
      onSuccess={handleUpload}
    >
      {({ open }) => (
        <Button type="button" onClick={() => open?.()}>
          Upload Image
        </Button>
      )}
    </CldUploadWidget>
  );
}

