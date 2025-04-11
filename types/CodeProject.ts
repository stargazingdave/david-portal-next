export type CodeProjectTech = 'react' | 'nextjs' | 'tailwind' | 'typescript' | 'javascript' | 'html' | 'css' | 'python' | 'java';

export interface CodeProject {
    title: string;
    type: 'website' | 'library' | 'game';
    description: string;
    image: {
        light: string;
        dark: string;
    };
    links: {
        website?: string;
        demo?: string;
        docs?: string;
        github?: string;
        npm?: string;
    };
    status: 'dev' | 'prod' | 'discontinued';
    tech?: CodeProjectTech[];
}