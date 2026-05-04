"use client";

import Image from "next/image";
import { useState } from "react";
import {
  methodologyCycleTimeline,
  methodologyResults,
  methodologySections,
  methodologyVisualSteps,
} from "@/features/methodology/data/methodology-data";

export function MethodologyPage() {
  const [navOpen, setNavOpen] = useState(false);

  const allNavItems = [
    { href: "#visual-walkthrough", label: "Visual Walkthrough", indexLabel: "00" },
    ...methodologySections.map((s) => ({
      href: `#${s.id}`,
      label: s.title,
      indexLabel: s.indexLabel,
    })),
  ];

  return (
    <div className="min-h-full bg-black text-zinc-100">
      <div className="mx-auto w-full max-w-[1200px] px-4 py-6 sm:px-6 sm:py-8">

        {/* Header */}
        <header className="rounded-xl border border-zinc-900 bg-zinc-950/70 p-5 sm:p-6">
          <p className="fx-kicker">Methodology</p>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-100 sm:text-3xl">
            Fibonacci + Cycle Ratio Research Logic
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-400 sm:text-base">
            This page explains how FibraX builds cycle anchors, ratio bands, and projection zones.
            The model is designed for structured research and visualization, not deterministic forecasting.
          </p>
        </header>

        {/* Mobile Nav Toggle */}
        <div className="mt-4 xl:hidden">
          <button
            onClick={() => setNavOpen((v) => !v)}
            className="flex w-full items-center justify-between rounded-xl border border-zinc-900 bg-zinc-950/70 px-4 py-3 text-sm text-zinc-300 transition-colors hover:border-zinc-700 hover:text-zinc-100"
            aria-expanded={navOpen}
            aria-controls="section-index"
          >
            <span className="text-xs uppercase tracking-wide text-zinc-500">Section Index</span>
            <svg
              className={`h-4 w-4 text-zinc-500 transition-transform duration-200 ${navOpen ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {navOpen && (
            <nav
              id="section-index"
              className="mt-1 overflow-hidden rounded-xl border border-zinc-900 bg-zinc-950/70 p-3"
            >
              <div className="space-y-1.5">
                {allNavItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setNavOpen(false)}
                    className="flex items-center justify-between rounded-md border border-zinc-900 bg-black/40 px-2.5 py-2 text-sm text-zinc-300 transition-colors hover:border-zinc-700 hover:text-zinc-100"
                  >
                    <span>{item.label}</span>
                    <span className="text-xs text-zinc-500">{item.indexLabel}</span>
                  </a>
                ))}
              </div>
            </nav>
          )}
        </div>

        {/* Main Grid */}
        <div className="mt-4 grid gap-4 xl:grid-cols-[220px_minmax(0,1fr)] xl:mt-5">

          {/* Desktop Sidebar */}
          <aside className="hidden h-fit rounded-xl border border-zinc-900 bg-zinc-950/70 p-4 xl:block xl:sticky xl:top-20">
            <p className="text-xs uppercase tracking-wide text-zinc-500">Section Index</p>
            <nav className="mt-3 space-y-2">
              {allNavItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between rounded-md border border-zinc-900 bg-black/40 px-2.5 py-2 text-sm text-zinc-300 transition-colors hover:border-zinc-700 hover:text-zinc-100"
                >
                  <span>{item.label}</span>
                  <span className="text-xs text-zinc-500">{item.indexLabel}</span>
                </a>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <div className="space-y-4">

            {/* Visual Walkthrough */}
            <section id="visual-walkthrough" className="rounded-xl border border-zinc-900 bg-zinc-950/70 p-5 sm:p-6">
              <div className="flex items-center gap-2">
                <span className="rounded border border-zinc-800 px-2 py-0.5 text-xs text-[#F7931A]">00</span>
                <h2 className="text-lg font-semibold tracking-tight text-zinc-100 sm:text-xl">
                  Visual Method Walkthrough
                </h2>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400 sm:text-base">
                The following TradingView snapshots document the exact manual process used to derive Fib bear levels and
                cycle bull-ratio scenarios in this project.
              </p>

              <div className="mt-4 space-y-4">
                {methodologyVisualSteps.map((step) => (
                  <article key={step.id} className="overflow-hidden rounded-lg border border-zinc-900 bg-black/45">
                    <div className="relative aspect-[16/9] w-full border-b border-zinc-900 bg-black">
                      <Image
                        src={step.imageSrc}
                        alt={step.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 100vw, 900px"
                        className="object-contain"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-medium text-zinc-100 sm:text-base">{step.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-zinc-400">{step.caption}</p>
                      <ul className="mt-3 space-y-2">
                        {step.highlights.map((highlight) => (
                          <li
                            key={highlight}
                            className="rounded-md border border-zinc-900 bg-zinc-950/70 px-3 py-2 text-xs leading-relaxed text-zinc-300"
                          >
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* Dynamic Sections */}
            {methodologySections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="rounded-xl border border-zinc-900 bg-zinc-950/70 p-5 sm:p-6"
              >
                <div className="flex items-center gap-2">
                  <span className="rounded border border-zinc-800 px-2 py-0.5 text-xs text-[#F7931A]">
                    {section.indexLabel}
                  </span>
                  <h2 className="text-lg font-semibold tracking-tight text-zinc-100 sm:text-xl">
                    {section.title}
                  </h2>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400 sm:text-base">{section.summary}</p>

                <ul className="mt-4 space-y-2">
                  {section.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="rounded-md border border-zinc-900 bg-black/45 px-3 py-2 text-sm leading-relaxed text-zinc-300"
                    >
                      {bullet}
                    </li>
                  ))}
                </ul>

                {/* Historical Results — table on sm+, cards on mobile */}
                {section.id === "historical-results" && (
                  <>
                    <div className="mt-4 hidden overflow-x-auto rounded-md border border-zinc-900 bg-black/45 p-2 sm:block">
                      <table className="w-full min-w-[560px] border-collapse text-left text-sm">
                        <thead>
                          <tr className="border-b border-zinc-900 text-[11px] uppercase tracking-wide text-zinc-500">
                            <th className="px-2 py-2 font-medium">Cycle</th>
                            <th className="px-2 py-2 font-medium">Fib 0.236 Start</th>
                            <th className="px-2 py-2 font-medium">Exact / Assumed Low</th>
                            <th className="px-2 py-2 font-medium">Drawdown from 0.236</th>
                          </tr>
                        </thead>
                        <tbody>
                          {methodologyResults.map((row) => (
                            <tr key={row.cycle} className="border-b border-zinc-900/70">
                              <td className="px-2 py-3 text-zinc-200">{row.cycle}</td>
                              <td className="px-2 py-3 text-zinc-300">{row.projectedBand}</td>
                              <td className="px-2 py-3 text-zinc-300">{row.actualTop}</td>
                              <td className="px-2 py-3 text-zinc-200">{row.deviation}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="mt-4 space-y-2 sm:hidden">
                      {methodologyResults.map((row) => (
                        <div key={row.cycle} className="rounded-md border border-zinc-900 bg-black/45 p-3 text-sm">
                          <p className="font-medium text-zinc-100">{row.cycle}</p>
                          <div className="mt-2 space-y-1.5">
                            <div className="flex justify-between gap-2">
                              <span className="text-[11px] uppercase tracking-wide text-zinc-500">Fib 0.236 Start</span>
                              <span className="text-right text-zinc-300">{row.projectedBand}</span>
                            </div>
                            <div className="flex justify-between gap-2">
                              <span className="text-[11px] uppercase tracking-wide text-zinc-500">Assumed Low</span>
                              <span className="text-right text-zinc-300">{row.actualTop}</span>
                            </div>
                            <div className="flex justify-between gap-2">
                              <span className="text-[11px] uppercase tracking-wide text-zinc-500">Drawdown</span>
                              <span className="text-right font-medium text-zinc-200">{row.deviation}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* Cycle Timeline — table on md+, cards on mobile */}
                {section.id === "bottom-top-selection" && (
                  <>
                    <div className="mt-4 hidden overflow-x-auto rounded-md border border-zinc-900 bg-black/45 p-2 md:block">
                      <table className="w-full min-w-[760px] border-collapse text-left text-sm">
                        <thead>
                          <tr className="border-b border-zinc-900 text-[11px] uppercase tracking-wide text-zinc-500">
                            <th className="px-2 py-2 font-medium">Cycle</th>
                            <th className="px-2 py-2 font-medium">Range</th>
                            <th className="px-2 py-2 font-medium">Bottom</th>
                            <th className="px-2 py-2 font-medium">Halving</th>
                            <th className="px-2 py-2 font-medium">Peak</th>
                            <th className="px-2 py-2 font-medium">Bear Bottom</th>
                            <th className="px-2 py-2 font-medium">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {methodologyCycleTimeline.map((row) => (
                            <tr key={row.id} className="border-b border-zinc-900/70">
                              <td className="px-2 py-3 text-zinc-200">{row.label}</td>
                              <td className="px-2 py-3 text-zinc-300">{row.range}</td>
                              <td className="px-2 py-3 text-zinc-300">{row.bottomDate}</td>
                              <td className="px-2 py-3 text-zinc-300">{row.halvingDate}</td>
                              <td className="px-2 py-3 text-zinc-300">{row.peakDate}</td>
                              <td className="px-2 py-3 text-zinc-300">{row.bearBottomDate}</td>
                              <td className="px-2 py-3">
                                <span
                                  className={`rounded border px-2 py-0.5 text-[11px] uppercase ${row.status === "active"
                                    ? "border-[#F7931A]/40 bg-[#F7931A]/10 text-[#F7931A]"
                                    : "border-lime-500/35 bg-lime-500/10 text-lime-300"
                                    }`}
                                >
                                  {row.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="mt-4 space-y-3 md:hidden">
                      {methodologyCycleTimeline.map((row) => (
                        <div key={row.id} className="rounded-md border border-zinc-900 bg-black/45 p-3 text-sm">
                          <div className="flex items-center justify-between gap-2">
                            <div>
                              <p className="font-medium text-zinc-100">{row.label}</p>
                              <p className="text-xs text-zinc-500">{row.range}</p>
                            </div>
                            <span
                              className={`shrink-0 rounded border px-2 py-0.5 text-[11px] uppercase ${row.status === "active"
                                ? "border-[#F7931A]/40 bg-[#F7931A]/10 text-[#F7931A]"
                                : "border-lime-500/35 bg-lime-500/10 text-lime-300"
                                }`}
                            >
                              {row.status}
                            </span>
                          </div>
                          <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
                            <div>
                              <p className="text-[11px] uppercase tracking-wide text-zinc-500">Bottom</p>
                              <p className="mt-0.5 text-xs text-zinc-300">{row.bottomDate}</p>
                            </div>
                            <div>
                              <p className="text-[11px] uppercase tracking-wide text-zinc-500">Halving</p>
                              <p className="mt-0.5 text-xs text-zinc-300">{row.halvingDate}</p>
                            </div>
                            <div>
                              <p className="text-[11px] uppercase tracking-wide text-zinc-500">Peak</p>
                              <p className="mt-0.5 text-xs text-zinc-300">{row.peakDate}</p>
                            </div>
                            <div>
                              <p className="text-[11px] uppercase tracking-wide text-zinc-500">Bear Bottom</p>
                              <p className="mt-0.5 text-xs text-zinc-300">{row.bearBottomDate}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </section>
            ))}

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
      </div>
    </div>
  );
}
