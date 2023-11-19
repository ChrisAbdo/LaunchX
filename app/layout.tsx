import type { Metadata } from "next";
import "./globals.css";

import { ThemeProvider } from "@/lib/theme-provider";
import { AuthProvider } from "@/lib/auth/auth-provider";
import Navbar from "@/components/layout/navbar";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { Toaster } from "sonner";
import { TailwindIndicator } from "@/components/layout/tw-indicator";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <AuthProvider>
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            {/* <Container>{children}</Container> */}
            <div className="max-w-screen-xl mx-auto w-full px-4">
              {children}
            </div>
            <Toaster position="top-center" richColors />
            <TailwindIndicator />
          </ThemeProvider>
        </body>
      </AuthProvider>
    </html>
  );
}
