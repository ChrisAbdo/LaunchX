import { ImageResponse } from "next/og";
import { prisma } from "@/prisma/db";

export const alt = "LaunchX";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

// Image generation
export default async function Image({ params }: { params: { slug: string } }) {
  const project = await prisma.post.findUnique({
    where: {
      id: params.slug,
    },
  });
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 128,
          background: "white",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {project?.title}
      </div>
    ),
    {
      ...size,
    }
  );
}
