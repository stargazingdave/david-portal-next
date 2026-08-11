import Image from "next/image";
import { FaBriefcase, FaGraduationCap } from "react-icons/fa";
import type { Project } from "../types/project";
import { ProjectShowcase } from "./project-showcase";

interface HomePageProps {
  projects: readonly Project[];
}

export function HomePage({ projects }: HomePageProps) {
  return (
    <div className="relative flex h-full min-h-full w-full flex-col items-center gap-8 px-4 py-6 sm:py-10">
      <section className="relative w-full max-w-5xl overflow-hidden rounded-[2rem] border bg-card/70 shadow-xl shadow-pink-500/5 backdrop-blur-sm">
        <div
          aria-hidden
          className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-pink-500/15 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute -bottom-32 -right-24 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:42px_42px] opacity-[0.12]"
        />

        <div className="relative flex flex-col items-center gap-9 p-6 sm:p-8 lg:flex-row lg:gap-12 lg:p-10">
          <div className="relative shrink-0">
            <div
              aria-hidden
              className="absolute inset-3 rounded-[2.5rem] bg-gradient-to-br from-pink-500 to-cyan-400 opacity-30 blur-2xl"
            />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/20 bg-muted p-1 shadow-2xl">
              <Image
                alt="David Portal"
                className="h-auto w-56 rounded-[1.7rem] object-cover sm:w-64"
                height={600}
                priority
                sizes="(max-width: 640px) 224px, 256px"
                src="/images/me.jpg"
                width={600}
              />
            </div>
          </div>

          <div className="max-w-2xl text-center lg:text-left">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-pink-600 dark:text-pink-400">
              Developer · maker · student
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              Hi, I&apos;m{" "}
              <span className="bg-gradient-to-r from-pink-500 to-cyan-500 bg-clip-text text-transparent">
                David Portal.
              </span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-secondary-foreground lg:mx-0">
              I build software around problems I want to solve, ideas I want to
              explore, and tools I wish already existed.
            </p>

            <div className="mt-6 grid gap-3 text-left sm:grid-cols-2">
              <a
                className="group flex items-start gap-3 rounded-2xl border bg-background/70 p-4 transition hover:-translate-y-0.5 hover:border-pink-500/50 hover:shadow-md"
                href="https://www.linkedin.com/company/news-factory/"
                rel="noreferrer"
                target="_blank"
              >
                <FaBriefcase
                  aria-hidden
                  className="mt-0.5 shrink-0 text-lg text-pink-500"
                />
                <span>
                  <span className="block text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    Currently
                  </span>
                  <span className="font-semibold group-hover:text-pink-500">
                    Full-stack developer at News Factory
                  </span>
                </span>
              </a>
              <a
                className="group flex items-start gap-3 rounded-2xl border bg-background/70 p-4 transition hover:-translate-y-0.5 hover:border-cyan-500/50 hover:shadow-md"
                href="https://www.linkedin.com/school/technion"
                rel="noreferrer"
                target="_blank"
              >
                <FaGraduationCap
                  aria-hidden
                  className="mt-0.5 shrink-0 text-xl text-cyan-500"
                />
                <span>
                  <span className="block text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    Studying
                  </span>
                  <span className="font-semibold group-hover:text-cyan-500">
                    Computer &amp; software engineering at Technion
                  </span>
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="flex w-full max-w-3xl flex-col items-center text-center">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground">
          Selected work
        </p>
        <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
          Projects built from real problems and curiosity.
        </h2>
        <p className="mt-3 max-w-2xl leading-relaxed text-secondary-foreground">
          Explore them, use them, copy them, or draw inspiration. If you have
          questions or feedback, I would genuinely love to hear it.
        </p>
      </section>

      <ProjectShowcase projects={projects} />
    </div>
  );
}
