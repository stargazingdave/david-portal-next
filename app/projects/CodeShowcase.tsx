'use client';

import { Card } from '@dpdev/nucleard';
import { CodeProject, CodeProjectTech } from '@/types/CodeProject';
import Image from 'next/image';
import { FC, JSX } from 'react';
import { FaGithub, FaGlobe, FaBook } from 'react-icons/fa';
import { MdDeveloperBoard } from 'react-icons/md';
import { SiAndroid, SiCss3, SiHtml5, SiJavascript, SiKotlin, SiNextdotjs, SiNpm, SiPython, SiReact, SiSupabase, SiTailwindcss, SiTypescript } from 'react-icons/si';
import { useTheme } from '@/app/contexts/ThemeProvider'; // ✅ adjust the path if needed

interface CodeShowcaseProps {
    projects: CodeProject[];
}

type ProjectStatus = {
    label: string;
    color: string;
};

const projectTypeMap: Record<CodeProject['type'], ProjectStatus> = {
    website: { label: 'Website', color: '#d92aff' },
    library: { label: 'Library', color: '#00e5ff' },
    game: { label: 'Game', color: '#aeff00' },
    "android-app": { label: 'Android App', color: '#ff9800' },
};

const projectStatusMap: Record<CodeProject['status'], ProjectStatus> = {
    dev: { label: 'In Development', color: '#dcae3685' },
    prod: { label: 'Production', color: '#1eff7185' },
    discontinued: { label: 'Discontinued', color: '#85858585' },
};

const techIconMap: Record<CodeProjectTech, JSX.Element> = {
    react: <SiReact title="React" />,
    nextjs: <SiNextdotjs title="Next.js" />,
    tailwind: <SiTailwindcss title="Tailwind CSS" />,
    typescript: <SiTypescript title="TypeScript" />,
    javascript: <SiJavascript title="JavaScript" />,
    html: <SiHtml5 title="HTML" />,
    css: <SiCss3 title="CSS" />,
    python: <SiPython title="Python" />,
    java: <SiJavascript title="Java" />,
    kotlin: <SiKotlin title="Kotlin" />,
    android: <SiAndroid title="Android" />,
    supabase: <SiSupabase title="Supabase" />,
};

export const CodeShowcase: FC<CodeShowcaseProps> = ({ projects }) => {
    const { resolvedTheme } = useTheme();
    const isDarkMode = resolvedTheme === 'dark';

    return (
        <>
            <div className="max-w-3xl mx-auto p-4 text-base text-center">
                <p>
                    A few things I’ve built — either because I needed them, wanted to learn something, or just felt like it.<br />
                    Perfection is not guaranteed — but maybe there’s something here you’ll find useful.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                {projects.map((project, idx) => (
                    <Card
                        key={idx}
                        className="flex flex-col items-center border border-zinc-700 rounded-xl overflow-hidden shadow-md"
                    >
                        <div className="flex justify-center w-full pt-2">
                            <div className="relative w-32 h-32 flex-shrink-0">
                                <Image
                                    src={isDarkMode ? project.image.dark : project.image.light}
                                    alt={project.description}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </div>

                        <div className="w-full flex flex-col justify-between p-4 gap-2">
                            <h2 className="text-2xl font-bold mt-1">{project.title}</h2>

                            {project.tech && (
                                <div className="flex flex-wrap w-full gap-2 text-xl">
                                    {project.tech.map((tech, i) => (
                                        <div key={i} className="hover:scale-110 transition" title={tech}>
                                            {techIconMap[tech]}
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div>
                                <p className="space-x-2 text-sm">
                                    <span
                                        className="text-xs uppercase tracking-wide font-bold"
                                        style={{ color: projectTypeMap[project.type].color }}
                                    >
                                        {projectTypeMap[project.type].label}
                                    </span>
                                    <span className="text-xs uppercase tracking-wide font-bold">•</span>
                                    <span
                                        className="text-xs uppercase tracking-wide font-bold"
                                        style={{ color: projectStatusMap[project.status].color }}
                                    >
                                        {projectStatusMap[project.status].label}
                                    </span>
                                </p>

                                <p className="mt-2 text-sm leading-relaxed">
                                    {project.description}
                                </p>
                            </div>

                            <div className="flex space-x-4 mt-4">
                                {project.links.website && (
                                    <a href={project.links.website} target="_blank" rel="noreferrer">
                                        <FaGlobe className="hover:text-blue-400 text-xl" />
                                    </a>
                                )}
                                {project.links.demo && (
                                    <a href={project.links.demo} target="_blank" rel="noreferrer">
                                        <MdDeveloperBoard className="hover:text-green-400 text-xl" />
                                    </a>
                                )}
                                {project.links.docs && (
                                    <a href={project.links.docs} target="_blank" rel="noreferrer">
                                        <FaBook className="hover:text-yellow-400 text-xl" />
                                    </a>
                                )}
                                {project.links.github && (
                                    <a href={project.links.github} target="_blank" rel="noreferrer">
                                        <FaGithub className="hover:text-gray-400 text-xl" />
                                    </a>
                                )}
                                {project.links.npm && (
                                    <a href={project.links.npm} target="_blank" rel="noreferrer">
                                        <SiNpm className="hover:text-orange-400 text-xl" />
                                    </a>
                                )}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </>
    );
};
