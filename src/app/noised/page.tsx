import type { Metadata } from "next";
import Image from "next/image";
import { FaGithub, FaPlay } from "react-icons/fa";
import { SiNpm, SiTypescript } from "react-icons/si";

export const metadata: Metadata = {
    title: "NoiseD | David Portal Dev",
    description: "An experiment in generating rain and thunder soundscapes entirely in JavaScript.",
};

const goals = [
    {
        title: "Sound generated in code",
        description: "Synthesize convincing rain and thunder in the browser instead of playing prerecorded loops.",
    },
    {
        title: "A flexible soundscape",
        description: "Expose the layers and parameters behind the sound so each storm can be shaped and saved as JSON.",
    },
    {
        title: "Zero dependencies",
        description: "Package the engine as a lightweight TypeScript library that can run without external audio assets.",
    },
] as const;

export default function NoisedPage() {
    return (
        <div className="flex flex-1 flex-col items-center overflow-hidden px-4 py-10 sm:px-6 sm:py-14">
            <section className="relative flex w-full max-w-5xl flex-col items-center gap-9 lg:flex-row lg:gap-14">
                <div aria-hidden className="absolute -left-32 top-8 -z-10 h-80 w-80 rounded-full bg-sky-500/10 blur-3xl" />
                <div className="relative aspect-square w-full max-w-72 shrink-0 overflow-hidden rounded-[2rem] border bg-slate-950 shadow-2xl shadow-sky-900/20 sm:max-w-80">
                    <Image
                        alt="NoiseD logo"
                        className="object-contain p-8"
                        fill
                        priority
                        sizes="(max-width: 640px) 288px, 320px"
                        src="/images/noised-logo-icon.png"
                    />
                </div>

                <div className="flex max-w-2xl flex-col items-center text-center lg:items-start lg:text-left">
                    <div className="mb-4 flex flex-wrap justify-center gap-2 lg:justify-start">
                        <span className="inline-flex items-center rounded-full bg-violet-100 px-3 py-1 text-sm font-semibold text-violet-800 dark:bg-violet-950 dark:text-violet-200">
                            Experiment
                        </span>
                        <span className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-3 py-1 text-sm font-semibold text-sky-800 dark:bg-sky-950 dark:text-sky-200">
                            <SiTypescript aria-hidden /> TypeScript library
                        </span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tight sm:text-5xl">NoiseD</h1>
                    <p className="mt-4 text-lg leading-relaxed text-secondary-foreground sm:text-xl">
                        The goal was to create realistic rain and thunder entirely in JavaScript: a small, dependency-free library with a live soundscape editor. The experiment produced very good sound, but it also found the practical limits of browser-based synthesis.
                    </p>

                    <div className="mt-7 flex flex-wrap justify-center gap-3 lg:justify-start">
                        <a className="inline-flex items-center gap-3 rounded-xl bg-sky-600 px-6 py-3.5 font-bold text-white shadow-lg shadow-sky-600/20 transition hover:-translate-y-0.5 hover:bg-sky-700" href="/noised/demo">
                            <FaPlay aria-hidden /> Try the sound designer
                        </a>
                        <a className="inline-flex items-center gap-3 rounded-xl border bg-card px-5 py-3.5 font-bold shadow-sm transition hover:-translate-y-0.5 hover:bg-accent" href="https://github.com/stargazingdave/noised" rel="noreferrer" target="_blank">
                            <FaGithub aria-hidden className="text-xl" /> Source
                        </a>
                        <a className="inline-flex items-center gap-3 rounded-xl border bg-card px-5 py-3.5 font-bold shadow-sm transition hover:-translate-y-0.5 hover:bg-accent" href="https://www.npmjs.com/package/noised" rel="noreferrer" target="_blank">
                            <SiNpm aria-hidden className="text-2xl" /> npm
                        </a>
                    </div>
                </div>
            </section>

            <section aria-labelledby="noised-goals" className="mt-16 grid w-full max-w-5xl gap-4 md:grid-cols-3">
                <h2 className="sr-only" id="noised-goals">Project goals</h2>
                {goals.map(({ title, description }) => (
                    <article className="rounded-2xl border bg-card p-6 shadow-sm" key={title}>
                        <h3 className="text-xl font-bold">{title}</h3>
                        <p className="mt-2 leading-relaxed text-muted-foreground">{description}</p>
                    </article>
                ))}
            </section>

            <section className="mt-10 w-full max-w-5xl rounded-2xl border border-violet-500/30 bg-violet-50 p-6 dark:bg-violet-950/25" aria-labelledby="noised-outcome">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-violet-700 dark:text-violet-300">Experiment findings</p>
                <h2 className="mt-2 text-2xl font-bold" id="noised-outcome">Outcome &amp; lessons</h2>
                <div className="mt-4 space-y-4 leading-relaxed text-secondary-foreground">
                    <p>
                        NoiseD can generate very convincing sound, especially with fixed parameters. The performance wall appears as the sound becomes more complex: because every layer is generated in JavaScript, timing becomes less reliable and playback can get flaky.
                    </p>
                    <p>
                        Live editing adds another challenge. Timing issues can accidentally double sound layers, and those duplicates accumulate over time. That problem does not affect a soundscape running with fixed parameters and may be fixable, but the browser is not a natural sound-processing platform. Solving it would take more effort than the result justifies, so NoiseD remains a useful experiment rather than a production-ready audio tool.
                    </p>
                </div>
            </section>
        </div>
    );
}
