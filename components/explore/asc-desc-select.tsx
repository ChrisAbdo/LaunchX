"use client";
import React, { useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

export default function UpvoteDirectionSelector() {
  const router = useRouter();

  const pathname = usePathname();
  const searchParams = useSearchParams()!;

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );
  return (
    <Select
      onValueChange={(value) => {
        // if value is default, remove the query from the URL
        if (value === "default") {
          const params = new URLSearchParams(searchParams);
          params.delete("sort");
          router.push("?" + params.toString());
          return;
        }

        router.push("?" + createQueryString("sort", value));
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="default">Default</SelectItem>
        <SelectItem value="ascending">Ascending</SelectItem>
        <SelectItem value="descending">Descending</SelectItem>
      </SelectContent>
    </Select>
  );
}
