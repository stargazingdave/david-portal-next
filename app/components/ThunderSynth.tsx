// ThunderSynth.tsx
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
    subLevel: 0.1,
    panRange: 1,
    highPassFreq: 20,
    crackleAmount: 1,
};

export default function ThunderSynth() {
    const [params, setParams] = useState<ThunderParams>(defaultParams);
    const [rumbleFreqStart, setRumbleFreqStart] = useState(30);
    const [rumbleFreqEnd, setRumbleFreqEnd] = useState(20);
    const [rumbleVolume, setRumbleVolume] = useState(0.2);
    const [rumbleDecay, setRumbleDecay] = useState(3);

    const thunderRef = useRef<ThunderGenerator | null>(null);
    const ctxRef = useRef<AudioContext | null>(null);
    const rumbleConfigRef = useRef({
        freqStart: rumbleFreqStart,
        freqEnd: rumbleFreqEnd,
        volume: rumbleVolume,
        decay: rumbleDecay,
    });

    useEffect(() => {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const tg = new ThunderGenerator(ctx);
        tg.setParams(params);
        tg.setGeneratedReverb();

        const originalTrigger = tg.triggerThunder.bind(tg);
        tg.triggerThunder = async () => {
            if (ctx.state !== "running") {
                try {
                    await ctx.resume();
                } catch (err) {
                    console.error("Failed to resume AudioContext:", err);
                    return;
                }
            }

            const { freqStart, freqEnd, volume, decay } = rumbleConfigRef.current;

            const now = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            const safeFreqEnd = Math.min(freqEnd, freqStart - 0.01);
            const safeDecay = Math.max(decay, 0.1);
            const safeVolume = Math.max(volume, 0.001);

            osc.type = "sine";
            osc.frequency.setValueAtTime(freqStart, now);
            osc.frequency.linearRampToValueAtTime(safeFreqEnd, now + safeDecay);

            gain.gain.setValueAtTime(safeVolume, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + safeDecay);

            try {
                osc.connect(gain).connect(ctx.destination);
                osc.start(now + 0.01);
                osc.stop(now + safeDecay + 0.02);
            } catch (err) {
                console.error("Oscillator error:", err);
            }

            originalTrigger();
        };

        thunderRef.current = tg;
        ctxRef.current = ctx;
    }, []);

    useEffect(() => {
        rumbleConfigRef.current = {
            freqStart: rumbleFreqStart,
            freqEnd: rumbleFreqEnd,
            volume: rumbleVolume,
            decay: rumbleDecay,
        };
    }, [rumbleFreqStart, rumbleFreqEnd, rumbleVolume, rumbleDecay]);

    const updateParam = (key: keyof ThunderParams, value: number) => {
        let newParams = { ...params, [key]: value };

        if (key === "distance") {
            thunderRef.current?.setParams(newParams);
            thunderRef.current?.setGeneratedReverb();
            setParams({ ...newParams });
        } else {
            setParams(newParams);
            thunderRef.current?.setParams(newParams);
            thunderRef.current?.setGeneratedReverb();
        }
    };

    return (
        <div className="p-4 space-y-4">
            <button
                onClick={() => thunderRef.current?.triggerThunder()}
                className="bg-blue-600 text-white px-4 py-2 rounded"
            >
                ⚡ Trigger Thunder
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label>Rumble Start Freq: {rumbleFreqStart.toFixed(1)} Hz</label>
                    <input
                        type="range"
                        min={10}
                        max={100}
                        step={0.1}
                        value={rumbleFreqStart}
                        onChange={(e) => setRumbleFreqStart(parseFloat(e.target.value))}
                    />
                </div>

                <div>
                    <label>Rumble End Freq: {rumbleFreqEnd.toFixed(1)} Hz</label>
                    <input
                        type="range"
                        min={5}
                        max={rumbleFreqStart}
                        step={0.1}
                        value={rumbleFreqEnd}
                        onChange={(e) => setRumbleFreqEnd(parseFloat(e.target.value))}
                    />
                </div>

                <div>
                    <label>Rumble Volume: {rumbleVolume.toFixed(2)}</label>
                    <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.01}
                        value={rumbleVolume}
                        onChange={(e) => setRumbleVolume(parseFloat(e.target.value))}
                    />
                </div>

                <div>
                    <label>Rumble Decay: {rumbleDecay.toFixed(1)}s</label>
                    <input
                        type="range"
                        min={0.5}
                        max={10}
                        step={0.1}
                        value={rumbleDecay}
                        onChange={(e) => setRumbleDecay(parseFloat(e.target.value))}
                    />
                </div>

                <div>
                    <label>Distance (km): {params.distance ?? "(none)"}</label>
                    <input
                        type="range"
                        min={2}
                        max={10}
                        step={0.1}
                        value={params.distance ?? 0}
                        onChange={(e) => updateParam("distance", parseFloat(e.target.value))}
                    />
                </div>

                <div>
                    <label>High-pass Filter: {params.highPassFreq} Hz</label>
                    <input
                        type="range"
                        min={0}
                        max={1000}
                        step={10}
                        value={params.highPassFreq}
                        onChange={(e) => updateParam("highPassFreq", parseFloat(e.target.value))}
                    />
                </div>

                <div>
                    <label>Crackle Amount: {params.crackleAmount}</label>
                    <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.01}
                        value={params.crackleAmount}
                        onChange={(e) => updateParam("crackleAmount", parseFloat(e.target.value))}
                    />
                </div>

                {Object.entries(params).map(([key, value]) => {
                    if (["distance", "highPassFreq", "crackleAmount"].includes(key)) return null;
                    const numericValue = value as number;
                    let min = 0, max = 5, step = 0.1;
                    if (key === "burstCount") {
                        min = 1;
                        max = 10;
                        step = 1;
                    } else if (key === "filterFreq") {
                        max = 3000;
                    } else if (key === "delayMs") {
                        max = 10000;
                    } else if (key === "panRange") {
                        max = 1;
                    } else if (key === "subLevel") {
                        max = 1;
                    }

                    return (
                        <div key={key} className="flex flex-col">
                            <label>
                                {key}: {numericValue}
                            </label>
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
