'use client';


import React, { FC, useRef, useState } from 'react';
import { NoiseDParams, NoiseDController, Range, _defaultNoiseDParams } from '../../classes/NoiseDController';
import { _defaultThunderParams, ThunderParams } from '../../classes/ThunderGenerator';
import { _defaultRainParams, NoiseType, RainParams } from '../../classes/RainGenerator';
import { Equalizer } from './components/Equalizer';
import { MarshallKnob } from './components/MarshallKnob';
import Image from 'next/image';
import { OscParam } from './types/OscParam';
import { RandParam } from './types/RandParam';
import { OscParamController } from './components/OscParamController';



export const NoiseDUI = () => {
    const audioCtxRef = useRef<AudioContext | null>(null);
    const controllerRef = useRef<NoiseDController | null>(null);
    const [isRunning, setIsRunning] = useState(false);
    const [params, setParams] = useState<NoiseDParams>(_defaultNoiseDParams);

    const handleVolumeChange = (value: number) => {
        const updated = { ...params, masterVolume: value };
        setParams(updated);
        controllerRef.current?.setMasterVolume(value);
    };

    const handleEqChange = (index: number, value: number) => {
        const updated = { ...params, eqGains: params.eqGains.map((v, i) => (i === index ? value : v)) };
        setParams(updated);
        controllerRef.current?.setEqGain(index, value);
    };

    const handleNoiseLevelChange = (value: number) => {
        const updated = { ...params, noiseLevel: value };
        setParams(updated);
        controllerRef.current?.setRainNoiseLevel(value);
    };

    const handleRainEqChange = (index: number, value: number) => {
        const updated = { ...params, rainParams: { ...params.rainParams, eqGains: params.rainParams.eqGains.map((v, i) => (i === index ? value : v)) } };
        setParams(updated);
        controllerRef.current?.setRainEqGain(index, value);
    };

    const handleNoiseTypeChange = (type: NoiseType) => {
        controllerRef.current?.setRainNoiseType(type);
        const updatedRainParams = { ...params.rainParams, noiseType: type };
        setParams({ ...params, rainParams: updatedRainParams });
    };

    const handleRainNoiseFilterFreqChange = (param: OscParam) => {
        const updatedRainParams = { ...params.rainParams, noiseFilterFreq: param };
        setParams({ ...params, rainParams: updatedRainParams });
        controllerRef.current?.setRainNoiseFilterFreq(param);
    };

    const handleRainDropDryLevelChange = (param: number) => {
        const updatedRainParams = { ...params.rainParams, dropDryLevel: param };
        setParams({ ...params, rainParams: updatedRainParams });
        controllerRef.current?.setRainDropDryLevel(param);
    };

    const handleRainDropWetLevelChange = (param: number) => {
        const updatedRainParams = { ...params.rainParams, dropWetLevel: param };
        setParams({ ...params, rainParams: updatedRainParams });
        controllerRef.current?.setRainDropWetLevel(param);
    }

    const handleRainDropReverbLevelChange = (param: OscParam) => {
        const updatedRainParams = { ...params.rainParams, dropReverbLevel: param };
        setParams({ ...params, rainParams: updatedRainParams });
        controllerRef.current?.setRainDropReverbLevel(param);
    }

    const handleRainDropPanRangeChange = (param: OscParam) => {
        const updatedRainParams = { ...params.rainParams, dropPanRange: param };
        setParams({ ...params, rainParams: updatedRainParams });
        controllerRef.current?.setRainDropPanRange(param);
    }

    const handleRainDropQChange = (param: number) => {
        const updatedRainParams = { ...params.rainParams, dropQ: param };
        setParams({ ...params, rainParams: updatedRainParams });
        controllerRef.current?.setRainDropQ(param);
    }

    const handleRainDropRateChange = (param: OscParam) => {
        const updatedRainParams = { ...params.rainParams, dropRate: param };
        setParams({ ...params, rainParams: updatedRainParams });
        controllerRef.current?.setRainDropRate(param);
    }

    const handleRainDropMinPitchChange = (param: OscParam) => {
        const updatedRainParams = { ...params.rainParams, dropMinPitch: param };
        setParams({ ...params, rainParams: updatedRainParams });
        controllerRef.current?.setRainDropMinPitch(param);
    }

    const handleRainDropMaxPitchChange = (param: OscParam) => {
        const updatedRainParams = { ...params.rainParams, dropMaxPitch: param };
        setParams({ ...params, rainParams: updatedRainParams });
        controllerRef.current?.setRainDropMaxPitch(param);
    }

    const handleRainDropDecayTimeChange = (param: OscParam) => {
        const updatedRainParams = { ...params.rainParams, dropDecayTime: param };
        setParams({ ...params, rainParams: updatedRainParams });
        controllerRef.current?.setRainDropDecayTime(param);
    }
    

    const toggle = () => {
        if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
        if (!controllerRef.current) controllerRef.current = new NoiseDController(audioCtxRef.current, params);

        if (isRunning) {
            controllerRef.current.stop();
        } else {
            controllerRef.current.start();
        }
        setIsRunning(!isRunning);
    };

    return (
        <div className="max-w-5xl px-6 py-4 bg-cover border-5 border-amber-400 rounded-lg shadow-lg shadow-amber-800/50 text-white"
            style={{ background: "url('/grill-cloth-texture.jpg') repeat" }}
        >
            <Image
                src="/images/dnoise-logo-dark.png"
                width={100}
                height={100}
                alt="NoiseD"
            />
            <div className="flex justify-center">
                <button onClick={toggle} className="bg-amber-400 dark:bg-amber-400 text-black font-bold py-2 px-4 rounded-full hover:bg-amber-500 transition duration-300 ease-in-out cursor-pointer">
                    {isRunning ? 'Stop' : 'Start'} Ambience
                </button>
            </div>
            <div className="space-y-6 mt-6">
                <Panel title='Master'>
                    <div className='w-full flex gap-2'>
                        <div className='flex flex-col gap-2'>
                            <MarshallKnob
                                label="Volume"
                                value={params.masterVolume}
                                min={0}
                                max={1}
                                step={0.01}
                                onChange={handleVolumeChange}
                            />
                            <MinMaxPair
                                label="Thunder Delay"
                                range={params.delayBetweenThunders}
                                onChange={(type, value) => { }}
                                min={1000}
                                max={30000}
                            />
                        </div>
                        <Equalizer
                            gains={params.eqGains}
                            freqs={[31, 62, 125, 250, 500, 1000, 2000, 4000, 8000, 16000]}
                            onChange={handleEqChange}
                        />
                    </div>
                </Panel>

                <Panel title='Rain Settings'>
                    <div className='flex gap-2'>
                        <MarshallKnob
                            label="Volume"
                            value={params.rainParams.volume}
                            min={0}
                            max={1}
                            step={0.01}
                            onChange={(value) => controllerRef.current?.setRainVolume(value)}
                        />
                        <Equalizer
                            gains={params.rainParams.eqGains}
                            freqs={[31, 62, 125, 250, 500, 1000, 2000, 4000, 8000, 16000]}
                            onChange={(index, value) => handleRainEqChange(index, value)}
                        />
                    </div>
                    <Section title='Noise'>
                        <div className='flex gap-2'>
                            <MarshallKnob
                                label="Noise Level"
                                value={params.rainParams.noiseLevel}
                                min={0}
                                max={1}
                                step={0.01}
                                onChange={(value) => handleNoiseLevelChange(value)}
                            />
                            <Select
                                value={params.rainParams.noiseType}
                                onChange={(value) => handleNoiseTypeChange(value as NoiseType)}
                                options={['white', 'pink']}
                            />
                            <OscParamController
                                label="Noise Filter Freq"
                                param={params.rainParams.noiseFilterFreq}
                                onChange={(p: OscParam) => handleRainNoiseFilterFreqChange(p)}
                                valueRange={[20, 8000]}
                                ampRange={[0, 2000]}
                                freqRange={[0.01, 100]}
                                step={10}
                            />
                        </div>
                    </Section>
                    <Section title='Drops'>
                        <div className='flex gap-2'>
                            <MarshallKnob
                                label="Dry Level"
                                value={params.rainParams.dropDryLevel}
                                min={0}
                                max={1}
                                step={0.01}
                                onChange={(value) => handleRainDropDryLevelChange(value)}
                            />
                            <MarshallKnob
                                label="Wet Level"
                                value={params.rainParams.dropWetLevel}
                                min={0}
                                max={1}
                                step={0.01}
                                onChange={(value) => handleRainDropWetLevelChange(value)}
                            />
                            <OscParamController
                                label="Reverb Level"
                                param={params.rainParams.dropReverbLevel}
                                onChange={(p: OscParam) => handleRainDropReverbLevelChange(p)}
                                valueRange={[0, 1]}
                                ampRange={[0, 2000]}
                                freqRange={[0.01, 100]}
                                step={0.1}
                            />
                            <OscParamController
                                label="Pan Range"
                                param={params.rainParams.dropPanRange}
                                onChange={(p) => handleRainDropPanRangeChange(p)}
                                valueRange={[20, 8000]}
                                step={10}
                            />
                            <MarshallKnob
                                label="Drop Q"
                                value={params.rainParams.dropQ}
                                onChange={(value) => handleRainDropQChange(value)}
                                min={0}
                                max={5}
                                step={0.1}
                            />
                            <OscParamController
                                label="Drop Rate"
                                param={params.rainParams.dropRate}
                                onChange={(p) => handleRainDropRateChange(p)}
                                valueRange={[20, 8000]}
                                ampRange={[0, 1000]}
                                step={10}
                            />
                            <OscParamController
                                label="Drop Min Pitch"
                                param={params.rainParams.dropMinPitch}
                                onChange={(p) => handleRainDropMinPitchChange(p)}
                                valueRange={[20, 8000]}
                                ampRange={[0, 1000]}
                                step={10}
                            />
                            <OscParamController
                                label="Drop Max Pitch"
                                param={params.rainParams.dropMaxPitch}
                                onChange={(p) => handleRainDropMaxPitchChange(p)}
                                valueRange={[20, 8000]}
                                ampRange={[0, 1000]}
                                step={10}
                            />
                            <OscParamController
                                label="Drop Decay Time"
                                param={params.rainParams.dropDecayTime}
                                onChange={(p) => handleRainDropDecayTimeChange(p)}
                                valueRange={[0.005, 1]}
                                step={0.001}
                            />
                        </div>
                    </Section>
                </Panel>

                <Panel title='Thunder Settings'>

                </Panel>
            </div>
        </div>
    );
};

