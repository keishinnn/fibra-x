import { featureBullets } from "@/features/home/data/landing-dummy-data";

export function FeaturesSection() {
  return (
    <section className="fx-card p-6 sm:p-8">
      <h2 className="text-xl font-semibold tracking-tight text-zinc-100">Features</h2>
      <ul className="mt-4 grid gap-3 md:grid-cols-2">
        {featureBullets.map((feature) => (
          <li key={feature} className="rounded-xl border border-zinc-900 bg-zinc-950/70 p-4 text-sm leading-relaxed text-zinc-300">
            {feature}
          </li>
        ))}
      </ul>
    </section>
  );
}
