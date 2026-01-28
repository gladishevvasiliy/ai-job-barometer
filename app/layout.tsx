import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "AI Job Barometer",
    template: "%s | AI Job Barometer",
  },
  description:
    "Community-driven barometer: vote whether you're still working or AI replaced your job. See real-time stats by specialization and period.",
  keywords: ["AI", "jobs", "barometer", "automation", "employment", "vote", "community"],
  authors: [{ name: "Vasiliy Gladishev", url: "https://x.com/GladysevVasilij" }],
  creator: "Vasiliy Gladishev",
  openGraph: {
    type: "website",
    title: "AI Job Barometer",
    description:
      "Community-driven barometer: vote whether you're still working or AI replaced your job. See real-time stats by specialization and period.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Job Barometer",
    description:
      "Community-driven barometer: vote whether you're still working or AI replaced your job. See real-time stats by specialization and period.",
    creator: "@GladysevVasilij",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
