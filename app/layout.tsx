import type { Metadata } from "next";
import "./globals.css";
import { body, display, mono } from "./fonts";

export const metadata: Metadata = {
  title: "Norwegian Foot March | Ares Company",
  description:
    "Official event information for the Norwegian Foot March hosted by the Ares Company in Oceanside, California, on 23 January 2027.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="bg-ground text-ink font-body antialiased">{children}</body>
    </html>
  );
}
