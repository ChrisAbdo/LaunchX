"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

import { HamburgerMenuIcon, RocketIcon } from "@radix-ui/react-icons";
import ProfileDropdown from "./profile-dropdown";
import { ModeToggle } from "./mode-toggle";
import { Badge } from "../ui/badge";

export default function MainNav() {
  const pathname = usePathname();

  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav
        className="flex items-center justify-between py-3 px-3"
        aria-label="Global"
      >
        <div className="flex items-center gap-x-12">
          <Link href="/" className="flex items-center space-x-2">
            <RocketIcon className="h-5 w-5 text-foreground" />
            <span className="overflow-auto font-semibold leading-tight tracking-tight">
              LaunchX
            </span>
            <Badge className="rounded-sm">Beta</Badge>
          </Link>
          <div className="hidden md:flex md:gap-x-12">
            <Link
              href="/upload"
              className={cn(
                "transition-colors hover:text-foreground/80 text-sm font-medium",
                pathname === "/upload"
                  ? "text-foreground"
                  : "text-foreground/60"
              )}
            >
              Upload
            </Link>
            <Link
              href="/about"
              className={cn(
                "transition-colors hover:text-foreground/80 text-sm font-medium",
                pathname?.startsWith("/about")
                  ? "text-foreground"
                  : "text-foreground/60"
              )}
            >
              About
            </Link>
          </div>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            {/* <Menu className="h-6 w-6" aria-hidden="true" /> */}
          </button>
        </div>
        <div className="flex items-center space-x-1">
          {session ? (
            <ProfileDropdown />
          ) : (
            <Button variant="default" onClick={() => signIn()}>
              Log in
            </Button>
          )}

          <ModeToggle />
        </div>
      </nav>
    </header>
  );
}
