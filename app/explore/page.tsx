import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { prisma } from "@/prisma/db";
import Link from "next/link";
import GridPattern from "@/components/ui/grid-pattern";
import React from "react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import FrameworkBadges from "@/components/explore/framework-badges";

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const frameworkQuery = searchParams["framework"];

  const allPosts = await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: true,
    },
  });

  // Filter posts based on the selected framework (if any)
  const filteredPosts = frameworkQuery
    ? //   @ts-ignore
      allPosts.filter((post) => post.framework === frameworkQuery)
    : allPosts;

  // Fetch all unique frameworks
  // @ts-ignore
  const allFrameworks = [...new Set(allPosts.map((post) => post.framework))];

  return (
    <>
      <GridPattern
        className={cn(
          "[mask-image:radial-gradient(900px_circle_at_center,white,transparent)]",
          "inset-x-0 inset-y-[-100%] h-[150%] skew-y-12"
        )}
      />
      {frameworkQuery}
      <div>
        <div className="mt-2 grid items-end justify-items-center gap-4 md:grid-cols-2 md:justify-items-start">
          <div className="grid max-w-lg content-start justify-items-center gap-3.5 py-16 md:max-w-md md:justify-items-start md:py-0">
            <h1 className="overflow-auto text-5xl font-normal leading-tight tracking-tight ">
              LaunchX
            </h1>
            <p className="text-center text-2xl font-light tracking-tight md:text-left">
              A community run by builders, for builders. Find new projects to
              work on, or share your own.
            </p>

            <div className="flex flex-col items-center gap-3 md:flex-row">
              <Button asChild>
                <Link href="/upload">Upload a Project Now</Link>
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                {allPosts.length} projects uploaded
              </p>
            </div>
          </div>
          <article className="grid w-full gap-2">
            <div className="flex items-center justify-between">
              <p className="text-sm opacity-40">N°989</p>
              <a
                className="border-black/20 bg-white text-black hover:border-black/40 active:border-black/20 active:bg-black/5 h-[24px] rounded-md px-1.5 text-sm tracking-tight inline-flex select-none items-center justify-center whitespace-nowrap border relative font-medium disabled:pointer-events-none"
                target="_blank"
                rel="noopener nofollow"
                href="https://lusion.co?ref=godly"
              >
                <span className="flex items-center gap-1.5">Open</span>
              </a>
            </div>
            <a className="group relative block" href="/website/989-lusion">
              <div className="relative w-full">
                <video
                  className="ease block w-full transition duration-200"
                  width="640"
                  height="400"
                >
                  <source
                    src="https://video.godly.website/video/upload/w_640/q_70/godly/recordings/grkx1rufffkxez4qcrlu.webm"
                    type="video/webm"
                  />
                  <source
                    src="https://video.godly.website/video/upload/w_640/q_70/godly/recordings/grkx1rufffkxez4qcrlu.mp4"
                    type="video/mp4"
                  />
                </video>
              </div>
              <div className="ease pointer-events-none absolute inset-0 border border-black/5 transition duration-150 group-hover:bg-black/20"></div>
            </a>
            <h1 className="truncate font-medium">Lusion</h1>
          </article>
        </div>

        <Separator className="mt-8" />

        <div className="mt-6 flex space-x-2 bg-background">
          {allFrameworks.map((framework) => (
            <FrameworkBadges key={framework} framework={framework} />
          ))}
        </div>

        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-6 mt-4">
          {filteredPosts.map((post: any) => (
            <div
              key={post.id}
              className="bg-background rounded-none overflow-hidden"
            >
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs font-extralight">*{post.framework}</p>
                <Badge variant="outline">View</Badge>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <Image
                alt="Item 1"
                className="object-cover w-full h-48 border rounded-none"
                height="400"
                src={post.coverImg}
                style={{
                  aspectRatio: "1/1",
                  objectFit: "cover",
                }}
                width="400"
              />
              <div className="flex justify-between items-center mt-2">
                <h3 className="font-semibold text-md">{post.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {post.author.name}
                </p>
              </div>
            </div>
          ))}
        </section>
      </div>
    </>
  );
}
