import type { Metadata } from "next";
import Image from "next/image";
import { FaDownload, FaGithub, FaMicrophone, FaMobileAlt, FaSlidersH } from "react-icons/fa";
import { SiAndroid, SiKotlin } from "react-icons/si";

export const metadata: Metadata = {
    title: "TunerD | David Portal Dev",
    description: "An Android guitar-tuner experiment focused on pitch detection and a clear tuning display.",
};

const goals = [
    {
        icon: FaMicrophone,
        title: "Real-time pitch detection",
        description: "Listen through the microphone and estimate the played note and its distance from the target pitch.",
    },
    {
        icon: FaSlidersH,
        title: "A readable tuner display",
        description: "Turn noisy pitch measurements into a stable, responsive needle that is easy to follow while tuning.",
    },
    {
        icon: FaMobileAlt,
        title: "Simple and offline",
        description: "Keep the Android app focused on guitar tuning, with no accounts, ads, tracking, or network dependency.",
    },
] as const;

export default function TunerdPage() {
    return (
        <div className="flex flex-1 flex-col items-center overflow-hidden px-4 py-10 sm:px-6 sm:py-14">
            <section className="relative flex w-full max-w-5xl flex-col items-center gap-9 lg:flex-row lg:gap-14">
                <div aria-hidden className="absolute -left-32 top-8 -z-10 h-80 w-80 rounded-full bg-green-500/10 blur-3xl" />
                <div className="flex shrink-0 items-center gap-4">
                    <Image
                        alt="TunerD logo"
                        className="h-auto w-36 rounded-[2rem] shadow-2xl shadow-green-700/15 sm:w-44"
                        height={512}
                        priority
                        sizes="(max-width: 640px) 144px, 176px"
                        src="/images/tunerd-logo.png"
                        width={512}
                    />
                    <Image
                        alt="TunerD pitch display"
                        className="h-72 w-auto rounded-[1.5rem] border shadow-2xl sm:h-80"
                        height={2171}
                        priority
                        sizes="160px"
                        src="/images/tunerd-screenshot.jpg"
                        width={1080}
                    />
                </div>

                <div className="flex max-w-2xl flex-col items-center text-center lg:items-start lg:text-left">
                    <div className="mb-4 flex flex-wrap justify-center gap-2 lg:justify-start">
                        <span className="inline-flex items-center rounded-full bg-violet-100 px-3 py-1 text-sm font-semibold text-violet-800 dark:bg-violet-950 dark:text-violet-200">
                            Experiment
                        </span>
                        <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800 dark:bg-green-950 dark:text-green-200">
                            <SiAndroid aria-hidden /> Android app
                        </span>
                        <span className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1 text-sm font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                            <SiKotlin aria-hidden /> Kotlin
                        </span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tight sm:text-5xl">TunerD</h1>
                    <p className="mt-4 text-lg leading-relaxed text-secondary-foreground sm:text-xl">
                        I wanted to create a simple guitar tuner for Android—no ads, no accounts, and no nonsense. It became a practical exploration of pitch-detection algorithms and how to turn noisy microphone data into a useful display.
                    </p>

                    <div className="mt-7 flex flex-wrap justify-center gap-3 lg:justify-start">
                        <a className="inline-flex items-center gap-3 rounded-xl bg-green-600 px-6 py-3.5 font-bold text-white shadow-lg shadow-green-600/20 transition hover:-translate-y-0.5 hover:bg-green-700" download href="/downloads/tunerd-v1.0-release.apk">
                            <FaDownload aria-hidden /> Download APK
                        </a>
                        <a className="inline-flex items-center gap-3 rounded-xl border bg-card px-6 py-3.5 font-bold shadow-sm transition hover:-translate-y-0.5 hover:bg-accent" href="https://github.com/stargazingdave/tunerd" rel="noreferrer" target="_blank">
                            <FaGithub aria-hidden className="text-xl" /> View source
                        </a>
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">Version 1.0 · Uses microphone access · Works offline</p>
                </div>
            </section>

            <section aria-labelledby="tunerd-goals" className="mt-16 grid w-full max-w-5xl gap-4 md:grid-cols-3">
                <h2 className="sr-only" id="tunerd-goals">Project goals</h2>
                {goals.map(({ icon: Icon, title, description }) => (
                    <article className="rounded-2xl border bg-card p-6 shadow-sm" key={title}>
                        <Icon aria-hidden className="text-2xl text-green-600 dark:text-green-400" />
                        <h3 className="mt-4 text-xl font-bold">{title}</h3>
                        <p className="mt-2 leading-relaxed text-muted-foreground">{description}</p>
                    </article>
                ))}
            </section>

            <section className="mt-10 w-full max-w-5xl rounded-2xl border border-violet-500/30 bg-violet-50 p-6 dark:bg-violet-950/25" aria-labelledby="tunerd-outcome">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-violet-700 dark:text-violet-300">Experiment findings</p>
                <h2 className="mt-2 text-2xl font-bold" id="tunerd-outcome">Outcome &amp; lessons</h2>
                <div className="mt-4 space-y-4 leading-relaxed text-secondary-foreground">
                    <p>
                        I tried many pitch-detection algorithms and several ways of filtering and presenting their output. With display optimizations, TunerD reached pretty good results and is usable for basic tuning.
                    </p>
                    <p>
                        It still is not as reliable as commercial tuning apps. Real-world microphone input, harmonics, background noise, and the tradeoff between a responsive display and a stable one make consistent detection difficult. The project is best understood as a successful technical experiment, not a polished replacement for a dedicated tuner.
                    </p>
                </div>
            </section>
        </div>
    );
}
