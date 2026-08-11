export type ProjectTechnology =
    | "react"
    | "nextjs"
    | "tailwind"
    | "typescript"
    | "javascript"
    | "html"
    | "css"
    | "python"
    | "java"
    | "kotlin"
    | "android"
    | "rust"
    | "tauri"
    | "supabase";

export interface Project {
    title: string;
    type: "website" | "library" | "game" | "android-app" | "desktop-app";
    description: string;
    image: {
        light: string;
        dark: string;
        background?: string;
    };
    links: {
        website?: string;
        docs?: string;
        download?: string;
        github?: string;
        modelGithub?: string;
        npm?: string;
        demo?: string;
    };
    actionLabels?: {
        demo?: string;
        docs?: string;
        download?: string;
        github?: string;
        modelGithub?: string;
        npm?: string;
    };
    status: "dev" | "prod" | "experiment" | "discontinued";
    tech?: readonly ProjectTechnology[];
}