const Panel: FC<{
    title: string,
    children?: React.ReactNode
}> = ({ title, children }) => {
    return <div className="flex flex-col bg-neutral-800 border border-amber-400 rounded p-2 shadow-inner gap-2">
        <h2 className="text-amber-400 text-xl font-semibold">{title}</h2>
        {children}
    </div>;
}

const Section: FC<{
    title: string,
    children?: React.ReactNode
}> = ({ title, children }) => {
    return <div className="flex flex-col h-fit bg-neutral-900 border border-neutral-900 rounded p-2 shadow-neutral-700 gap-2">
        <h2 className="flex flex-col text-amber-400 text-lg font-semibold">{title}</h2>
        {children}
    </div>;
}

const Select: FC<{
    value: string;
    onChange: (value: string) => void;
    options: string[];
}> = ({ value, onChange, options }) => {
    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="bg-neutral-800 text-amber-400 border border-amber-400 rounded p-2 shadow-inner hover:shadow-[0_0_5px_#00faff] transition"
        >
            {options.map((option) => (
                <option key={option} value={option} className="text-black">
                    {option}
                </option>
            ))}
        </select>
    );
}

const MinMaxPair = ({
    label,
    range,
    onChange,
    min = 0,
    max = 1,
    step = 0.01,
}: {
    label: string;
    range: Range<number>;
    onChange: (type: 'min' | 'max', value: number) => void;
    min?: number;
    max?: number;
    step?: number;
}) => (
    <div className="flex flex-col items-center bg-[#1a1a1a] p-4 rounded-lg shadow-inner border border-[#d4af37]/30 space-y-2">
        <label className="font-medium text-[#d4af37] text-center">{label}</label>
        <div className="flex gap-4">
            <MarshallKnob
                label="Min"
                value={range.min}
                min={min}
                max={max}
                step={step}
                onChange={(v) => onChange('min', v)}
            />
            <MarshallKnob
                label="Max"
                value={range.max}
                min={min}
                max={max}
                step={step}
                onChange={(v) => onChange('max', v)}
            />
        </div>
    </div>
);
