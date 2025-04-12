// ThunderSynth.tsx (UI with 10-band EQ + rumble controls)
'use client';

import React, { useEffect, useRef, useState } from "react";
import { ThunderParams, ThunderGenerator } from "../classes/ThunderGenerator";

const defaultParams: ThunderParams = {
    volume: 1,
    duration: 2,
    filterFreq: 750,
    burstCount: 3,
    distance: 5,
    delayMs: 0,
    reverbDuration: 2,
    reverbDecay: 2,
    reverbWetLevel: 0.4,
    subLevel: 0.1,
    panRange: 1,
    highPassFreq: 20,
    crackleAmount: 1,
    eqGains: new Array(10).fill(0)
};

const eqFrequencies = [31, 62, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];

export default function ThunderSynth() {
    const [params, setParams] = useState<ThunderParams>(defaultParams);
    const [rumbleFreqStart, setRumbleFreqStart] = useState(30);
    const [rumbleFreqEnd, setRumbleFreqEnd] = useState(20);
    const [rumbleVolume, setRumbleVolume] = useState(0.2);
    const [rumbleDecay, setRumbleDecay] = useState(8);

    const thunderRef = useRef<ThunderGenerator | null>(null);

    useEffect(() => {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const tg = new ThunderGenerator(ctx);
        tg.setParams(params);
        tg.setGeneratedReverb();

        const originalTrigger = tg.triggerThunder.bind(tg);
        tg.triggerThunder = async () => {
            if (ctx.state !== "running") {
                await ctx.resume();
            }
            const now = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "sine";
            osc.frequency.setValueAtTime(rumbleFreqStart, now);
            osc.frequency.linearRampToValueAtTime(rumbleFreqEnd, now + rumbleDecay);
            gain.gain.setValueAtTime(rumbleVolume, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + rumbleDecay);
            osc.connect(gain).connect(ctx.destination);
            osc.start();
            osc.stop(now + rumbleDecay);
            originalTrigger();
        };

        thunderRef.current = tg;
    }, []);

    const updateParam = (key: keyof ThunderParams, value: any) => {
        const newParams = { ...params, [key]: value };
        thunderRef.current?.setParams(newParams);
        if (key === "reverbDuration" || key === "reverbDecay") {
            thunderRef.current?.setGeneratedReverb();
        }
        setParams(newParams);
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

            <h2 className="text-lg font-bold mt-4">EQ Settings</h2>
            <div className="flex">
                {eqFrequencies.map((freq, i) => (
                    <div key={freq} className="flex flex-col items-center gap-16">
                        <label className="text-sm">{freq} Hz</label>
                        <input
                            type="range"
                            min={-24}
                            max={24}
                            step={1}
                            value={params.eqGains?.[i] ?? 0}
                            onChange={(e) => updateEqGain(i, parseFloat(e.target.value))}
                            className="rotate-[-90deg]"
                        />
                        <span className="text-xs">{params.eqGains?.[i] ?? 0} dB</span>
                    </div>
                ))}
            </div>

            <h2 className="text-lg font-bold mt-6">Rumble Settings</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                    <label>Rumble Start Freq: {rumbleFreqStart} Hz</label>
                    <input type="range" min={10} max={100} value={rumbleFreqStart} step={1} onChange={(e) => setRumbleFreqStart(parseFloat(e.target.value))} />
                </div>
                <div>
                    <label>Rumble End Freq: {rumbleFreqEnd} Hz</label>
                    <input type="range" min={5} max={rumbleFreqStart} value={rumbleFreqEnd} step={1} onChange={(e) => setRumbleFreqEnd(parseFloat(e.target.value))} />
                </div>
                <div>
                    <label>Rumble Volume: {rumbleVolume}</label>
                    <input type="range" min={0} max={1} value={rumbleVolume} step={0.01} onChange={(e) => setRumbleVolume(parseFloat(e.target.value))} />
                </div>
                <div>
                    <label>Rumble Decay: {rumbleDecay}s</label>
                    <input type="range" min={0.1} max={10} value={rumbleDecay} step={0.1} onChange={(e) => setRumbleDecay(parseFloat(e.target.value))} />
                </div>
            </div>

            <h2 className="text-lg font-bold mt-6">Thunder Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(params).map(([key, value]) => {
                    if (key === "eqGains") return null;
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
                    } else if (key === "distance") {
                        min = 1; max = 20;
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
