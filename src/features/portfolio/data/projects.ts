import type { Project } from "../types/project";

export const projects = [
    {
        title: "Agent Diagram",
        type: "desktop-app",
        description:
            "A local Windows diagram editor built for humans and AI agents. Create structured diagrams visually or through MCP, then export them as PNG or SVG.",
        image: {
            light: "/images/agent-diagram-mark.svg",
            dark: "/images/agent-diagram-mark.svg",
            background: "/images/agent-diagram-background.svg",
        },
        links: {
            website: "/agent-diagram",
            download: "/downloads/agent-diagram-0.1.0-x64-setup.exe",
            github: "https://github.com/stargazingdave/agent-diagram",
        },
        actionLabels: {
            download: "Download Agent Diagram",
            github: "View Agent Diagram source",
        },
        status: "prod",
        tech: ["react", "typescript", "rust", "tauri"],
    },
    {
        title: "Orlog",
        type: "game",
        description:
            "A browser adaptation of the Viking dice game with tactical combat, God Favors, and local, online, or AI-powered play.",
        image: {
            light: "/images/orlog.png",
            dark: "/images/orlog.png",
        },
        links: {
            website: "/orlog",
            github: "https://github.com/stargazingdave/orlog",
            modelGithub: "https://github.com/stargazingdave/self_orlog",
            demo: "https://orlog-delta.vercel.app/",
        },
        actionLabels: {
            demo: "Play Orlog",
            github: "View Orlog source",
            modelGithub: "View Orlog AI training source",
        },
        status: "prod",
        tech: ["react", "nextjs", "supabase", "tailwind", "typescript", "python"],
    },
    {
        title: "NoiseD",
        type: "library",
        description:
            "An experiment in creating realistic rain and thunder entirely in JavaScript, with no external dependencies. It produced convincing sound, but complex soundscapes exposed reliability and live-editing limits.",
        image: {
            light: "/images/noised-logo-icon.png",
            dark: "/images/noised-logo-icon.png",
        },
        links: {
            website: "/noised",
            github: "https://github.com/stargazingdave/noised",
            npm: "https://www.npmjs.com/package/noised",
            demo: "/noised/demo",
        },
        actionLabels: {
            demo: "Try NoiseD",
            github: "View NoiseD source",
            npm: "View NoiseD on npm",
        },
        status: "experiment",
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
            website: "/dannykrivosh",
            demo: "https://dannykrivosh.com",
            github: "https://github.com/stargazingdave/danny-krivosh-next-app",
        },
        actionLabels: {
            demo: "Visit Danny's website",
            github: "View dannykrivosh.com source",
        },
        status: "prod",
        tech: ["react", "nextjs", "supabase", "tailwind", "typescript"],
    },
    {
        title: "TunerD",
        type: "android-app",
        description:
            "An experiment in building a simple, ad-free Android guitar tuner. After testing several pitch-detection algorithms and display optimizations, it became usable but not as reliable as commercial tuning apps.",
        image: {
            light: "/images/tunerd-logo.png",
            dark: "/images/tunerd-logo.png",
        },
        links: {
            website: "/tunerd",
            download: "/downloads/tunerd-v1.0-release.apk",
            github: "https://github.com/stargazingdave/tunerd",
        },
        actionLabels: {
            download: "Download TunerD",
            github: "View TunerD source",
        },
        status: "experiment",
        tech: ["kotlin", "android"],
    },
] as const satisfies readonly Project[];
