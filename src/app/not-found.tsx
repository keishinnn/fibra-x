import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-[70vh] bg-black text-zinc-100">
      <div className="mx-auto flex w-full max-w-[960px] flex-col items-center px-4 py-16 text-center sm:px-6 sm:py-24">
        <p className="text-xs uppercase tracking-[0.2em] text-[#F7931A]">404</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-100 sm:text-4xl">
          Page Not Found
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-zinc-400 sm:text-base">
          The page you are looking for does not exist or may have moved. You can continue your research from the
          dashboard or review the methodology guide.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="rounded-lg border border-[#F7931A]/40 bg-[#F7931A]/10 px-4 py-2 text-sm text-[#F7931A] transition-colors hover:border-[#F7931A]/60 hover:bg-[#F7931A]/15"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/methodology"
            className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm text-zinc-300 transition-colors hover:border-zinc-700 hover:text-zinc-100"
          >
            View Methodology
          </Link>
        </div>

        <section className="mt-8 w-full max-w-2xl rounded-xl border border-[#F7931A]/30 bg-[#F7931A]/10 p-4 text-left">
          <p className="text-xs uppercase tracking-wide text-[#F7931A]">Disclaimer</p>
          <p className="mt-2 text-sm leading-relaxed text-zinc-200">
            FibraX is for educational and research purposes only. It is not financial advice, not an investment
            recommendation, and not a guarantee of future market behavior.
          </p>
        </section>
      </div>
    </main>
  );
}
