import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SidebarLayout from "@/components/SidebarLayout";
import { NextAuthProvider } from "@/components/NextAuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Virtual Question Bank System",
  description:
    "Enhance your examination preparation with our comprehensive question bank system. Manage your questions, track your progress, and get detailed analytics to improve your learning experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthProvider>
          <SidebarLayout>{children}</SidebarLayout>
        </NextAuthProvider>
      </body>
    </html>
  );
}
