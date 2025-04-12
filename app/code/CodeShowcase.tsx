'use client';

import { Card } from '@dpdev/nucleard';
import { CodeProject, CodeProjectTech } from '@/types/CodeProject';
import Image from 'next/image';
import { FC, JSX, useEffect, useState } from 'react';
import { FaGithub, FaGlobe, FaBook } from 'react-icons/fa';
import { MdDeveloperBoard } from 'react-icons/md';
import { SiCss3, SiHtml5, SiJavascript, SiNextdotjs, SiNpm, SiPython, SiReact, SiTailwindcss, SiTypescript } from 'react-icons/si';

interface CodeShowcaseProps {
    projects: CodeProject[];
}

type ProjectStatus = {
    label: string;
    color: string;
}

const projectTypeMap: Record<CodeProject['type'], ProjectStatus> = {
    website: { label: 'Website', color: '#d92aff' },
    library: { label: 'Library', color: '#00e5ff' },
    game: { label: 'Game', color: '#aeff00' },
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
};

export const CodeShowcase: FC<CodeShowcaseProps> = ({ projects }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e: MediaQueryListEvent) => {
            setIsDarkMode(e.matches);
        };

        darkModeMediaQuery.addEventListener('change', handleChange);
        setIsDarkMode(darkModeMediaQuery.matches);

        return () => {
            darkModeMediaQuery.removeEventListener('change', handleChange);
        };
    }, []);


    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {projects.map((project, idx) => (
                <Card
                    key={idx}
                    className="flex flex-col justify-center items-center border border-zinc-700 rounded-xl overflow-hidden shadow-md"
                >
                    <div className="relative sm:w-50 sm:h-50 w-32 h-32 flex-shrink-0">
                        <Image
                            src={isDarkMode ? project.image.dark : project.image.light}
                            alt={project.description}
                            fill
                            className='p-4 object-contain'
                        />
                    </div>

                    <div className="w-full flex flex-col justify-between p-4 gap-2">
                        {project.tech && (
                            <div className="flex flex-wrap w-full gap-2 text-xl text-white">
                                {project.tech.map((tech, i) => (
                                    <div key={i} className="hover:scale-110 transition" title={tech}>
                                        {techIconMap[tech]}
                                    </div>
                                ))}
                            </div>
                        )}
                        <div>
                            <p className='space-x-2 text-zinc-400 text-sm'>
                                <span
                                    className="text-xs uppercase tracking-wide font-bold"
                                    style={{ color: projectTypeMap[project.type].color }}
                                >
                                    {project.type}
                                </span>
                                <span className="text-xs uppercase tracking-wide font-bold">
                                    •
                                </span>
                                <span
                                    className="text-xs uppercase tracking-wide font-bold"
                                    style={{ color: projectStatusMap[project.status].color }}
                                >
                                    {projectStatusMap[project.status].label}
                                </span>
                            </p>

                            <h2 className="text-2xl font-bold text-white mt-1">{project.title}</h2>
                            <p className="text-zinc-300 mt-2 text-sm leading-relaxed">
                                {project.description}
                            </p>
                        </div>
                        <div className="flex space-x-4 mt-4">
                            {project.links.website && (
                                <a href={project.links.website} target="_blank" rel="noreferrer">
                                    <FaGlobe className="text-white hover:text-blue-400 text-xl" />
                                </a>
                            )}
                            {project.links.demo && (
                                <a href={project.links.demo} target="_blank" rel="noreferrer">
                                    <MdDeveloperBoard className="text-white hover:text-green-400 text-xl" />
                                </a>
                            )}
                            {project.links.docs && (
                                <a href={project.links.docs} target="_blank" rel="noreferrer">
                                    <FaBook className="text-white hover:text-yellow-400 text-xl" />
                                </a>
                            )}
                            {project.links.github && (
                                <a href={project.links.github} target="_blank" rel="noreferrer">
                                    <FaGithub className="text-white hover:text-gray-400 text-xl" />
                                </a>
                            )}
                            {project.links.npm && (
                                <a href={project.links.npm} target="_blank" rel="noreferrer">
                                    <SiNpm className="text-white hover:text-orange-400 text-xl" />
                                </a>
                            )}
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
} 
