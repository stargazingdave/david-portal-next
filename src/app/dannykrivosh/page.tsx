import type { Metadata } from "next";
import Image from "next/image";
import { FaExternalLinkAlt, FaGithub, FaMusic, FaRegCompass, FaStar } from "react-icons/fa";

export const metadata: Metadata = {
    title: "dannykrivosh.com | David Portal Dev",
    description: "A personalized artist website designed around Danny Krivosh's music and character.",
};

const features = [
    {
        icon: FaMusic,
        title: "Music at the center",
        description: "Give Danny's work a home that feels like an artist's world instead of a generic portfolio template.",
    },
    {
        icon: FaStar,
        title: "Full of character",
        description: "Use custom visual details, playful interactions, and easter eggs to make exploring the site memorable.",
    },
    {
        icon: FaRegCompass,
        title: "Designed for discovery",
        description: "Bring the music, story, and personality together in an experience visitors can wander through naturally.",
    },
] as const;

export default function DannyKrivoshPage() {
    return (
        <div className="flex flex-1 flex-col items-center overflow-hidden px-4 py-10 sm:px-6 sm:py-14">
            <section className="relative flex w-full max-w-5xl flex-col items-center gap-9 lg:flex-row lg:gap-14">
                <div aria-hidden className="absolute -left-32 top-8 -z-10 h-80 w-80 rounded-full bg-fuchsia-500/10 blur-3xl" />
                <Image
                    alt="dannykrivosh.com icon"
                    className="h-auto w-full max-w-72 shrink-0 rounded-[2rem] shadow-2xl shadow-fuchsia-800/20 sm:max-w-80"
                    height={400}
                    priority
                    sizes="(max-width: 640px) 288px, 320px"
                    src="/images/danny-icon.png"
                    width={400}
                />

                <div className="flex max-w-2xl flex-col items-center text-center lg:items-start lg:text-left">
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-fuchsia-700 dark:text-fuchsia-300">Personal artist website</p>
                    <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">dannykrivosh.com</h1>
                    <p className="mt-4 text-lg leading-relaxed text-secondary-foreground sm:text-xl">
                        I wanted to build Danny Krivosh a home for his music that felt unmistakably his. The result is a personalized website shaped by his character, with an expressive visual language, playful details, and easter eggs tucked throughout the experience.
                    </p>

                    <div className="mt-7 flex flex-wrap justify-center gap-3 lg:justify-start">
                        <a className="inline-flex items-center gap-3 rounded-xl bg-fuchsia-600 px-6 py-3.5 font-bold text-white shadow-lg shadow-fuchsia-600/20 transition hover:-translate-y-0.5 hover:bg-fuchsia-700" href="https://dannykrivosh.com" rel="noreferrer" target="_blank">
                            <FaExternalLinkAlt aria-hidden /> Visit the website
                        </a>
                        <a className="inline-flex items-center gap-3 rounded-xl border bg-card px-6 py-3.5 font-bold shadow-sm transition hover:-translate-y-0.5 hover:bg-accent" href="https://github.com/stargazingdave/danny-krivosh-next-app" rel="noreferrer" target="_blank">
                            <FaGithub aria-hidden className="text-xl" /> View source
                        </a>
                    </div>
                </div>
            </section>

            <section aria-labelledby="danny-features" className="mt-16 grid w-full max-w-5xl gap-4 md:grid-cols-3">
                <h2 className="sr-only" id="danny-features">Project qualities</h2>
                {features.map(({ icon: Icon, title, description }) => (
                    <article className="rounded-2xl border bg-card p-6 shadow-sm" key={title}>
                        <Icon aria-hidden className="text-2xl text-fuchsia-600 dark:text-fuchsia-400" />
                        <h3 className="mt-4 text-xl font-bold">{title}</h3>
                        <p className="mt-2 leading-relaxed text-muted-foreground">{description}</p>
                    </article>
                ))}
            </section>

            <section className="mt-10 w-full max-w-5xl rounded-2xl border border-fuchsia-500/30 bg-fuchsia-50 p-6 text-center dark:bg-fuchsia-950/25">
                <h2 className="text-xl font-bold">Built around a person, not a template</h2>
                <p className="mx-auto mt-2 max-w-3xl leading-relaxed text-secondary-foreground">
                    The project treats personality as part of the interface. Its unusual details are intentional: they turn a straightforward artist site into a small world that rewards curiosity and supports the music without flattening it into a conventional brand page.
                </p>
            </section>
        </div>
    );
}
