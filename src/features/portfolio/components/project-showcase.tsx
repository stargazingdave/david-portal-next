"use client";

import { Card } from "@dpdev/nucleard";
import Image from "next/image";
import type { JSX } from "react";
import { FaBook, FaGithub } from "react-icons/fa";
import {
    SiAndroid,
    SiCss3,
    SiHtml5,
    SiJavascript,
    SiKotlin,
    SiNextdotjs,
    SiNpm,
    SiPython,
    SiReact,
    SiSupabase,
    SiTailwindcss,
    SiTypescript,
} from "react-icons/si";
import type { Project, ProjectTechnology } from "../types/project";

interface ProjectShowcaseProps {
    projects: readonly Project[];
}

interface ProjectBadge {
    label: string;
    color: string;
}

const projectTypes: Record<Project["type"], ProjectBadge> = {
    website: { label: "Website", color: "#d92aff" },
    library: { label: "Library", color: "#00e5ff" },
    game: { label: "Game", color: "#6a9400" },
    "android-app": { label: "Android App", color: "#d46f00" },
};

const projectStatuses: Record<Project["status"], ProjectBadge> = {
    dev: { label: "In Development", color: "#a87900" },
    prod: { label: "Production", color: "#098638" },
    discontinued: { label: "Discontinued", color: "#707070" },
};

const technologyIcons: Record<ProjectTechnology, JSX.Element> = {
    react: <SiReact aria-label="React" />,
    nextjs: <SiNextdotjs aria-label="Next.js" />,
    tailwind: <SiTailwindcss aria-label="Tailwind CSS" />,
    typescript: <SiTypescript aria-label="TypeScript" />,
    javascript: <SiJavascript aria-label="JavaScript" />,
    html: <SiHtml5 aria-label="HTML" />,
    css: <SiCss3 aria-label="CSS" />,
    python: <SiPython aria-label="Python" />,
    java: <SiJavascript aria-label="Java" />,
    kotlin: <SiKotlin aria-label="Kotlin" />,
    android: <SiAndroid aria-label="Android" />,
    supabase: <SiSupabase aria-label="Supabase" />,
};

function ProjectImage({ project }: Readonly<{ project: Project }>) {
    const sharedProps = {
        fill: true,
        sizes: "128px",
    } as const;

    if (project.image.light === project.image.dark) {
        return <Image {...sharedProps} alt={`${project.title} logo`} className="object-contain" src={project.image.light} />;
    }

    return (
        <>
            <Image {...sharedProps} alt={`${project.title} logo`} className="object-contain dark:hidden" src={project.image.light} />
            <Image {...sharedProps} alt="" className="hidden object-contain dark:block" src={project.image.dark} />
        </>
    );
}

export function ProjectShowcase({ projects }: ProjectShowcaseProps) {
    return (
        <section aria-label="Projects" className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
                <Card
                    key={project.title}
                    className="flex flex-col items-center overflow-hidden rounded-xl border border-zinc-700 shadow-md"
                >
                    <div className="flex w-full justify-center pt-2">
                        <a aria-label={`Open ${project.title}`} href={project.links.website}>
                            <div className="relative h-32 w-32 flex-shrink-0">
                                <ProjectImage project={project} />
                            </div>
                        </a>
                    </div>

                    <div className="flex w-full flex-col justify-between gap-2 p-4">
                        <h2 className="mt-1 text-2xl font-bold">{project.title}</h2>

                        {project.tech && (
                            <div className="flex w-full flex-wrap gap-2 text-xl">
                                {project.tech.map((technology) => (
                                    <span key={technology} className="transition hover:scale-110" title={technology}>
                                        {technologyIcons[technology]}
                                    </span>
                                ))}
                            </div>
                        )}

                        <div>
                            <p className="space-x-2 text-sm">
                                <span className="text-xs font-bold uppercase tracking-wide" style={{ color: projectTypes[project.type].color }}>
                                    {projectTypes[project.type].label}
                                </span>
                                <span aria-hidden className="text-xs font-bold uppercase tracking-wide">•</span>
                                <span className="text-xs font-bold uppercase tracking-wide" style={{ color: projectStatuses[project.status].color }}>
                                    {projectStatuses[project.status].label}
                                </span>
                            </p>
                            <p className="mt-2 text-sm leading-relaxed">{project.description}</p>
                        </div>

                        <div className="mt-4 flex space-x-4">
                            {project.links.docs && <a aria-label={`${project.title} documentation`} href={project.links.docs}><FaBook className="text-xl hover:text-yellow-400" /></a>}
                            {project.links.github && <a aria-label={`${project.title} on GitHub`} href={project.links.github} rel="noreferrer" target="_blank"><FaGithub className="text-xl hover:text-gray-400" /></a>}
                            {project.links.npm && <a aria-label={`${project.title} on npm`} href={project.links.npm} rel="noreferrer" target="_blank"><SiNpm className="text-xl hover:text-orange-400" /></a>}
                        </div>
                    </div>
                </Card>
            ))}
        </section>
    );
}
