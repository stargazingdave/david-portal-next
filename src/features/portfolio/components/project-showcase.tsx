"use client";

import { Card } from "@dpdev/nucleard";
import Image from "next/image";
import type { JSX } from "react";
import { FaBook, FaDownload, FaGithub, FaPlay } from "react-icons/fa";
import type { IconType } from "react-icons";
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
    SiRust,
    SiSupabase,
    SiTailwindcss,
    SiTauri,
    SiTypescript,
} from "react-icons/si";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
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
    "desktop-app": { label: "Desktop App", color: "#2563eb" },
};

const projectStatuses: Record<Project["status"], ProjectBadge> = {
    dev: { label: "In Development", color: "#a87900" },
    prod: { label: "Production", color: "#098638" },
    experiment: { label: "Experiment", color: "#7c3aed" },
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
    rust: <SiRust aria-label="Rust" />,
    tauri: <SiTauri aria-label="Tauri" />,
    supabase: <SiSupabase aria-label="Supabase" />,
};

function ProjectImage({ project }: Readonly<{ project: Project }>) {
    const sharedProps = {
        fill: true,
        sizes: "128px",
    } as const;

    if (project.image.light === project.image.dark) {
        return (
            <>
                {project.image.background && (
                    <Image {...sharedProps} alt="" className="rounded-2xl object-cover" src={project.image.background} />
                )}
                <Image
                    {...sharedProps}
                    alt={`${project.title} logo`}
                    className={project.image.background ? "object-contain p-2" : "object-contain"}
                    src={project.image.light}
                />
            </>
        );
    }

    return (
        <>
            <Image {...sharedProps} alt={`${project.title} logo`} className="object-contain dark:hidden" src={project.image.light} />
            <Image {...sharedProps} alt="" className="hidden object-contain dark:block" src={project.image.dark} />
        </>
    );
}

interface ProjectActionProps {
    download?: boolean;
    href: string;
    icon: IconType;
    iconClassName?: string;
    label: string;
    newTab?: boolean;
}

function ProjectAction({ download, href, icon: Icon, iconClassName = "", label, newTab }: Readonly<ProjectActionProps>) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <a
                    aria-label={label}
                    className="group rounded-full p-2 transition hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    download={download || undefined}
                    href={href}
                    rel={newTab ? "noreferrer" : undefined}
                    target={newTab ? "_blank" : undefined}
                    title={label}
                >
                    <Icon aria-hidden className={`text-xl transition ${iconClassName}`} />
                </a>
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={8}>{label}</TooltipContent>
        </Tooltip>
    );
}

export function ProjectShowcase({ projects }: ProjectShowcaseProps) {
    return (
        <section aria-label="Projects" className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3" id="projects">
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

                        <div className="mt-3 flex items-center gap-1">
                            {project.links.demo && <ProjectAction href={project.links.demo} icon={FaPlay} iconClassName="group-hover:text-green-500" label={project.actionLabels?.demo ?? `Try ${project.title}`} newTab />}
                            {project.links.download && <ProjectAction download href={project.links.download} icon={FaDownload} iconClassName="group-hover:text-blue-500" label={project.actionLabels?.download ?? `Download ${project.title}`} />}
                            {project.links.docs && <ProjectAction href={project.links.docs} icon={FaBook} iconClassName="group-hover:text-yellow-500" label={project.actionLabels?.docs ?? `${project.title} documentation`} />}
                            {project.links.github && <ProjectAction href={project.links.github} icon={FaGithub} iconClassName="group-hover:text-zinc-400" label={project.actionLabels?.github ?? `${project.title} on GitHub`} newTab />}
                            {project.links.modelGithub && <ProjectAction href={project.links.modelGithub} icon={FaGithub} iconClassName="text-violet-500 group-hover:text-violet-400" label={project.actionLabels?.modelGithub ?? `${project.title} model training on GitHub`} newTab />}
                            {project.links.npm && <ProjectAction href={project.links.npm} icon={SiNpm} iconClassName="group-hover:text-orange-500" label={project.actionLabels?.npm ?? `${project.title} on npm`} newTab />}
                        </div>
                    </div>
                </Card>
            ))}
        </section>
    );
}
