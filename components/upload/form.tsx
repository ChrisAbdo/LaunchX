"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import BlobUploader from "@/components/upload/blob-uploader";
import { addPost } from "@/app/actions";
import { toast } from "sonner";

export default function Form() {
  const [otherSelected, setOtherSelected] = React.useState("");
  const [selected, setSelected] = React.useState("");
  const [coverImg, setCoverImg] = React.useState("");

  const [uploadInfo, setUploadInfo] = React.useState({
    title: "",
    description: "",
    githubUrl: "",
    siteUrl: "",
    framework: "",
    coverImg: "",
  });

  return (
    <form
      action={async (formData: FormData) => {
        const result = await addPost(formData);
        if (result?.error) {
          toast.error("Something went wrong. Please try again.");
        } else {
          toast.success("Project uploaded successfully!");
        }
      }}
      className="mt-4 mb-4"
    >
      <div className="space-y-12">
        <div className="border-b pb-12">
          <h2 className="text-base font-semibold leading-7 text-foreground">
            Upload Project to LaunchX
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Get started by filling in the information below to upload your
            project to LaunchX.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="title">Project Title</Label>
                <Input
                  type="text"
                  name="title"
                  id="title"
                  placeholder="Title"
                  onChange={(e) =>
                    setUploadInfo({ ...uploadInfo, title: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="col-span-full">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="title">Project Description</Label>
                <Textarea
                  className="w-full"
                  rows={3}
                  name="description"
                  id="description"
                  placeholder="Description"
                  onChange={(e) =>
                    setUploadInfo({
                      ...uploadInfo,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <p className="mt-3 text-sm leading-6 text-foreground">
                Write a few sentences about the project.
              </p>
            </div>

            <div className="col-span-full">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="title">GitHub Repository URL</Label>
                <Input
                  type="text"
                  name="githubUrl"
                  id="githubUrl"
                  placeholder="ex: https://www.github.com/chrisabdo/launchx"
                  onChange={(e) =>
                    setUploadInfo({ ...uploadInfo, githubUrl: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="col-span-full">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="title">Project URL</Label>
                <Input
                  type="text"
                  name="siteUrl"
                  id="siteUrl"
                  placeholder="ex: launchx.vercel.app"
                  onChange={(e) =>
                    setUploadInfo({ ...uploadInfo, siteUrl: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="col-span-full">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="framework">Framework</Label>

                <div className="flex gap-2">
                  <Select
                    onValueChange={(value) => {
                      // if value is other set it to other
                      if (value === "other") {
                        setOtherSelected(value);
                      } else {
                        setSelected(value);
                        setUploadInfo({
                          ...uploadInfo,
                          framework: value,
                        });
                      }
                    }}
                  >
                    <SelectTrigger className="min-w-[200px]">
                      <SelectValue placeholder="Framework" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nextjs">Next.js</SelectItem>
                      <SelectItem value="vue">Vue</SelectItem>
                      <SelectItem value="svelte">Svelte</SelectItem>
                      <SelectItem
                        value="other"
                        onSelect={() => setOtherSelected("other")}
                      >
                        Other
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  {otherSelected === "other" ? (
                    <Input
                      type="text"
                      name="framework"
                      id="framework"
                      placeholder="framework. ex: HTMX"
                    />
                  ) : null}

                  {/* input set value of selected */}
                  <Input
                    type="hidden"
                    name="framework"
                    id="framework"
                    value={selected}
                    onChange={(e) =>
                      setUploadInfo({
                        ...uploadInfo,
                        framework: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="col-span-full">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="coverImg">Cover Image</Label>

                <BlobUploader coverImg={coverImg} setCoverImg={setCoverImg} />
                {!coverImg ? null : (
                  <Input
                    type=""
                    name="coverImg"
                    id="coverImg"
                    placeholder="coverImg"
                    readOnly
                    value={coverImg}
                    onChange={(e) =>
                      setUploadInfo({ ...uploadInfo, coverImg: e.target.value })
                    }
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <Button
          variant="ghost"
          type="button"
          className="text-sm font-semibold leading-6"
          onClick={() => {
            window.location.reload();
          }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className=" text-sm font-semibold leading-6"
          disabled={
            !uploadInfo.title ||
            !uploadInfo.description ||
            !uploadInfo.githubUrl ||
            !uploadInfo.siteUrl ||
            !uploadInfo.framework
          }
        >
          Upload
        </Button>
      </div>
    </form>
  );
}
