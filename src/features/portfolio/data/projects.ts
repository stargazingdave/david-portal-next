import type { Project } from "../types/project";

export const projects = [
    {
        title: "NoiseD",
        type: "library",
        description:
            "A lightweight JavaScript library that creates realistic rain and thunder sounds, with no external dependencies. The demo lets you design a soundscape and download its parameters as JSON.",
        image: {
            light: "/images/noised-logo-icon.png",
            dark: "/images/noised-logo-icon.png",
        },
        links: {
            website: "/noised",
            github: "https://github.com/stargazingdave/noised",
            npm: "https://www.npmjs.com/package/noised",
        },
        status: "dev",
        tech: ["typescript"],
    },
    {
        title: "dannykrivosh.com",
        type: "website",
        description:
            "A personalized website for Danny Krivosh, showcasing his music and filled with character, easter eggs, and unique design elements.",
        image: {
            light: "/images/danny-icon.png",
            dark: "/images/danny-icon.png",
        },
        links: {
            website: "https://dannykrivosh.com",
            github: "https://github.com/stargazingdave/danny-krivosh-next-app",
        },
        status: "prod",
        tech: ["react", "nextjs", "supabase", "tailwind", "typescript"],
    },
    {
        title: "TunerD",
        type: "android-app",
        description:
            "A simple Android app for tuning guitars—no ads, no nonsense. It provides a clean interface and easy tuning selection through a downloadable APK.",
        image: {
            light: "/images/tunerd-logo.png",
            dark: "/images/tunerd-logo.png",
        },
        links: {
            website: "/tunerd",
            github: "https://github.com/stargazingdave/tunerd",
        },
        status: "prod",
        tech: ["kotlin", "android"],
    },
] as const satisfies readonly Project[];
