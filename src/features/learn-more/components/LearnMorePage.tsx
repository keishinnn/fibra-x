"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { cycleAnchors } from "@/features/cycle-model/data/cycle-anchors";
import {
  doChecklist,
  dontChecklist,
  fibLevelExplainers,
  fibonacciLimitations,
  halvingMilestoneSeeds,
  halvingPrimerPoints,
  learnLinkCards,
  learnNavItems,
  researchWorkflowSteps,
  uptrendSteps,
  whyFibonacciReasons,
  downtrendSteps,
} from "@/features/learn-more/data/learn-data";

import {
  buildHalvingMilestones,
  estimateDailyIssuance,
  formatBlockHeight,
  formatCalendarDate,
  formatFibPercent,
  formatRewardBtc,
} from "@/features/learn-more/lib/learn-utils";

const defaultHalvingId = halvingMilestoneSeeds.find((item) => item.status === "active")?.id ?? halvingMilestoneSeeds[0].id;

function getStatusTone(status: "completed" | "active" | "upcoming"): string {
  if (status === "completed") {
    return "border-lime-500/35 bg-lime-500/10 text-lime-300";
  }
  if (status === "active") {
    return "border-[#F7931A]/35 bg-[#F7931A]/10 text-[#F7931A]";
  }
  return "border-sky-500/35 bg-sky-500/10 text-sky-300";
}

