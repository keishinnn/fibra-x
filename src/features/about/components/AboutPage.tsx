import { developer, projectLimitations, projectPurpose } from "@/features/about/data/about-data";
import { siCoinbase, siNextdotjs, siReactquery, siTailwindcss, siTypescript } from "simple-icons";

type BuiltWithIcon = {
  color: string;
  path: string;
};

const FEATURE_ARCHITECTURE_ICON = {
  color: "#A1A1AA",
  path: "M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83zM2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17",
} satisfies BuiltWithIcon;

const BUILT_WITH_ICON_MAP: Record<string, BuiltWithIcon> = {
  "Next.js App Router": {
    color: "#FFFFFF",
    path: siNextdotjs.path,
  },
  TypeScript: {
    color: `#${siTypescript.hex}`,
    path: siTypescript.path,
  },
  "Tailwind CSS 4": {
    color: `#${siTailwindcss.hex}`,
    path: siTailwindcss.path,
  },
  "Coinbase API": {
    color: `#${siCoinbase.hex}`,
    path: siCoinbase.path,
  },
  "TanStack Query": {
    color: `#${siReactquery.hex}`,
    path: siReactquery.path,
  },
  "Feature-based architecture": FEATURE_ARCHITECTURE_ICON,
};

export function AboutPage() {
  return (
    <div className="min-h-full bg-black text-zinc-100">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-zinc-900">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(247,147,26,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(247,147,26,0.04) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="relative mx-auto w-full max-w-[1200px] px-4 py-16 sm:px-6 sm:py-24">
          <div className="flex items-center gap-2">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#F7931A]">About</p>
          </div>
          <h1 className="mt-6 text-4xl font-semibold leading-[1.1] tracking-tight text-zinc-100 sm:text-5xl lg:text-6xl">
            Bitcoin Cycle
            <span className="block text-zinc-500">Research</span>
            <span className="block text-zinc-100">Visualized.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg">
            FibraX maps Fibonacci ratio zones and cycle phase structure across historical Bitcoin markets - built for
            researchers who want to think in scenarios, not predictions.
          </p>
        </div>
      </section>

      <div className="mx-auto w-full max-w-[1200px] space-y-8 px-4 py-10 sm:px-6 sm:py-14">

        {/* ── Project Purpose ──────────────────────────────────── */}
        <section className="rounded-2xl border border-zinc-900 bg-zinc-950 p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-6">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#F7931A]">Project Purpose</p>
          </div>

          <h2 className="text-xl font-semibold text-zinc-100 sm:text-2xl">{projectPurpose.title}</h2>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-zinc-400 sm:text-base">
            {projectPurpose.summary}
          </p>

          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {projectPurpose.details.map((item, i) => (
              <li key={i} className="flex gap-3 rounded-xl border border-zinc-900 bg-black/50 p-4">
                <span className="mt-0.5 shrink-0 font-mono text-xs text-[#F7931A]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-sm leading-relaxed text-zinc-300">{item}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Limitations ──────────────────────────────────────── */}
        <section className="rounded-2xl border border-zinc-900 bg-zinc-950 p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-6">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-500">Limitations</p>
          </div>

          <h2 className="text-xl font-semibold text-zinc-100 sm:text-2xl">What FibraX Cannot Do</h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            Understanding the boundaries of this tool is as important as understanding its outputs.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {projectLimitations.map((item, i) => (
              <article
                key={i}
                className="rounded-xl border border-zinc-900 bg-black/50 p-5 transition-colors hover:border-zinc-800"
              >
                <div className="flex items-start gap-3">
                  <span className="mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 font-mono text-[10px] text-zinc-500">
                    {i + 1}
                  </span>
                  <h3 className="text-sm font-semibold text-zinc-200">{item.title}</h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ── Developer ────────────────────────────────────────── */}
        <section className="rounded-2xl border border-zinc-900 bg-zinc-950 p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-6">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#F7931A]">The Developer</p>
          </div>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
            {/* Avatar placeholder */}
            <div className="shrink-0">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 text-2xl font-semibold text-zinc-400 select-none">
                {developer.name.charAt(0)}
              </div>
            </div>

            <div className="flex-1">
              <h2 className="text-xl font-semibold text-zinc-100">{developer.name}</h2>
              <p className="mt-1 text-sm text-[#F7931A]">{developer.role}</p>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-400">{developer.bio}</p>

              {/* GitHub link */}

              <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                <a
                  href={developer.github.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-300 transition-colors hover:border-zinc-700 hover:text-zinc-100"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
                    <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844a9.59 9.59 0 012.504.338c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.749 0 .267.18.578.688.48C19.138 20.2 22 16.447 22 12.021 22 6.484 17.522 2 12 2z" />
                  </svg>
                  {developer.github.label}
                </a>

                <a
                  href="https://github.com/keishinnn/fibra-x"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-300 transition-colors hover:border-zinc-700 hover:text-zinc-100"
                >
                  Want to contribute?
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-external-link-icon lucide-external-link"
                  >
                    <path d="M15 3h6v6" />
                    <path d="M10 14 21 3" />
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  </svg>
                </a>
              </div>

              {/* Built with */}
              <div className="mt-6 border-t border-zinc-900 pt-5">
                <p className="text-[11px] uppercase tracking-wide text-zinc-600">Built with</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {developer.builtWith.map((tech) => {
                    const icon = BUILT_WITH_ICON_MAP[tech];

                    return (
                      <span
                        key={tech}
                        className="inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1 text-xs text-zinc-400"
                      >
                        {icon ? (
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill={icon.color}
                            aria-hidden="true"
                            className="shrink-0"
                          >
                            <path d={icon.path} />
                          </svg>
                        ) : null}
                        {tech}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="rounded-xl border border-[#F7931A]/30 bg-[#F7931A]/10 p-4 mt-4">
          <p className="text-xs uppercase tracking-wide text-[#F7931A]">Disclaimer</p>
          <p className="mt-2 text-sm leading-relaxed text-zinc-200">
            FibraX is for educational and research purposes only. It is not financial advice, not an investment
            recommendation, and not a guarantee of future market behavior.
          </p>
        </section>

      </div>
    </div>
  );
}
