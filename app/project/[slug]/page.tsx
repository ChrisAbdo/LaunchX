import React from "react";
import { prisma } from "@/prisma/db";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { GitHubLogoIcon, OpenInNewWindowIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import CommentForm from "@/components/upload/comment";

export default async function Page({ params }: { params: { slug: string } }) {
  const project = await prisma.post.findUnique({
    where: {
      id: params.slug,
    },
    include: {
      author: true,
    },
  });

  const comments = await prisma.comment.findMany({
    where: {
      postId: params.slug,
    },
    include: {
      author: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="bg-background py-12">
      <div className="mx-auto max-w-3xl text-base leading-7">
        <p className="text-base font-semibold leading-7 text-muted-foreground">
          Introducing...
        </p>
        <div className="mt-2 flex items-center justify-between text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          <div className="flex items-center">
            {project?.title}
            <Badge className="ml-2">{project?.framework}</Badge>
          </div>

          <div>
            <p className="text-sm font-normal">
              uploaded by {project?.author?.name}
            </p>
          </div>
        </div>
        <p className="mt-2 text-foreground text-xl leading-8">
          {project?.description}
        </p>

        <Separator className="mt-8" />
        <figure className="mt-8">
          <AspectRatio ratio={16 / 9} className="bg-muted rounded-md">
            <Image
              src={project?.coverImg || ""}
              alt="Project cover image"
              fill
              className="rounded-md object-cover"
            />
          </AspectRatio>
        </figure>

        <Separator className="mt-8" />
        <div className="mt-10 flex items-center space-x-2">
          {/* <p className="text-muted-foreground">
            Framework: {project?.framework}
          </p> */}
          <Button asChild>
            {/* @ts-ignore */}
            <Link href={project?.githubUrl} target="_blank">
              <GitHubLogoIcon className="h-5 w-5 mr-2" />
              View Repository
            </Link>
          </Button>
          <Button variant="outline" asChild>
            {/* @ts-ignore */}
            <Link href={project?.siteUrl} target="_blank">
              <OpenInNewWindowIcon className="h-5 w-5 mr-2" />
              View Site
            </Link>
          </Button>
        </div>

        <Separator className="mt-8" />
        <h1 className="text-xl font-light mt-4">Comments</h1>
        {/* COMMENT FORM */}
        {/* <form
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
        </form> */}
        <CommentForm project={project} />

        {/* COMMENTS */}
        {comments.map((comment) => (
          <>
            <div key={comment.id} className="text-sm flex items-start gap-4">
              <Avatar className="w-10 h-10 border">
                {/* @ts-ignore */}
                <AvatarImage alt="@username1" src={comment.author.image} />
                <AvatarFallback>U1</AvatarFallback>
              </Avatar>
              <div className="grid gap-1.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-semibold">@{comment.author.name}</div>

                  <time>
                    {new Date(comment.createdAt).toLocaleDateString()} at{" "}
                    {new Date(comment.createdAt).toLocaleTimeString()}
                  </time>
                </div>
                <div>{comment.body}</div>
              </div>
            </div>

            <Separator className="my-4" />
          </>
        ))}
      </div>
    </div>
  );
}
