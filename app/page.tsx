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
import NumberTicker from "@/components/number-ticker";
import UpvotePost from "@/components/explore/upvote-vote";
import UpvoteDirectionSelector from "@/components/explore/asc-desc-select";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/auth-options";
import ExpandingArrow from "@/components/layout/expanding-arrow";

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await getServerSession(authOptions);

  const frameworkQuery = searchParams["framework"];
  const sortQuery = searchParams["sort"];

  const allPosts = await prisma.post.findMany({
    orderBy: sortQuery
      ? {
          PostUpvote: {
            _count: sortQuery === "ascending" ? "asc" : "desc",
          },
        }
      : {
          createdAt: "desc",
        },
    include: {
      author: true,
      _count: {
        select: {
          PostUpvote: true,
        },
      },
    },
  });

  const filteredPosts = frameworkQuery
    ? allPosts.filter((post) => post.framework === frameworkQuery)
    : allPosts;

  // @ts-ignore
  const allFrameworks = [...new Set(allPosts.map((post) => post.framework))];
  allFrameworks.sort();

  return (
    <>
      <GridPattern
        className={cn(
          "[mask-image:radial-gradient(900px_circle_at_center,white,transparent)]",
          "inset-x-0 inset-y-[-100%] sm:h-[120%] h-[150%] skew-y-12"
        )}
      />
      <div>
        <div className="mt-2 grid items-end justify-items-center gap-4 md:grid-cols-2 md:justify-items-start">
          <div className="grid max-w-lg content-start justify-items-center gap-3.5 py-16 md:max-w-md md:justify-items-start md:py-0">
            <h1 className="overflow-auto text-5xl font-normal leading-tight tracking-tight ">
              LaunchX
            </h1>
            <p className="text-center text-2xl font-light tracking-tight md:text-left">
              A community for open source builders. Find new projects to work
              on, or share your own.
            </p>

            <div className="flex flex-col items-center gap-3 md:flex-row">
              <Button asChild className="pr-6 group">
                <Link href="/upload">
                  Upload a Project Now
                  <ExpandingArrow className="h-4 w-4" />
                </Link>
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                <NumberTicker value={allPosts.length} />
              </p>
            </div>
          </div>
        </div>

        <Separator className="mt-2 md:mt-6" />

        <div className="mt-6 flex items-center space-x-2 bg-background">
          <UpvoteDirectionSelector />
          <Separator orientation="vertical" className="h-8" />
          <div className="flex overflow-x-auto space-x-2">
            {allFrameworks.map((framework) => (
              <FrameworkBadges key={framework} framework={framework} />
            ))}
          </div>
        </div>

        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-6 mt-4">
          {filteredPosts.map((post: any) => (
            <div
              key={post.id}
              className="bg-background rounded-none overflow-hidden"
            >
              <div className="flex justify-between items-center mb-2">
                {/* <p className="text-xs font-extralight">*{post.framework}</p> */}
                <UpvotePost post={post} session={session} />
                <Link href={`/project/${post.id}`}>
                  <Badge className="hover:bg-muted" variant="outline">
                    View
                  </Badge>
                </Link>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <Image
                alt="Item 1"
                className="object-cover w-full h-48 border rounded-none aspect-[1/1]"
                height="400"
                src={post.coverImg}
                width="400"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mPsqAcAAZUBCZuIJhEAAAAASUVORK5CYII="
                loading="lazy"
                priority
              />
              <div className="flex justify-between items-center mt-2">
                <h3 className="font-light text-md">{post.title}</h3>
                <Link
                  href={`/profile/${post.author.id}`}
                  className="hover:underline font-extralight text-sm text-muted-foreground"
                >
                  {post.author.name}
                </Link>
              </div>
            </div>
          ))}
        </section>
      </div>
    </>
  );
}
