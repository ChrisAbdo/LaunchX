"use client";

import { addComment } from "@/app/actions";
import React from "react";
import { toast } from "sonner";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

export default function CommentForm({ project }: { project: any }) {
  return (
    <form
      //   action={addComment}
      action={async (formData: FormData) => {
        const result = await addComment(formData);
        if (result?.error) {
          toast.error("Something went wrong. Please try again.");
        } else {
          toast.success("Comment added successfully!");
        }
      }}
      className="flex flex-col items-end"
    >
      <Textarea
        id="body"
        name="body"
        className="mt-2 w-full"
        placeholder="Leave a comment..."
      />
      <input type="hidden" name="postId" value={project?.id} />
      <Button className="mt-2" variant="outline" type="submit">
        Submit
      </Button>
    </form>
  );
}
