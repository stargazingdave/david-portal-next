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

    const handleRainChange = (key: keyof RainParams, value: number | number[] | RandParam) => {
        const updatedRainParams: RainParams & { on: boolean } = { ...params.rainParams, [key]: value };
        setParams({ ...params, rainParams: updatedRainParams });
        controllerRef.current?.updateRainParams(updatedRainParams);
    }

    const handleThunderChange = (key: keyof ThunderParams, value: number | RandParam) => {
        const updatedThunderParams: ThunderParams & { on: boolean } = { ...params.thunderParams, [key]: value };
        setParams({ ...params, thunderParams: updatedThunderParams });
        controllerRef.current?.updateThunderParams(updatedThunderParams);
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
                            onChange={(index, value) => handleRainChange('eqGains', params.rainParams.eqGains.map((v, i) => (i === index ? value : v)))}
                        />
                    </div>
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
    return <div className="bg-neutral-900/90 border border-amber-400 rounded p-2 shadow-inner">
        <h2 className="panel-header">{title}</h2>
        {children}
    </div>;
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
