import type { ReactNode } from "react";

export function GuideHeading({ children, id }: { children: ReactNode; id: string }) {
    return (
        <h2 id={id} className="mt-4 text-3xl font-extrabold text-blue-800 dark:text-blue-400">
            {children}
        </h2>
    );
}

export function GuideParagraph({ children }: { children: ReactNode }) {
    return <p className="mb-4">{children}</p>;
}

export function GuideList({ children, level = 0 }: { children: ReactNode; level?: 0 | 1 | 2 | 3 }) {
    const indentation = ["mb-4", "pl-4", "pl-8", "pl-12"][level];
    return <ul className={`list-inside list-disc ${indentation}`}>{children}</ul>;
}

export function GuideFigure({ caption, children }: { caption?: string; children: ReactNode }) {
    return (
        <figure>
            {caption ? <figcaption className="mt-1 text-lg text-muted-foreground">{caption}</figcaption> : null}
            {children}
        </figure>
    );
}
