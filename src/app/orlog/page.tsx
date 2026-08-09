import type { Metadata } from "next";
import Image from "next/image";
import { FaGithub, FaPlay } from "react-icons/fa";
import { GiBattleAxe, GiDiceSixFacesSix, GiThorHammer } from "react-icons/gi";
import { LuBot, LuGlobe, LuMonitorSmartphone } from "react-icons/lu";

export const metadata: Metadata = {
    title: "Orlog | David Portal Dev",
    description: "A browser adaptation of the Viking strategy dice game.",
};

const features = [
    {
        icon: GiDiceSixFacesSix,
        title: "Tactical dice combat",
        description: "Roll, lock, and combine attack, defense, and theft dice across three throws before each round resolves.",
    },
    {
        icon: GiThorHammer,
        title: "God Favors",
        description: "Collect tokens from golden die faces and spend them on powerful abilities that can turn the battle.",
    },
    {
        icon: GiBattleAxe,
        title: "A complete game engine",
        description: "Combat resolution, turn history, animated outcomes, and a faithful round structure keep every match readable and strategic.",
    },
] as const;

const gameModes = [
    { icon: LuMonitorSmartphone, label: "Local multiplayer" },
    { icon: LuGlobe, label: "Online multiplayer" },
    { icon: LuBot, label: "Play against AI" },
] as const;

export default function OrlogPage() {
    return (
        <div className="flex flex-1 flex-col items-center overflow-hidden px-4 py-10 sm:px-6 sm:py-14">
            <section className="relative flex w-full max-w-5xl flex-col items-center gap-9 lg:flex-row lg:gap-14">
                <div aria-hidden className="absolute -left-32 top-8 -z-10 h-80 w-80 rounded-full bg-amber-500/10 blur-3xl" />
                <div aria-hidden className="absolute -right-32 bottom-0 -z-10 h-80 w-80 rounded-full bg-teal-500/10 blur-3xl" />

                <Image
                    alt="Orlog emblem"
                    className="h-auto w-full max-w-72 shrink-0 rounded-[2rem] shadow-2xl shadow-blue-950/30 sm:max-w-80"
                    height={1254}
                    priority
                    sizes="(max-width: 640px) 288px, 320px"
                    src="/images/orlog.png"
                    width={1254}
                />

                <div className="flex max-w-2xl flex-col items-center text-center lg:items-start lg:text-left">
                    <p className="text-sm font-bold uppercase tracking-[0.24em] text-amber-600 dark:text-amber-400">A Viking strategy dice game</p>
                    <h1 className="mt-3 text-5xl font-black uppercase tracking-[0.08em] sm:text-6xl">Orlog</h1>
                    <p className="mt-5 text-lg leading-relaxed text-secondary-foreground sm:text-xl">
                        A browser adaptation of the Viking dice game. Roll for attack and defense, gather tokens, invoke the gods, and outlast your opponent across local, online, and AI-powered matches.
                    </p>

                    <div className="mt-6 flex flex-wrap justify-center gap-2 lg:justify-start">
                        {gameModes.map(({ icon: Icon, label }) => (
                            <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-sm font-semibold" key={label}>
                                <Icon aria-hidden className="text-teal-600 dark:text-teal-400" />
                                {label}
                            </span>
                        ))}
                    </div>

                    <div className="mt-7 flex flex-wrap justify-center gap-3 lg:justify-start">
                        <a
                            className="inline-flex items-center gap-3 rounded-xl bg-amber-500 px-6 py-3.5 font-bold text-amber-950 shadow-lg shadow-amber-500/20 transition hover:-translate-y-0.5 hover:bg-amber-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
                            href="https://orlog-delta.vercel.app/"
                            rel="noreferrer"
                            target="_blank"
                        >
                            <FaPlay aria-hidden />
                            Play Orlog
                        </a>
                        <a
                            className="inline-flex items-center gap-3 rounded-xl border bg-card px-6 py-3.5 font-bold shadow-sm transition hover:-translate-y-0.5 hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
                            href="https://github.com/stargazingdave/orlog"
                            rel="noreferrer"
                            target="_blank"
                        >
                            <FaGithub aria-hidden className="text-xl" />
                            View source
                        </a>
                    </div>
                </div>
            </section>

            <section aria-labelledby="orlog-features" className="mt-16 grid w-full max-w-5xl gap-4 md:grid-cols-3">
                <h2 className="sr-only" id="orlog-features">Features</h2>
                {features.map(({ icon: Icon, title, description }) => (
                    <article className="rounded-2xl border bg-card p-6 shadow-sm" key={title}>
                        <Icon aria-hidden className="text-3xl text-amber-600 dark:text-amber-400" />
                        <h3 className="mt-4 text-xl font-bold">{title}</h3>
                        <p className="mt-2 leading-relaxed text-muted-foreground">{description}</p>
                    </article>
                ))}
            </section>

            <section className="mt-10 w-full max-w-5xl rounded-2xl border border-teal-600/30 bg-teal-50 p-6 text-center dark:bg-teal-950/30">
                <h2 className="text-xl font-bold">Built for the whole table</h2>
                <p className="mx-auto mt-2 max-w-3xl leading-relaxed text-secondary-foreground">
                    Pass one device between two players, invite an opponent to an online room, or practice against selectable bot difficulties. Day and night themes, animated scenery, and combat effects bring the tabletop atmosphere to the browser.
                </p>
            </section>
        </div>
    );
}