export function LearnMorePage() {
  const [navOpen, setNavOpen] = useState(false);
  const [selectedHalvingId, setSelectedHalvingId] = useState(defaultHalvingId);

  const halvingMilestones = useMemo(
    () => buildHalvingMilestones(cycleAnchors, halvingMilestoneSeeds),
    [],
  );

  const selectedMilestone =
    halvingMilestones.find((milestone) => milestone.id === selectedHalvingId) ?? halvingMilestones[0];

  return (
    <div className="min-h-full bg-black text-zinc-100">
      <div className="mx-auto w-full max-w-[1200px] px-3 py-4 sm:px-6 sm:py-8">
        <header className="rounded-xl border border-zinc-900 bg-zinc-950/70 p-4 sm:p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-[#F7931A]">Learn More</p>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-100 sm:text-3xl">
            Fibonacci Retracement + Bitcoin Halving
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-400 sm:text-base">
            Beginner-friendly guidance for understanding Fibonacci retracement, why traders watch these zones, and how
            halving context can support cycle-based market research.
          </p>
        </header>

        <div className="mt-4 lg:hidden">
          <button
            type="button"
            onClick={() => setNavOpen((value) => !value)}
            className="flex w-full items-center justify-between rounded-xl border border-zinc-900 bg-zinc-950/70 px-4 py-3 text-sm text-zinc-300 transition-colors hover:border-zinc-700 hover:text-zinc-100"
            aria-expanded={navOpen}
            aria-controls="learn-section-index"
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

          {navOpen ? (
            <nav
              id="learn-section-index"
              className="mt-1 overflow-hidden rounded-xl border border-zinc-900 bg-zinc-950/70 p-3"
            >
              <div className="space-y-1.5">
                {learnNavItems.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={() => setNavOpen(false)}
                    className="flex items-start justify-between gap-2 rounded-md border border-zinc-900 bg-black/40 px-2.5 py-2 text-sm text-zinc-300 transition-colors hover:border-zinc-700 hover:text-zinc-100"
                  >
                    <span className="min-w-0 pr-2 leading-snug">{item.title}</span>
                    <span className="shrink-0 text-xs text-zinc-500">{item.indexLabel}</span>
                  </a>
                ))}
              </div>
            </nav>
          ) : null}
        </div>

        <div className="mt-4 grid gap-4 lg:mt-5 lg:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="hidden h-fit rounded-xl border border-zinc-900 bg-zinc-950/70 p-4 lg:sticky lg:top-20 lg:block">
            <p className="text-xs uppercase tracking-wide text-zinc-500">Section Index</p>
            <nav className="mt-3 space-y-2">
              {learnNavItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="flex items-start justify-between gap-2 rounded-md border border-zinc-900 bg-black/40 px-2.5 py-2 text-sm text-zinc-300 transition-colors hover:border-zinc-700 hover:text-zinc-100"
                >
                  <span className="min-w-0 pr-2 leading-snug">{item.title}</span>
                  <span className="shrink-0 text-xs text-zinc-500">{item.indexLabel}</span>
                </a>
              ))}
            </nav>
          </aside>

          <div className="space-y-4">
            <section id="what-is-fib" className="rounded-xl border border-zinc-900 bg-zinc-950/70 p-4 sm:p-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded border border-zinc-800 px-2 py-0.5 text-xs text-[#F7931A]">01</span>
                <h2 className="text-lg font-semibold tracking-tight text-zinc-100 sm:text-xl">
                  What Is Fibonacci Retracement?
                </h2>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400 sm:text-base">
                Fibonacci retracement is a charting framework that maps potential support and resistance zones between
                a major swing low and swing high. It does not tell the future. It helps you organize possible reaction
                areas so your research stays structured.
              </p>

              <div className="mt-4 grid items-start gap-3 sm:grid-cols-2">
                {fibLevelExplainers.map((level) => (
                  <details key={level.id} className="self-start rounded-lg border border-zinc-900 bg-black/45 p-3">
                    <summary className="cursor-pointer list-none">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-sm font-medium text-zinc-100">{formatFibPercent(level.ratio)}</p>
                          <p className="mt-1 text-xs uppercase tracking-wide text-zinc-500">{level.label}</p>
                        </div>
                        <span className="self-start rounded border border-zinc-800 px-2 py-0.5 text-[11px] text-zinc-400">
                          Quick explainer
                        </span>
                      </div>
                      <p className="mt-2 text-xs leading-relaxed text-zinc-400">{level.summary}</p>
                    </summary>
                    <p className="mt-3 border-t border-zinc-900 pt-3 text-xs leading-relaxed text-zinc-300">
                      {level.explanation}
                    </p>
                  </details>
                ))}
              </div>
            </section>

            <section id="why-fibonacci" className="rounded-xl border border-zinc-900 bg-zinc-950/70 p-4 sm:p-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded border border-zinc-800 px-2 py-0.5 text-xs text-[#F7931A]">02</span>
                <h2 className="text-lg font-semibold tracking-tight text-zinc-100 sm:text-xl">Why Fibonacci?</h2>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400 sm:text-base">
                The value is not magic math. The value is shared behavior, repeatable structure, and clearer risk
                planning when many participants are tracking similar zones.
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {whyFibonacciReasons.map((reason) => (
                  <article key={reason.id} className="rounded-md border border-zinc-900 bg-black/45 p-3">
                    <p className="text-sm font-medium text-zinc-100">{reason.title}</p>
                    <p className="mt-2 text-xs leading-relaxed text-zinc-400">{reason.body}</p>
                  </article>
                ))}
              </div>

              <div className="mt-4 rounded-md border border-zinc-900 bg-black/45 p-3">
                <p className="text-xs uppercase tracking-wide text-zinc-500">Limitations</p>
                <ul className="mt-2 space-y-2">
                  {fibonacciLimitations.map((item) => (
                    <li key={item} className="rounded-md border border-zinc-900 bg-zinc-950/70 px-3 py-2 text-xs text-zinc-300">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section id="how-to-use" className="rounded-xl border border-zinc-900 bg-zinc-950/70 p-4 sm:p-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded border border-zinc-800 px-2 py-0.5 text-xs text-[#F7931A]">03</span>
                <h2 className="text-lg font-semibold tracking-tight text-zinc-100 sm:text-xl">How To Use It</h2>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400 sm:text-base">
                Use a simple process: define trend direction, place anchors cleanly, and wait for confirmation around
                key zones. Fib retracement is most useful when it supports a larger market thesis.
              </p>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <article className="rounded-md border border-zinc-900 bg-black/45 p-4">
                  <p className="text-xs uppercase tracking-wide text-lime-300">Uptrend Workflow</p>
                  <ol className="mt-3 space-y-2">
                    {uptrendSteps.map((step, index) => (
                      <li key={step.id} className="rounded-md border border-zinc-900 bg-zinc-950/70 p-3">
                        <p className="text-sm font-medium text-zinc-100">
                          {index + 1}. {step.title}
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-zinc-400">{step.detail}</p>
                      </li>
                    ))}
                  </ol>
                </article>

                <article className="rounded-md border border-zinc-900 bg-black/45 p-4">
                  <p className="text-xs uppercase tracking-wide text-rose-300">Downtrend Workflow</p>
                  <ol className="mt-3 space-y-2">
                    {downtrendSteps.map((step, index) => (
                      <li key={step.id} className="rounded-md border border-zinc-900 bg-zinc-950/70 p-3">
                        <p className="text-sm font-medium text-zinc-100">
                          {index + 1}. {step.title}
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-zinc-400">{step.detail}</p>
                      </li>
                    ))}
                  </ol>
                </article>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <article className="rounded-md border border-zinc-900 bg-black/45 p-3">
                  <p className="text-xs uppercase tracking-wide text-zinc-500">Do</p>
                  <ul className="mt-2 space-y-2">
                    {doChecklist.map((item) => (
                      <li key={item.id} className="rounded-md border border-zinc-900 bg-zinc-950/70 px-3 py-2 text-xs text-zinc-300">
                        {item.text}
                      </li>
                    ))}
                  </ul>
                </article>
                <article className="rounded-md border border-zinc-900 bg-black/45 p-3">
                  <p className="text-xs uppercase tracking-wide text-zinc-500">Do Not</p>
                  <ul className="mt-2 space-y-2">
                    {dontChecklist.map((item) => (
                      <li key={item.id} className="rounded-md border border-zinc-900 bg-zinc-950/70 px-3 py-2 text-xs text-zinc-300">
                        {item.text}
                      </li>
                    ))}
                  </ul>
                </article>
              </div>
            </section>

            <section id="halving-primer" className="rounded-xl border border-zinc-900 bg-zinc-950/70 p-4 sm:p-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded border border-zinc-800 px-2 py-0.5 text-xs text-[#F7931A]">04</span>
                <h2 className="text-lg font-semibold tracking-tight text-zinc-100 sm:text-xl">Bitcoin Halving Primer</h2>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400 sm:text-base">
                Halving is Bitcoin&apos;s supply schedule mechanism. Every 210,000 blocks, new BTC issued per block is cut
                in half. This is why future halving dates are estimates by calendar but exact by block height.
              </p>

              <ul className="mt-3 space-y-2">
                {halvingPrimerPoints.map((item) => (
                  <li key={item} className="rounded-md border border-zinc-900 bg-black/45 px-3 py-2 text-xs text-zinc-300">
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-4">
                <div className="grid gap-2 sm:grid-cols-2">
                  {halvingMilestones.map((milestone) => (
                    <button
                      key={milestone.id}
                      type="button"
                      onClick={() => setSelectedHalvingId(milestone.id)}
                      className={`rounded-md border px-3 py-2 text-left text-xs transition-colors ${milestone.id === selectedHalvingId
                        ? "border-[#F7931A]/45 bg-[#F7931A]/14 text-zinc-100"
                        : "border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                        } w-full`}
                    >
                      <p className="font-medium">{milestone.label}</p>
                      <p className="mt-0.5">{formatCalendarDate(milestone.date)}</p>
                    </button>
                  ))}
                </div>
              </div>

              <article className="mt-4 rounded-md border border-zinc-900 bg-black/45 p-3 sm:p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-medium text-zinc-100">{selectedMilestone.label}</p>
                  <span className={`rounded border px-2 py-0.5 text-[11px] uppercase ${getStatusTone(selectedMilestone.status)}`}>
                    {selectedMilestone.status}
                  </span>
                </div>

                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <div className="rounded-md border border-zinc-900 bg-zinc-950/70 p-3">
                    <p className="text-[11px] uppercase tracking-wide text-zinc-500">Halving Date</p>
                    <p className="mt-1 text-sm text-zinc-200">
                      {formatCalendarDate(selectedMilestone.date)}
                      {selectedMilestone.isEstimatedDate ? " (estimated)" : ""}
                    </p>
                  </div>
                  <div className="rounded-md border border-zinc-900 bg-zinc-950/70 p-3">
                    <p className="text-[11px] uppercase tracking-wide text-zinc-500">Block Height Trigger</p>
                    <p className="mt-1 text-sm text-zinc-200">{formatBlockHeight(selectedMilestone.blockHeight)}</p>
                  </div>
                  <div className="rounded-md border border-zinc-900 bg-zinc-950/70 p-3">
                    <p className="text-[11px] uppercase tracking-wide text-zinc-500">Reward Shift</p>
                    <p className="mt-1 text-sm text-zinc-200">
                      {formatRewardBtc(selectedMilestone.rewardBefore)} to {formatRewardBtc(selectedMilestone.rewardAfter)}
                    </p>
                  </div>
                  <div className="rounded-md border border-zinc-900 bg-zinc-950/70 p-3">
                    <p className="text-[11px] uppercase tracking-wide text-zinc-500">Approx. New Issuance</p>
                    <p className="mt-1 text-sm text-zinc-200">{estimateDailyIssuance(selectedMilestone.rewardAfter)}</p>
                  </div>
                </div>

                <p className="mt-3 break-words text-xs leading-relaxed text-zinc-400">
                  Cycle reference: {selectedMilestone.cycleLabel}. {selectedMilestone.note}
                </p>
              </article>
            </section>

            <section id="fibrax-workflow" className="rounded-xl border border-zinc-900 bg-zinc-950/70 p-4 sm:p-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded border border-zinc-800 px-2 py-0.5 text-xs text-[#F7931A]">05</span>
                <h2 className="text-lg font-semibold tracking-tight text-zinc-100 sm:text-xl">
                  Combining Fib + Halving in FibraX
                </h2>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400 sm:text-base">
                FibraX combines retracement structure with cycle context to build scenario zones and confidence framing.
                The goal is disciplined research, not deterministic prediction.
              </p>

              <div className="mt-4 grid gap-3">
                {researchWorkflowSteps.map((step, index) => (
                  <article key={step.id} className="rounded-md border border-zinc-900 bg-black/45 p-3">
                    <p className="text-sm font-medium text-zinc-100">
                      {index + 1}. {step.title}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-zinc-400">{step.detail}</p>
                  </article>
                ))}
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {learnLinkCards.map((card) => (
                  <Link
                    key={card.id}
                    href={card.href}
                    className="rounded-md border border-zinc-900 bg-black/45 p-4 transition-colors hover:border-zinc-700"
                  >
                    <p className="text-sm font-medium text-zinc-100">{card.title}</p>
                    <p className="mt-2 text-xs leading-relaxed text-zinc-400">{card.body}</p>
                  </Link>
                ))}
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
      </div>
    </div>
  );
}
