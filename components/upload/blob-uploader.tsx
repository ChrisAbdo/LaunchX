"use client";

import { useState, useCallback, useMemo, ChangeEvent } from "react";
import { PutBlobResult } from "@vercel/blob";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function BlobUploader({
  coverImg,
  setCoverImg,
}: {
  coverImg: string;
  setCoverImg: (coverImg: string) => void;
}) {
  const [data, setData] = useState<{
    image: string | null;
  }>({
    image: null,
  });
  const [file, setFile] = useState<File | null>(null);

  const [dragActive, setDragActive] = useState(false);

  const onChangePicture = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.currentTarget.files && event.currentTarget.files[0];
      if (file) {
        if (file.size / 1024 / 1024 > 50) {
          //   toast.error('File size too big (max 50MB)')
        } else {
          setFile(file);
          const reader = new FileReader();
          reader.onload = (e) => {
            setData((prev) => ({ ...prev, image: e.target?.result as string }));
          };
          reader.readAsDataURL(file);
        }
      }
    },
    [setData]
  );

  const [saving, setSaving] = useState(false);

  const saveDisabled = useMemo(() => {
    return !data.image || saving;
  }, [data.image, saving]);

  const handleSubmit = async () => {
    setSaving(true);
    fetch("/api/create-blob", {
      method: "POST",
      headers: { "content-type": file?.type || "application/octet-stream" },
      body: file,
    }).then(async (res) => {
      if (res.status === 200) {
        const { url } = (await res.json()) as PutBlobResult;
        setCoverImg(url);
        toast.success("Cover image created successfully!");
      } else {
        const error = await res.text();
        toast.error(
          "Something went wrong. Please try again. This is likely a "
        );
        console.error(error);
      }
      setSaving(false);
    });
  };

  return (
    <div className="grid gap-6">
      <div>
        <div className="space-y-1 mb-4">
          <p className="text-sm text-muted-foreground">
            Accepted formats: .png, .jpg, .gif, .mp4
          </p>
        </div>
        <label
          htmlFor="image-upload"
          className="group relative mt-2 flex h-72 cursor-pointer flex-col items-center justify-center rounded-md border bg-background shadow-sm transition-all hover:bg-muted"
        >
          <div
            className="absolute z-[5] h-full w-full rounded-md"
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragActive(true);
            }}
            onDragEnter={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragActive(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragActive(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragActive(false);

              const file = e.dataTransfer.files && e.dataTransfer.files[0];
              if (file) {
                if (file.size / 1024 / 1024 > 50) {
                  //   toast.error('File size too big (max 50MB)')
                } else {
                  setFile(file);
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    setData((prev) => ({
                      ...prev,
                      image: e.target?.result as string,
                    }));
                  };
                  reader.readAsDataURL(file);
                }
              }
            }}
          />
          <div
            className={`${
              dragActive ? "border-2 border-black" : ""
            } absolute z-[3] flex h-full w-full flex-col items-center justify-center rounded-md px-10 transition-all ${
              data.image
                ? "bg-background/80 opacity-0 hover:opacity-100 hover:backdrop-blur-md"
                : "bg-background opacity-100 hover:bg-gray-50"
            }`}
          >
            <svg
              className={`${
                dragActive ? "scale-110" : "scale-100"
              } h-7 w-7 text-muted-foreground transition-all duration-75 group-hover:scale-110 group-active:scale-95`}
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
              <path d="M12 12v9"></path>
              <path d="m16 16-4-4-4 4"></path>
            </svg>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Drag and drop or click to upload.
            </p>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Max file size: 50MB
            </p>
            <span className="sr-only">Photo upload</span>
          </div>
          {data.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={data.image}
              alt="Preview"
              className="h-full w-full rounded-md object-cover"
            />
          )}
        </label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <input
            id="image-upload"
            name="image"
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={onChangePicture}
          />
        </div>
      </div>

      <Button
        variant="secondary"
        disabled={saveDisabled}
        onClick={handleSubmit}
      >
        {saving ? <>loading</> : <p className="text-sm">Create cover image</p>}
      </Button>
    </div>
  );
}
