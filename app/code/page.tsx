import { CodeProject } from "@/types/CodeProject";
import { CodeShowcase } from "./CodeShowcase";

export default function CodePage() {
    const projects = getCodeProjects();
    return <CodeShowcase projects={projects} />;
}

const getCodeProjects = (): CodeProject[] => {
    const projects: CodeProject[] = [
        {
            title: 'dannykrivosh.com',
            type: 'website',
            description:
                'A chaotically themed music site for Danny, the greatest musician on earth, designed as a coop between us.',
            image: {
                light: '/images/danny-icon.png',
                dark: '/images/danny-icon.png',
            },
            links: {
                website: 'https://dannykrivosh.com',
                github: 'https://github.com/stargazingdave/danny-krivosh-next-app',
            },
            status: 'prod',
            tech: ['react', 'nextjs', 'tailwind', 'typescript']
        },
        {
            title: 'NoiseD',
            type: 'library',
            description:
                'A JavaScript library for generating background noise like rain and thunders.',
            image: {
                light: '/images/noised-logo-icon.png',
                dark: '/images/noised-logo-icon.png',
            },
            links: {
                demo: '/weather_synth',
                // docs: 'https://yourdomain.com/dnoise/docs',
                github: 'https://github.com/stargazingdave/noised',
                npm: 'https://www.npmjs.com/package/noised',
            },
            status: 'prod',
            tech: ['typescript']
        },
        {
            title: 'NuclearD',
            type: 'library',
            description:
                'A React component library for basic general-use themed components.',
            image: {
                light: '/images/nucleard-logo.png',
                dark: '/images/nucleard-logo.png',
            },
            links: {
                docs: 'https://yourdomain.com/dbase/docs',
                github: 'https://github.com/yourrepo/dbase',
                npm: 'https://www.npmjs.com/package/dbase',
            },
            status: 'dev',
            tech: ['react', 'tailwind', 'typescript']
        },
        {
            title: <p>Snake <span className="italic">XL</span></p>,
            type: 'game',
            description:
                'An extra-everything Snake game built as a React component as part of dannykrivosh.com.',
            image: {
                light: '/images/snakexl-logo.png',
                dark: '/images/snakexl-logo.png',
            },
            links: {
                demo: 'https://yourdomain.com/snakexl',
                github: 'https://github.com/yourrepo/snakexl',
            },
            status: 'dev',
            tech: ['react', 'tailwind', 'typescript']
        },
    ];

    return projects;
}