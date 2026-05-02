import Link from "next/link";

export function CtaSection() {
  return (
    <section className="fx-card p-6 sm:p-8">
      <h2 className="text-xl font-semibold tracking-tight text-zinc-100">Start Exploring FibraX</h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-400">
        Open the dashboard to inspect phase overlays, projection zones, and ratio model signals. Review the methodology
        page for assumptions and model limitations.
      </p>

      <div className="mt-5 flex flex-wrap gap-3">
        <Link href="/dashboard" className="fx-btn-primary">
          Open Dashboard
        </Link>
        <Link href="/methodology" className="fx-btn-secondary">
          View Methodology
        </Link>
      </div>
    </section>
  );
}
