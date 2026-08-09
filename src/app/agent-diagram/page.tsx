import type { Metadata } from "next";
import Image from "next/image";
import { FaDownload, FaLock, FaWindows } from "react-icons/fa";
import { SiTauri } from "react-icons/si";

export const metadata: Metadata = {
    title: "Agent Diagram | David Portal Dev",
    description: "A local Windows diagram editor for humans and AI agents.",
};

const features = [
    {
        title: "Visual diagram editing",
        description: "Build diagrams on a flexible canvas with custom shapes, connections, groups, themes, and an inspector for precise editing.",
    },
    {
        title: "Built for AI agents",
        description: "The bundled MCP server lets compatible agents create, inspect, edit, validate, arrange, and render diagrams through structured operations.",
    },
    {
        title: "Automatic layout",
        description: "Turn complex structures into readable diagrams with layered auto-layout, then fine-tune every element by hand.",
    },
    {
        title: "Portable exports",
        description: "Save the editable .agentdiagram.json source and export the exact canvas as crisp SVG or PNG artwork.",
    },
] as const;

export default function AgentDiagramPage() {
    return (
        <div className="flex flex-1 flex-col items-center px-4 py-10 sm:px-6 sm:py-14">
            <section className="flex w-full max-w-5xl flex-col items-center gap-8 lg:flex-row lg:gap-14">
                <div className="relative aspect-square w-full max-w-72 shrink-0 overflow-hidden rounded-[2rem] shadow-2xl shadow-blue-500/20 sm:max-w-80">
                    <Image
                        alt=""
                        className="object-cover"
                        fill
                        priority
                        sizes="(max-width: 640px) 288px, 320px"
                        src="/images/agent-diagram-background.svg"
                    />
                    <Image
                        alt="Agent Diagram logo"
                        className="object-contain p-5"
                        fill
                        priority
                        sizes="(max-width: 640px) 288px, 320px"
                        src="/images/agent-diagram-mark.svg"
                    />
                </div>

                <div className="flex max-w-2xl flex-col items-center text-center lg:items-start lg:text-left">
                    <div className="mb-4 flex flex-wrap justify-center gap-2 lg:justify-start">
                        <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800 dark:bg-blue-950 dark:text-blue-200">
                            <FaWindows aria-hidden /> Windows app
                        </span>
                        <span className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1 text-sm font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                            <SiTauri aria-hidden /> Version 0.1.0
                        </span>
                    </div>

                    <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Agent Diagram</h1>
                    <p className="mt-4 text-lg leading-relaxed text-secondary-foreground sm:text-xl">
                        A local desktop diagram editor designed for humans and AI agents. Shape ideas visually, collaborate with an MCP-connected agent, and keep the structured source on your own computer.
                    </p>

                    <a
                        className="mt-7 inline-flex items-center gap-3 rounded-xl bg-blue-600 px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                        download
                        href="/downloads/agent-diagram-0.1.0-x64-setup.exe"
                    >
                        <FaDownload aria-hidden />
                        Download for Windows
                    </a>
                    <p className="mt-3 text-sm text-muted-foreground">64-bit installer · Version 0.1.0 · 22.6 MB</p>
                </div>
            </section>

            <section className="mt-16 grid w-full max-w-5xl gap-4 sm:grid-cols-2" aria-labelledby="features-heading">
                <h2 className="sr-only" id="features-heading">Features</h2>
                {features.map((feature) => (
                    <article className="rounded-2xl border bg-card p-6 shadow-sm" key={feature.title}>
                        <h3 className="text-xl font-bold">{feature.title}</h3>
                        <p className="mt-2 leading-relaxed text-muted-foreground">{feature.description}</p>
                    </article>
                ))}
            </section>

            <section className="mt-10 flex w-full max-w-5xl items-start gap-4 rounded-2xl border border-emerald-500/30 bg-emerald-50 p-6 text-emerald-950 dark:bg-emerald-950/30 dark:text-emerald-100">
                <FaLock aria-hidden className="mt-1 shrink-0 text-xl" />
                <div>
                    <h2 className="font-bold">Local by design</h2>
                    <p className="mt-1 leading-relaxed">
                        Agent Diagram has no cloud backend, account system, telemetry, or network service. Your diagram files stay under your control.
                    </p>
                </div>
            </section>

            <p className="mt-8 max-w-2xl text-center text-sm leading-relaxed text-muted-foreground">
                Requires 64-bit Windows and the Microsoft Edge WebView2 Runtime, which is included with current Windows 11 installations.
            </p>
        </div>
    );
}
