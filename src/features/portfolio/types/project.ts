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
        github?: string;
        npm?: string;
        demo?: string;
    };
    status: "dev" | "prod" | "discontinued";
    tech?: readonly ProjectTechnology[];
}
