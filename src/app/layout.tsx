import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { Figtree } from "next/font/google";
import "./globals.css";

const figtree = Figtree({ subsets: ["latin"], variable: "--font-figtree" });

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${figtree.variable} antialiased`} style={{ fontFamily: "var(--font-figtree), sans-serif" }}>{children}</body>
    </html>
  );
}
