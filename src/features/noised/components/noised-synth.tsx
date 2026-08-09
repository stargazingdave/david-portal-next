"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";
import { IoSave } from "react-icons/io5";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useTheme } from "@/components/theme/theme-provider";
import { useNoisedController } from "../hooks/use-noised-controller";
import { MasterControls } from "./synth/panels/master-controls";
import { RainControls } from "./synth/panels/rain-controls";
import { ThunderControls } from "./synth/panels/thunder-controls";
import { Visualization } from "./visualization";

type ControlTab = "master" | "rain" | "thunder";

const tabs: ReadonlyArray<{ id: ControlTab; label: string }> = [
    { id: "master", label: "Master Controls" },
    { id: "rain", label: "Rain Controls" },
    { id: "thunder", label: "Thunder Controls" },
];

function downloadJson(value: unknown) {
    const blob = new Blob([JSON.stringify(value, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "noised-params.json";
    link.click();
    URL.revokeObjectURL(url);
}

function TabPanel({ children, id }: Readonly<{ children: ReactNode; id: ControlTab }>) {
    return (
        <div
            aria-labelledby={`${id}-tab`}
            className="flex flex-col border bg-neutral-500/30 font-[courier] backdrop-blur-md"
            id={`${id}-panel`}
            role="tabpanel"
        >
            {children}
        </div>
    );
}

export function NoisedSynth() {
    const { resolvedTheme } = useTheme();
    const { actions, analyser, isRunning, params, toggle } = useNoisedController();
    const [selectedTab, setSelectedTab] = useState<ControlTab>("master");
    const equalizerColors = resolvedTheme === "dark"
        ? { background: "#1a1a1a", Hz: "#fff", dB: "#fff" }
        : { background: "#fff", Hz: "#000", dB: "#000" };

    return (
        <div className="w-full">
            <header className="relative flex flex-wrap items-center">
                <div className="pointer-events-none absolute inset-0 z-0 rounded-lg opacity-50">
                    <Visualization analyser={analyser} isPlaying={isRunning} type="waveform" barCount={48} />
                </div>
                <div className="relative z-10 flex w-full flex-wrap items-center justify-between p-4">
                    <div className="relative z-10 h-28 w-72 shrink-0">
                        <Image
                            alt="NoiseD Logo"
                            className="object-contain object-bottom"
                            fill
                            priority
                            sizes="288px"
                            src="/images/noised-logo-full.png"
                        />
                    </div>
                    <button
                        aria-pressed={isRunning}
                        className="z-10 flex h-fit items-center rounded-full bg-neutral-500 px-4 py-2 text-xl font-bold text-white transition hover:bg-neutral-600"
                        onClick={() => void toggle()}
                        type="button"
                    >
                        <Image alt="" aria-hidden className="mr-2" height={48} src="/images/noised-logo-icon.png" width={48} />
                        {isRunning ? "Silence!" : "Start the Noise!"}
                    </button>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                aria-label="Download parameters as JSON"
                                className="z-10 rounded-full p-4 font-bold text-pink-500 transition hover:text-pink-600"
                                onClick={() => downloadJson(params)}
                                type="button"
                            >
                                <IoSave aria-hidden size={50} />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent side="top">Download the current parameters as JSON</TooltipContent>
                    </Tooltip>
                </div>
            </header>

            <div className="flex flex-col">
                <div aria-label="NoiseD control groups" className="flex w-full" role="tablist">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            aria-controls={`${tab.id}-panel`}
                            aria-selected={selectedTab === tab.id}
                            className={`flex grow px-4 py-2 text-xl font-bold ${selectedTab === tab.id ? "bg-pink-700 text-white" : "bg-neutral-500/30 hover:bg-pink-500/50"}`}
                            id={`${tab.id}-tab`}
                            onClick={() => setSelectedTab(tab.id)}
                            role="tab"
                            type="button"
                        >
                            <span className="w-full text-center">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {selectedTab === "master" && <TabPanel id="master"><MasterControls actions={actions} colors={equalizerColors} params={params} /></TabPanel>}
                {selectedTab === "rain" && <TabPanel id="rain"><RainControls actions={actions} colors={equalizerColors} params={params} /></TabPanel>}
                {selectedTab === "thunder" && <TabPanel id="thunder"><ThunderControls actions={actions} colors={equalizerColors} params={params} /></TabPanel>}
            </div>
        </div>
    );
}
