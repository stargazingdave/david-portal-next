'use client';

import React, { useRef, useState } from "react";
import { AmbientSettings, WeatherAmbienceController, Range } from "../classes/WeatherAmbienceController";
import { ThunderParams } from "../classes/ThunderGenerator";
import { NoiseType } from "../classes/RainGenerator";
import { Equalizer } from "./Equalizer";

const defaultSettings: AmbientSettings = {
    rainIntensity: { min: 0.2, max: 0.8 },
    rainDropRate: { min: 0.3, max: 0.7 },
    rainMinPitch: { min: 300, max: 1000 },
    rainMaxPitch: { min: 1000, max: 3000 },
    rainDecayTime: { min: 0.01, max: 0.2 },
    rainDryLevel: { min: 0, max: 0.5 },
    rainWetLevel: { min: 0.1, max: 0.5 },
    rainDropDryLevel: { min: 0.1, max: 0.5 },
    rainPanRange: { min: 0.2, max: 1 },
    rainDropQ: { min: 5, max: 15 },
    rainNoiseType: 'pink',
    thunderDelay: { min: 5000, max: 15000 },
    masterVolume: 0.7,
    eqGains: new Array(10).fill(0),
    thunderParams: {
        duration: { min: 1, max: 3 },
        volume: { min: 0.4, max: 1 },
        burstCount: { min: 1, max: 4 },
        filterFreq: { min: 500, max: 2000 },
        reverbDuration: { min: 1, max: 3 },
        reverbDecay: { min: 1, max: 4 },
        reverbWetLevel: { min: 0.2, max: 0.6 },
        subLevel: { min: 0.05, max: 0.2 },
        panRange: { min: 0.2, max: 1 },
        crackleAmount: { min: 0.5, max: 1 },
        highPassFreq: { min: 10, max: 200 },
    }
};

export const WeatherSynth = () => {
    const audioCtxRef = useRef<AudioContext | null>(null);
    const controllerRef = useRef<WeatherAmbienceController | null>(null);
    const [isRunning, setIsRunning] = useState(false);
    const [settings, setSettings] = useState<AmbientSettings>(defaultSettings);

    const handleRangeChange = (key: keyof AmbientSettings | keyof ThunderParams, type: 'min' | 'max', value: number) => {
        const clone = structuredClone(settings);
        if (key in clone.thunderParams) {
            (clone.thunderParams[key as keyof ThunderParams] as Range)[type] = value;
        } else if (key in clone) {
            (clone as any)[key][type] = value;
        }
        setSettings(clone);
        controllerRef.current?.updateSettings(clone);
    };

    const handleVolumeChange = (value: number) => {
        const updated = { ...settings, masterVolume: value };
        setSettings(updated);
        controllerRef.current?.setMasterVolume(value);
    };

    const handleEqChange = (index: number, value: number) => {
        const newGains = [...settings.eqGains];
        newGains[index] = value;
        setSettings((prev) => ({ ...prev, eqGains: newGains }));
        controllerRef.current?.updateEqGains(newGains);
    };

    const toggle = () => {
        if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
        if (!controllerRef.current) controllerRef.current = new WeatherAmbienceController(audioCtxRef.current, settings);

        if (isRunning) {
            controllerRef.current.stop();
        } else {
            controllerRef.current.start();
        }
        setIsRunning(!isRunning);
    };

    return (
        <div className="bg-gradient-to-br from-[#1a1a1a] via-[#2c2c2c] to-[#1a1a1a] rounded-2xl shadow-[0_0_20px_#00faff40] border border-[#00faff40] text-white font-mono divide-y max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-center text-[#00faff] tracking-wide drop-shadow-[0_0_4px_#00faff] p-4">
                Weather Synth
            </h2>
            <div className="p-6 space-y-4">
                <button onClick={toggle} className="px-6 py-2 rounded bg-[#00faff] text-black font-bold shadow hover:scale-105 transition">
                    {isRunning ? "Stop" : "Start"} Ambience
                </button>

                <h2 className="text-xl font-semibold">Master Volume</h2>
                <input type="range" min={0} max={1} step={0.01} value={settings.masterVolume} onChange={(e) => handleVolumeChange(parseFloat(e.target.value))} />

                <h2 className="text-xl font-semibold">Thunder Delay (ms)</h2>
                <RangeSlider label="Delay" range={settings.thunderDelay} onChange={(type, value) => handleRangeChange("thunderDelay", type, value)} min={1000} max={30000} />

                <h2 className="text-xl font-semibold">Rain Settings</h2>
                {renderRangeSettings(settings, handleRangeChange)}

                <div className="flex flex-col">
                    <label className="font-medium">Noise Type</label>
                    <select
                        value={settings.rainNoiseType}
                        onChange={(e) => setSettings((prev) => ({ ...prev, rainNoiseType: e.target.value as NoiseType }))}
                        className="border p-1 rounded text-black"
                    >
                        <option value="pink">Pink</option>
                        <option value="white">White</option>
                    </select>
                </div>

                <h2 className="text-xl font-semibold">Thunder Parameters</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(settings.thunderParams).map(([key, range]) => (
                        <RangeSlider
                            key={key}
                            label={key}
                            range={range as Range<number>}
                            onChange={(type, value) => handleRangeChange(key as keyof ThunderParams, type, value)}
                            min={0}
                            max={typeof range?.max === 'number' ? Math.max(1, range.max * 1.5) : 10}
                            step={0.01}
                        />
                    ))}
                </div>

                <h2 className="text-xl font-semibold">Thunder Equalizer</h2>
                <Equalizer
                    gains={settings.eqGains}
                    freqs={[31, 62, 125, 250, 500, 1000, 2000, 4000, 8000, 16000]}
                    onChange={handleEqChange}
                />
            </div>
        </div>
    );
};

const renderRangeSettings = (settings: AmbientSettings, onChange: (key: keyof AmbientSettings, type: 'min' | 'max', value: number) => void) => (
    <>
        {(["rainIntensity", "rainDropRate", "rainMinPitch", "rainMaxPitch", "rainDecayTime", "rainDryLevel", "rainWetLevel", "rainDropDryLevel", "rainPanRange", "rainDropQ"] as (keyof AmbientSettings)[]).map(key => (
            <RangeSlider
                key={key}
                label={key.replace(/([A-Z])/g, ' $1')}
                range={settings[key] as Range<number>}
                onChange={(type, value) => onChange(key, type, value)}
                min={0}
                max={1}
                step={0.01}
            />
        ))}
    </>
);

const RangeSlider = ({ label, range, onChange, min = 0, max = 1, step = 0.01 }: {
    label: string;
    range: Range<number>;
    onChange: (type: 'min' | 'max', value: number) => void;
    min?: number;
    max?: number;
    step?: number;
}) => (
    <div className="flex flex-col space-y-1">
        <label className="font-medium text-[#0ff]">{label}</label>
        <div className="flex space-x-2 items-center">
            <span>Min</span>
            <input type="range" min={min} max={max} step={step} value={range.min} onChange={(e) => onChange("min", parseFloat(e.target.value))} className="w-full" />
            <span>{range.min}</span>
        </div>
        <div className="flex space-x-2 items-center">
            <span>Max</span>
            <input type="range" min={min} max={max} step={step} value={range.max} onChange={(e) => onChange("max", parseFloat(e.target.value))} className="w-full" />
            <span>{range.max}</span>
        </div>
    </div>
);
