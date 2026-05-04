"use client";

import Link from "next/link";
import { useEffect } from "react";
import "./globals.css";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}

export default function GlobalError({ error, unstable_retry }: GlobalErrorProps) {
  useEffect(() => {
    console.error("FibraX global error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-zinc-100">
        <main className="min-h-screen bg-black text-zinc-100">
          <div className="mx-auto flex w-full max-w-[960px] flex-col items-center px-4 py-16 text-center sm:px-6 sm:py-24">
            <p className="text-xs uppercase tracking-[0.2em] text-[#F7931A]">500</p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-100 sm:text-4xl">
              Application Error
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-zinc-400 sm:text-base">
              FibraX encountered an unexpected issue. You can retry loading the app or return to the dashboard.
            </p>

            {error.digest ? (
              <p className="mt-3 rounded-md border border-zinc-800 bg-zinc-900/70 px-3 py-1.5 text-xs text-zinc-500">
                Reference ID: {error.digest}
              </p>
            ) : null}

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => unstable_retry()}
                className="rounded-lg border border-[#F7931A]/40 bg-[#F7931A]/10 px-4 py-2 text-sm text-[#F7931A] transition-colors hover:border-[#F7931A]/60 hover:bg-[#F7931A]/15"
              >
                Try Again
              </button>
              <Link
                href="/dashboard"
                className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm text-zinc-300 transition-colors hover:border-zinc-700 hover:text-zinc-100"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
