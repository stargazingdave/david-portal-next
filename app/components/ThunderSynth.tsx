'use client';

import React, { FC, useEffect, useRef, useState } from "react";
import { ThunderParams, ThunderGenerator } from "../classes/ThunderGenerator";
import { Equalizer } from "./Equalizer";
import { Knob } from "./Knob";

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

const labels: Record<keyof ThunderParams, string> = {
    volume: 'Volume',
    duration: 'Duration',
    filterFreq: 'Filter Freq',
    burstCount: 'Burst Count',
    delayMs: 'Delay (ms)',
    reverbDuration: 'Reverb Duration',
    reverbDecay: 'Reverb Decay',
    reverbWetLevel: 'Reverb Wet Level',
    subLevel: 'Sub Level',
    panRange: 'Pan Range',
    highPassFreq: 'Highpass Freq',
    crackleAmount: 'Crackle',
    eqGains: 'EQ',
    rumbleFreqStart: 'Rumble Start',
    rumbleFreqEnd: 'Rumble End',
    rumbleVolume: 'Rumble Vol',
    rumbleDecay: 'Rumble Decay',
};

const eqFrequencies = [31, 62, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];

export default function ThunderSynth() {
    const [params, setParams] = useState<ThunderParams>(defaultParams);
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
        <div className="bg-gradient-to-br from-[#1a1a1a] via-[#2c2c2c] to-[#1a1a1a] rounded-2xl shadow-[0_0_20px_#00faff40] border border-[#00faff40] text-white font-mono divide-y max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-center text-[#00faff] tracking-wide drop-shadow-[0_0_4px_#00faff] p-4">
                Thunder Synth
            </h2>

            <div className="flex flex-col items-center gap-4 p-4">
                <button
                    onClick={() => thunderRef.current?.triggerThunder()}
                    className="bg-[#00faff] text-black px-6 py-2 rounded-lg shadow-lg hover:scale-105 transition"
                >
                    ⚡ Trigger Thunder
                </button>
                <Equalizer gains={params.eqGains} freqs={eqFrequencies} onChange={updateEqGain} />
            </div>

            <div className="w-full flex flex-col gap-8 p-4">
                <h1>Rumble Controls</h1>
                <div className="flex flex-wrap justify-center gap-6 text-[#ff0]">
                    {(['rumbleFreqStart', 'rumbleFreqEnd', 'rumbleVolume', 'rumbleDecay'] as (keyof ThunderParams)[]).map((key) => (
                        <Knob
                            key={key}
                            label={<span className="text-[#0ff] drop-shadow-sm">{labels[key]}</span>}
                            value={params[key] as number}
                            onChange={(value) => updateParam(key, value)}
                            min={key === 'rumbleVolume' ? 0 : key === 'rumbleDecay' ? 0.1 : 10}
                            max={key === 'rumbleVolume' ? 1 : key === 'rumbleDecay' ? 10 : 100}
                            step={key === 'rumbleVolume' ? 0.01 : 1}
                        />
                    ))}
                </div>
            </div>

            <div className="w-full flex flex-col gap-8 p-4">
                <h1>Thunder Controls</h1>
                <div className="grid grid-cols-4 gap-6">
                    {([
                        'volume',
                        'duration',
                        'filterFreq',
                        'burstCount',
                        'delayMs',
                        'reverbDuration',
                        'reverbDecay',
                        'reverbWetLevel',
                        'subLevel',
                        'panRange',
                        'highPassFreq',
                        'crackleAmount',
                    ] as (keyof ThunderParams)[]).map((key) => (
                        <Knob
                            key={key}
                            label={<span className="text-[#0ff] drop-shadow-sm">{labels[key]}</span>}
                            value={params[key] as number}
                            onChange={(value) => updateParam(key, value)}
                            min={
                                key === 'burstCount' ? 1 :
                                    key === 'filterFreq' ? 0 :
                                        key === 'delayMs' ? 0 :
                                            key === 'highPassFreq' ? 20 :
                                                0
                            }
                            max={
                                key === 'volume' ? 2 :
                                    key === 'burstCount' ? 10 :
                                        key === 'filterFreq' ? 3000 :
                                            key === 'delayMs' ? 10000 :
                                                key === 'highPassFreq' ? 1000 :
                                                    key === 'reverbWetLevel' || key === 'subLevel' || key === 'panRange' || key === 'crackleAmount' ? 1 :
                                                        10
                            }
                            step={
                                key === 'burstCount' ? 1 :
                                    key === 'highPassFreq' ? 10 :
                                        key === 'volume' || key === 'reverbWetLevel' || key === 'subLevel' || key === 'panRange' || key === 'crackleAmount' ? 0.01 :
                                            0.1
                            }
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
