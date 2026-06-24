import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://fibra-x.vercel.app"),
  title: {
    default: "FibraX",
    template: "%s",
  },
  applicationName: "FibraX",
  description:
    "A Bitcoin cycle research dashboard for visualizing bull and bear market phases with Fibonacci ratio context.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "FibraX",
    title: "FibraX",
    description:
      "A Bitcoin cycle research dashboard for visualizing bull and bear market phases with Fibonacci ratio context.",
    url: "https://fibra-x.vercel.app/dashboard",
  },
  twitter: {
    card: "summary_large_image",
    title: "FibraX",
    description:
      "A Bitcoin cycle research dashboard for visualizing bull and bear market phases with Fibonacci ratio context.",
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-black text-zinc-100">
        <QueryProvider>
          <Navbar />
          {children}
          <Footer />
        </QueryProvider>
        <Analytics />
      </body>
    </html>
  );
}
