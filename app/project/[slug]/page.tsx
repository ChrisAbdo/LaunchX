import React from "react";
import { prisma } from "@/prisma/db";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { GitHubLogoIcon, OpenInNewWindowIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default async function Page({ params }: { params: { slug: string } }) {
  const project = await prisma.post.findUnique({
    where: {
      id: params.slug,
    },
    include: {
      author: true,
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
            <Link href={project?.githubUrl} target="_blank">
              <GitHubLogoIcon className="h-5 w-5 mr-2" />
              View Repository
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={project?.siteUrl} target="_blank">
              <OpenInNewWindowIcon className="h-5 w-5 mr-2" />
              View Site
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
