import type { Metadata } from "next";
import { AboutPage } from "@/features/about/components/AboutPage";

export const metadata: Metadata = {
  title: "About | FibraX",
  description:
    "About FibraX, a Bitcoin cycle research dashboard portfolio project built with Next.js, TypeScript, and chart-first design principles.",
};

export default function AboutRoute() {
  return <AboutPage />;
}
