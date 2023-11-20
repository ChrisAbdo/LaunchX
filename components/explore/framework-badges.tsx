"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";

export default function FrameworkBadges({ framework }: { framework: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get("framework");

  const badgeVariant = search === framework ? "default" : "secondary";

  const handleClick = () => {
    const params = new URLSearchParams(searchParams);
    if (search === framework) {
      // If the current framework is already selected, remove the query from the URL
      params.delete("framework");
    } else {
      // Otherwise, navigate to the URL with the framework as a query parameter
      params.set("framework", framework);
    }
    router.push("?" + params.toString());
  };

  return (
    <>
      <Button
        onClick={handleClick}
        key={framework}
        variant={badgeVariant}
        size="sm"
        className="cursor-pointer"
      >
        {framework}
      </Button>
    </>
  );
}
