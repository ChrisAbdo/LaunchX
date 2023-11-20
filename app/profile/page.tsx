import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/prisma/db";
import { getServerSession } from "next-auth/next";
import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default async function Page() {
  const session = await getServerSession(authOptions);

  const posts = await prisma.post.findMany({
    where: {
      authorId: session?.user?.id,
    },
    include: {
      Comment: true,
    },
  });
  return (
    <div>
      <div className="flex items-center gap-x-6 mt-4">
        <img
          src={session?.user?.image}
          alt=""
          className="h-16 w-16 flex-none rounded-full ring-1 ring-gray-900/10"
        />
        <h1>
          <div className="leading-6 text-gray-500">
            <h1 className="font-medium text-foreground">
              {session?.user?.name}
            </h1>
          </div>
          <div className="mt-1 text-sm font-semibold leading-6 text-foreground">
            {posts.length} projects
          </div>
        </h1>
      </div>

      <Separator className="my-4" />

      <Table>
        <TableCaption>A list of your recent projects.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Project</TableHead>
            <TableHead>Framework</TableHead>
            <TableHead>URL</TableHead>
            <TableHead className="text-right">Comments</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post.id}>
              <TableCell className="font-medium">{post.title}</TableCell>
              <TableCell>
                <Badge variant="secondary">{post.framework}</Badge>
              </TableCell>
              <TableCell>{post.siteUrl}</TableCell>
              <TableCell className="text-right">
                {post.Comment.length}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
