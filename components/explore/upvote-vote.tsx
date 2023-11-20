"use client";
import React, { useEffect, useState } from "react";
import { upvotePost, checkIfUserUpvoted } from "@/app/actions";
import { ArrowUpIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { Badge } from "../ui/badge";

export default function UpvotePost({
  post,
  session,
}: {
  post: any;
  session: any;
}) {
  const [hasUpvoted, setHasUpvoted] = useState(false);

  useEffect(() => {
    const fetchUpvoteStatus = async () => {
      try {
        const upvoted = await checkIfUserUpvoted(post.id);
        setHasUpvoted(upvoted);
      } catch (error) {
        console.error("Failed to check upvote status:", error);
      }
    };

    fetchUpvoteStatus();
  }, [post.id]);

  const handleUpvote = async () => {
    try {
      const result = await upvotePost(post.id);

      if (result.message) {
        setHasUpvoted(result.message === "Successfully upvoted the post.");

        toast.success("Upvote data received successfully");
      }
    } catch (error) {
      toast.error("Something went wrong while upvoting the post");
      if (!session) {
        toast.error("You must be logged in to upvote a post");
      }
    }
  };

  return (
    <>
      {hasUpvoted ? (
        <Badge
          variant="secondary"
          onClick={handleUpvote}
          className="cursor-pointer tabular-nums"
        >
          {post._count.PostUpvote} <ArrowUpIcon className="h-4 w-4" />
        </Badge>
      ) : (
        <Badge
          variant="outline"
          onClick={handleUpvote}
          className="hover:bg-muted cursor-pointer tabular-nums"
        >
          {post._count.PostUpvote}
          <ArrowUpIcon className="h-4 w-4" />
        </Badge>
      )}
    </>
  );
}
