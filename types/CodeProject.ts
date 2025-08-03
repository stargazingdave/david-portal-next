import { ReactNode } from "react";

export type CodeProjectTech =
    | 'react'
    | 'nextjs'
    | 'tailwind'
    | 'typescript'
    | 'javascript'
    | 'html'
    | 'css'
    | 'python'
    | 'java'
    | 'kotlin'
    | 'android'
    | 'supabase';

export interface CodeProject {
    title: ReactNode;
    type: 'website' | 'library' | 'game' | 'android-app';
    description: string;
    image: {
        light: string;
        dark: string;
    };
    links: {
        website?: string;
        docs?: string;
        github?: string;
        npm?: string;
    };
    status: 'dev' | 'prod' | 'discontinued';
    tech?: CodeProjectTech[];
}