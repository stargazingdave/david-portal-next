// ThunderSynth.tsx (UI with 10-band EQ + rumble controls)
'use client';

import React, { FC, useEffect, useRef, useState } from "react";
import { ThunderParams, ThunderGenerator } from "../classes/ThunderGenerator";
import { Equalizer } from "./Equalizer";

const defaultParams: ThunderParams = {
    volume: 1,
    duration: 2,
    filterFreq: 750,
    burstCount: 3,
    delayMs: 0,
    reverbDuration: 2,
    reverbDecay: 2,
    reverbWetLevel: 0.4,
    subLevel: 0.1,
    panRange: 1,
    highPassFreq: 20,
    crackleAmount: 1,
    eqGains: new Array(10).fill(0),
    rumbleFreqStart: 30,
    rumbleFreqEnd: 20,
    rumbleVolume: 0.2,
    rumbleDecay: 8,
};

const eqFrequencies = [31, 62, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];

export default function ThunderSynth() {
    const [params, setParams] = useState<ThunderParams>(() => {
        const saved = localStorage.getItem("thunder_preset");
        return saved ? JSON.parse(saved) : defaultParams;
    });

    const thunderRef = useRef<ThunderGenerator | null>(null);

    useEffect(() => {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const tg = new ThunderGenerator(ctx);
        tg.setParams(params);
        tg.setGeneratedReverb();
        thunderRef.current = tg;
    }, []);

    const updateParam = (key: keyof ThunderParams, value: any) => {
        const newParams = { ...params, [key]: value };
        thunderRef.current?.setParams(newParams);
        if (key === "reverbDuration" || key === "reverbDecay") {
            thunderRef.current?.setGeneratedReverb();
        }
        setParams(newParams);
        localStorage.setItem("thunder_preset", JSON.stringify(newParams));
    };

    const updateEqGain = (index: number, value: number) => {
        const newEqGains = [...(params.eqGains ?? new Array(10).fill(0))];
        newEqGains[index] = value;
        updateParam("eqGains", newEqGains);
    };

    return (
        <div className="p-4 space-y-4">
            <button
                onClick={() => thunderRef.current?.triggerThunder()}
                className="bg-blue-600 text-white px-4 py-2 rounded"
            >
                ⚡ Trigger Thunder
            </button>

            <Equalizer gains={params.eqGains} freqs={eqFrequencies} onChange={updateEqGain} />

            <RumbleSettings
                rumbleFreqStart={params.rumbleFreqStart!}
                rumbleFreqEnd={params.rumbleFreqEnd!}
                rumbleVolume={params.rumbleVolume!}
                rumbleDecay={params.rumbleDecay!}
                onChange={(key, value) => updateParam(key as keyof ThunderParams, value)}
            />

            <h2 className="text-lg font-bold mt-6">Thunder Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(params).map(([key, value]) => {
                    if (["eqGains", "rumbleFreqStart", "rumbleFreqEnd", "rumbleVolume", "rumbleDecay", "distance"].includes(key)) return null;
                    const numericValue = value as number;
                    let min = 0, max = 100, step = 0.1;
                    if (key === "burstCount") {
                        min = 1; max = 10; step = 1;
                    } else if (key === "filterFreq") {
                        max = 3000;
                    } else if (key === "delayMs") {
                        max = 10000;
                    } else if (["panRange", "subLevel", "reverbWetLevel", "crackleAmount"].includes(key)) {
                        max = 1; step = 0.01;
                    } else if (key === "highPassFreq") {
                        max = 1000; step = 10;
                    } else if (key === "volume") {
                        max = 2; step = 0.01;
                    }

                    return (
                        <div key={key} className="flex flex-col">
                            <label>{key}: {numericValue}</label>
                            <input
                                type="range"
                                min={min}
                                max={max}
                                step={step}
                                value={numericValue}
                                onChange={(e) => updateParam(key as keyof ThunderParams, parseFloat(e.target.value))}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}



// RumbleSettings in the style of the equalizer above
interface RumbleSettingsProps {
    rumbleFreqStart: number
    rumbleFreqEnd: number
    rumbleVolume: number
    rumbleDecay: number
    onChange: (key: string, value: number) => void
}

const RumbleSettings: FC<RumbleSettingsProps> = ({ rumbleFreqStart, rumbleFreqEnd, rumbleVolume, rumbleDecay, onChange }) => {
    const containerRef = useRef<HTMLDivElement>(null)

    const handleDrag = (e: React.MouseEvent, key: string) => {
        const container = containerRef.current
        if (!container) return

        const rect = container.getBoundingClientRect()
        const height = rect.height
        const y = e.clientY - rect.top
        const clampedY = Math.max(0, Math.min(height, y))
        const percent = 1 - clampedY / height
        const newValue = key === "rumbleVolume" ? percent : (key === "rumbleDecay" ? 0.1 + percent * 9.9 : 10 + percent * 90)
        onChange(key, Math.round(newValue * 10) / 10)
    }

    return (
        <div
            ref={containerRef}
            className="flex gap-1 justify-center items-end p-4 rounded-xl shadow-xl h-48 w-fit"
        >
            <div className="flex flex-col items-center w-10 cursor-pointer select-none" onMouseDown={(e) => {
                e.preventDefault();
                const move = (e: MouseEvent) => handleDrag(e as unknown as React.MouseEvent, "rumbleFreqStart");
                const up = () => {
                    window.removeEventListener('mousemove', move)
                    window.removeEventListener('mouseup', up)
                };
                window.addEventListener('mousemove', move);
                window.addEventListener('mouseup', up);
                handleDrag(e as unknown as React.MouseEvent, "rumbleFreqStart");
            }}>
                <span className="text-xs text-gray-400">{rumbleFreqStart} Hz</span>
                <div className="relative h-32 w-3 bg-gray-700 rounded overflow-hidden">
                    <div className="absolute bottom-0 w-full bg-sky-500" style={{ height: `${(rumbleFreqStart - 10) / 90 * 100}%` }} />
                </div>
            </div>
            <div className="flex flex-col items-center w-10 cursor-pointer select-none" onMouseDown={(e) => {
                e.preventDefault();
                const move = (e: MouseEvent) => handleDrag(e as unknown as React.MouseEvent, "rumbleFreqEnd");
                const up = () => {
                    window.removeEventListener('mousemove', move)
                    window.removeEventListener('mouseup', up)
                };
                window.addEventListener('mousemove', move);
                window.addEventListener('mouseup', up);
                handleDrag(e as unknown as React.MouseEvent, "rumbleFreqEnd");
            }}>
                <span className="text-xs text-gray-400">{rumbleFreqEnd} Hz</span>
                <div className="relative h-32 w-3 bg-gray-700 rounded overflow-hidden">
                    <div className="absolute bottom-0 w-full bg-sky-500" style={{ height: `${(rumbleFreqEnd - 10) / 90 * 100}%` }} />
                </div>
            </div>
            <div className="flex flex-col items-center w-10 cursor-pointer select-none"
                onMouseDown={(e) => {
                    e.preventDefault()
                    const move = (e: MouseEvent) => handleDrag(e as unknown as React.MouseEvent, "rumbleVolume")
                    const up = () => {
                        window.removeEventListener('mousemove', move)
                        window.removeEventListener('mouseup', up)
                    }
                    window.addEventListener('mousemove', move)
                    window.addEventListener('mouseup', up)
                    handleDrag(e as unknown as React.MouseEvent, "rumbleVolume")
                }}>
                <span className="text-xs text-gray-400">{rumbleVolume}</span>
                <div className="relative h-32 w-3 bg-gray-700 rounded overflow-hidden">
                    <div className="absolute bottom-0 w-full bg-sky-500" style={{ height: `${rumbleVolume * 100}%` }} />
                </div>
            </div>
            <div className="flex flex-col items-center w-10 cursor-pointer select-none" onMouseDown={(e) => {
                e.preventDefault()
                const move = (e: MouseEvent) => handleDrag(e as unknown as React.MouseEvent, "rumbleDecay")
                const up = () => {
                    window.removeEventListener('mousemove', move)
                    window.removeEventListener('mouseup', up)
                }
                window.addEventListener('mousemove', move)
                window.addEventListener('mouseup', up)
                handleDrag(e as unknown as React.MouseEvent, "rumbleDecay")
            }
            }>
                <span className="text-xs text-gray-400">{rumbleDecay}s</span>
                <div className="relative h-32 w-3 bg-gray-700 rounded overflow-hidden">
                    <div className="absolute bottom-0 w-full bg-sky-500" style={{ height: `${(rumbleDecay - 0.1) / 9.9 * 100}%` }} />
                </div>
            </div>
            <div className="flex h-full items-end text-xs">
                Hz
            </div>
        </div >
    )
}

