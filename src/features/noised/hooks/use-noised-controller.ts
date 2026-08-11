"use client";

import { useEffect, useRef, useState } from "react";
import { NoiseDController } from "noised";
import type { NoiseDParams, NoiseType, Range, ThunderParams } from "noised";
import type { OscParam } from "../components/synth/types/osc-param";
import {
    cloneNoisedParams,
    initialNoisedParams,
    type NoisedPreset,
    type NoisedPresetId,
} from "../model/noised-params";

type RangeBound = keyof Range<number>;

export interface NoisedActions {
    setMasterVolume: (value: number) => void;
    setThunderDelay: (bound: RangeBound, value: number) => void;
    setMasterEqGain: (index: number, value: number) => void;
    setRainVolume: (value: number) => void;
    setRainNoiseLevel: (value: number) => void;
    setRainEqGain: (index: number, value: number) => void;
    setRainNoiseType: (value: NoiseType) => void;
    setRainNoiseFilterFrequency: (value: OscParam) => void;
    setRainDropDryLevel: (value: number) => void;
    setRainDropWetLevel: (value: number) => void;
    setRainDropReverbLevel: (value: OscParam) => void;
    setRainDropPanRange: (value: OscParam) => void;
    setRainDropQ: (value: number) => void;
    setRainDropRate: (value: number) => void;
    setRainDropMinimumPitch: (value: OscParam) => void;
    setRainDropMaximumPitch: (value: OscParam) => void;
    setRainDropDecayTime: (value: number) => void;
    updateThunder: (value: Partial<ThunderParams>) => void;
}

export function useNoisedController() {
    const [params, setParams] = useState<NoiseDParams>(() => cloneNoisedParams(initialNoisedParams));
    const paramsRef = useRef<NoiseDParams>(params);
    const audioContextRef = useRef<AudioContext | null>(null);
    const controllerRef = useRef<NoiseDController | null>(null);
    const [isRunning, setIsRunning] = useState(false);
    const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
    const [activePresetId, setActivePresetId] = useState<NoisedPresetId | null>("default");

    const commitParams = (update: (current: NoiseDParams) => NoiseDParams) => {
        const next = update(paramsRef.current);
        paramsRef.current = next;
        setParams(next);
        setActivePresetId(null);
    };
    const updateRain = (update: Partial<NoiseDParams["rainParams"]>) => {
        commitParams((current) => ({
            ...current,
            rainParams: { ...current.rainParams, ...update },
        }));
    };

    useEffect(() => () => {
        controllerRef.current?.destroy();
        controllerRef.current = null;
        if (audioContextRef.current) void audioContextRef.current.close();
        audioContextRef.current = null;
    }, []);

    const loadPreset = (preset: NoisedPreset) => {
        const next = cloneNoisedParams(preset.params);
        paramsRef.current = next;
        setParams(next);
        setActivePresetId(preset.id);

        if (!controllerRef.current || !audioContextRef.current) return;

        controllerRef.current.destroy();
        controllerRef.current = new NoiseDController(audioContextRef.current, next);
        setAnalyser(controllerRef.current.getAnalyser());
        controllerRef.current.start();
    };

    const actions: NoisedActions = {
        setMasterVolume(value) {
            commitParams((current) => ({ ...current, masterVolume: value }));
            controllerRef.current?.setMasterVolume(value);
        },
        setThunderDelay(bound, value) {
            const delay = { ...paramsRef.current.delayBetweenThunders, [bound]: value };
            commitParams((current) => ({ ...current, delayBetweenThunders: delay }));
            controllerRef.current?.setDelayBetweenThunders(delay);
        },
        setMasterEqGain(index, value) {
            commitParams((current) => ({
                ...current,
                eqGains: current.eqGains.map((gain, gainIndex) => gainIndex === index ? value : gain),
            }));
            controllerRef.current?.setEqGain(index, value);
        },
        setRainVolume(value) {
            updateRain({ volume: value });
            controllerRef.current?.setRainVolume(value);
        },
        setRainNoiseLevel(value) {
            updateRain({ noiseLevel: value });
            controllerRef.current?.setRainNoiseLevel(value);
        },
        setRainEqGain(index, value) {
            updateRain({
                eqGains: paramsRef.current.rainParams.eqGains.map((gain, gainIndex) => gainIndex === index ? value : gain),
            });
            controllerRef.current?.setRainEqGain(index, value);
        },
        setRainNoiseType(value) {
            updateRain({ noiseType: value });
            controllerRef.current?.setRainNoiseType(value);
        },
        setRainNoiseFilterFrequency(value) {
            updateRain({ noiseFilterFreq: value });
            controllerRef.current?.setRainNoiseFilterFreq(value);
        },
        setRainDropDryLevel(value) {
            updateRain({ dropDryLevel: value });
            controllerRef.current?.setRainDropDryLevel(value);
        },
        setRainDropWetLevel(value) {
            updateRain({ dropWetLevel: value });
            controllerRef.current?.setRainDropWetLevel(value);
        },
        setRainDropReverbLevel(value) {
            updateRain({ dropReverbLevel: value });
            controllerRef.current?.setRainDropReverbLevel(value);
        },
        setRainDropPanRange(value) {
            updateRain({ dropPanRange: value });
            controllerRef.current?.setRainDropPanRange(value);
        },
        setRainDropQ(value) {
            updateRain({ dropQ: value });
            controllerRef.current?.setRainDropQ(value);
        },
        setRainDropRate(value) {
            updateRain({ dropRate: value });
            controllerRef.current?.setRainDropRate(value);
        },
        setRainDropMinimumPitch(value) {
            updateRain({ dropMinPitch: value });
            controllerRef.current?.setRainDropMinPitch(value);
        },
        setRainDropMaximumPitch(value) {
            updateRain({ dropMaxPitch: value });
            controllerRef.current?.setRainDropMaxPitch(value);
        },
        setRainDropDecayTime(value) {
            updateRain({ dropDecayTime: value });
            controllerRef.current?.setRainDropDecayTime(value);
        },
        updateThunder(value) {
            commitParams((current) => ({
                ...current,
                thunderParams: { ...current.thunderParams, ...value },
            }));
            controllerRef.current?.setThunderParams(value);
        },
    };

    const toggle = async () => {
        if (isRunning) {
            controllerRef.current?.destroy();
            controllerRef.current = null;
            setAnalyser(null);
            setIsRunning(false);
            return;
        }

        audioContextRef.current ??= new AudioContext();
        if (audioContextRef.current.state === "suspended") await audioContextRef.current.resume();

        controllerRef.current = new NoiseDController(audioContextRef.current, paramsRef.current);
        setAnalyser(controllerRef.current.getAnalyser());
        controllerRef.current.start();
        setIsRunning(true);
    };

    return { actions, activePresetId, analyser, isRunning, loadPreset, params, toggle };
}
