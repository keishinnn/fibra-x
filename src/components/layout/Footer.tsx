import Link from "next/link";

export function Footer() {
    return (
        <footer className="border-t border-zinc-900 bg-black/85">
            <div className="fx-container py-8 sm:py-10">
                <div className="flex flex-col items-center gap-4 text-center">
                    <p className="text-lg font-semibold tracking-tight text-zinc-100">FibraX</p>
                    <p className="max-w-2xl text-sm text-zinc-400">
                        A Fibonacci-based Bitcoin cycle research dashboard for studying phase structure, projection zones, and
                        historical cycle behavior.
                    </p>

                    <div className="flex flex-wrap justify-center gap-2">
                        <Link href="/dashboard" className="fx-btn-secondary">
                            Open Dashboard
                        </Link>
                        <Link href="/methodology" className="fx-btn-secondary">
                            Methodology
                        </Link>
                    </div>

                    <p className="text-xs text-zinc-500">(c) 2026 FibraX. Built by Tenshin.</p>
                </div>
            </div>
        </footer>
    );
}