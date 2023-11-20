import NumberTicker from "@/components/number-ticker";
import { ShareProfile } from "@/components/profile/share-profile";
import { prisma } from "@/prisma/db";
import React from "react";

export default async function Page({ params }: { params: { slug: string } }) {
  const profile = await prisma.user.findUnique({
    where: {
      id: params.slug,
    },
  });
  const posts = await prisma.post.findMany({
    where: {
      author: {
        id: {
          equals: params.slug,
          mode: "insensitive",
        },
      },
    },
    include: {
      Comment: true,
    },
  });
  return (
    <div>
      <div className="mt-4 mx-auto max-w-3xl md:flex md:items-center md:justify-between md:space-x-5 lg:max-w-7xl">
        <div className="flex items-center space-x-5">
          <div className="flex-shrink-0">
            <div className="relative">
              <img
                className="h-16 w-16 rounded-full"
                src={profile?.image || ""}
                alt=""
              />
              <span
                className="absolute inset-0 rounded-full shadow-inner"
                aria-hidden="true"
              />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {profile?.name}
            </h1>
            <p className="text-sm font-medium text-gray-500">
              {/* {posts.length} posts */}
              <NumberTicker value={posts.length} />
            </p>
          </div>
        </div>
        <div className="mt-6 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-3 sm:space-y-0 sm:space-x-reverse md:mt-0 md:flex-row md:space-x-3">
          {/* <button
            type="button"
            className="inline-flex items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Disqualify
          </button> */}
          <ShareProfile profileName={profile?.id} />
        </div>
      </div>
      {posts.map((post) => (
        <div key={post.id}>
          <h1>{post.title}</h1>
          <p>{post.description}</p>
        </div>
      ))}
    </div>
  );
}
