import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CivicConnect Municipality Complaint Portal",
  description:
    "A municipal citizen service portal for filing complaints, tracking tickets, and routing issues to city departments.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
