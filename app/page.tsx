import { CodeProject } from "@/types/CodeProject";
import { HomePage } from "./HomePage";

export default async function Home() {
  return <HomePage projects={getCodeProjects()} />;
}

const getCodeProjects = (): CodeProject[] => {
  const projects: CodeProject[] = [
    {
      title: 'dannykrivosh.com',
      type: 'website',
      description:
        'A chaotically themed music site for Danny, the greatest musician on earth, designed as a collaborative effort between us.',
      image: {
        light: '/images/danny-icon.png',
        dark: '/images/danny-icon.png',
      },
      links: {
        website: 'https://dannykrivosh.com',
        github: 'https://github.com/stargazingdave/danny-krivosh-next-app',
      },
      status: 'prod',
      tech: ['react', 'nextjs', 'supabase', 'tailwind', 'typescript']
    },
    {
      title: 'NoiseD',
      type: 'library',
      description:
        'A lightweight JavaScript library that creates realistic rain and thunder sounds, with no external dependencies. It’s designed for adding ambiance to any JavaScript project. The demo allows you to design the soundscape you want, and download the parameters as JSON.',
      image: {
        light: '/images/noised-logo-icon.png',
        dark: '/images/noised-logo-icon.png',
      },
      links: {
        website: '/weather_synth',
        github: 'https://github.com/stargazingdave/noised',
        npm: 'https://www.npmjs.com/package/noised',
      },
      status: 'dev',
      tech: ['typescript']
    },
    {
      title: 'TunerD',
      type: 'android-app',
      description:
        'A simple Android app for tuning guitars — no ads, no nonsense. Just a clean interface that gets the job done, with easy tuning selection. Available via APK download.',
      image: {
        light: '/images/tunerd-logo.png',
        dark: '/images/tunerd-logo.png',
      },
      links: {
        website: 'https://davidportal.dev/tunerd',
        github: 'https://github.com/stargazingdave/tunerd',
      },
      status: 'prod',
      tech: ['kotlin', 'android']
    }
    // {
    //     title: 'NuclearD',
    //     type: 'library',
    //     description:
    //         'A React component library for basic general-use themed components.',
    //     image: {
    //         light: '/images/nucleard-logo.png',
    //         dark: '/images/nucleard-logo.png',
    //     },
    //     links: {
    //         docs: 'https://yourdomain.com/dbase/docs',
    //         github: 'https://github.com/yourrepo/dbase',
    //         npm: 'https://www.npmjs.com/package/dbase',
    //     },
    //     status: 'dev',
    //     tech: ['react', 'tailwind', 'typescript']
    // },
    // {
    //     title: <p>Snake <span className="italic">XL</span></p>,
    //     type: 'game',
    //     description:
    //         'An extra-everything Snake game built as a React component as part of dannykrivosh.com.',
    //     image: {
    //         light: '/images/snakexl-logo.png',
    //         dark: '/images/snakexl-logo.png',
    //     },
    //     links: {
    //         demo: 'https://yourdomain.com/snakexl',
    //         github: 'https://github.com/yourrepo/snakexl',
    //     },
    //     status: 'dev',
    //     tech: ['react', 'tailwind', 'typescript']
    // },
  ];

  return projects;
}