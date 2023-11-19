"use client";

import React from "react";
import { Badge } from "../ui/badge";
import { useRouter, useSearchParams } from "next/navigation";

export default function FrameworkBadges({ framework }: { framework: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get("framework");

  const badgeVariant = search === framework ? "default" : "secondary";

  const handleClick = () => {
    if (search === framework) {
      // If the current framework is already selected, remove the query from the URL
      router.push("/explore");
    } else {
      // Otherwise, navigate to the URL with the framework as a query parameter
      router.push(`/explore?framework=${framework}`);
    }
  };

  return (
    <>
      <Badge
        onClick={handleClick}
        key={framework}
        variant={badgeVariant}
        className="cursor-pointer"
      >
        {framework}
      </Badge>
    </>
  );
}
