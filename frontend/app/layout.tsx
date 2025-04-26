import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { use } from "react";
import { cookies } from "next/headers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LearnScope",
  description: "Your learning journey starts here",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get theme preference from cookies on the server
  const theme = use(new Promise(async (resolve) => {
    const cookieStore = await cookies();
    const themeCookie = cookieStore.get("theme");
    if (themeCookie) {
      resolve(themeCookie.value);
    }
    resolve("light"); // Default to light theme if no cookie exists
  }))
  
  // Default to light theme if no cookie exists
  const isDark = theme === "dark";

  return (
    <html lang="en" className={isDark ? "dark" : ""} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
