import Image from "next/image";
import type { Project } from "../types/project";
import { ProjectShowcase } from "./project-showcase";

interface HomePageProps {
    projects: readonly Project[];
}

export function HomePage({ projects }: HomePageProps) {
    return (
        <div className="relative flex h-full min-h-full w-full flex-col items-center gap-4 p-4">
            <section className="flex w-full max-w-3xl flex-col items-center gap-4 sm:flex-row">
                <div className="overflow-hidden rounded-full border border-gray-600">
                    <Image
                        alt="David Portal"
                        height={250}
                        priority
                        sizes="250px"
                        src="/images/me.jpg"
                        width={250}
                    />
                </div>

                <div className="flex-1">
                    <h1 className="text-3xl font-bold">Hi, I’m David Portal</h1>
                    <p className="text-lg font-bold">Code | Music | DIY</p>
                    <p>
                        Currently a full-stack developer at{" "}
                        <a
                            className="underline hover:text-blue-400"
                            href="https://www.linkedin.com/company/news-factory/"
                            rel="noreferrer"
                            target="_blank"
                        >
                            News Factory
                        </a>.
                    </p>
                    <p>
                        And a computer and software engineering student at{" "}
                        <a
                            className="underline hover:text-blue-400"
                            href="https://www.linkedin.com/school/technion"
                            rel="noreferrer"
                            target="_blank"
                        >
                            Technion
                        </a>.
                    </p>
                </div>
            </section>

            <section className="flex w-full max-w-3xl flex-col items-center">
                <p className="text-lg font-bold">You are welcome to explore some of my personal projects.</p>
                <p>They were all built to solve problems I had—and maybe they will help you too.</p>
                <p>Feel free to use them, copy them, or draw inspiration.</p>
                <p>If you have questions or feedback, I would genuinely love to hear it.</p>
            </section>

            <ProjectShowcase projects={projects} />
        </div>
    );
}
