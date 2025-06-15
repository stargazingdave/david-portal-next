'use client';


import React, { FC, useEffect, useRef, useState } from 'react';
import { Equalizer } from './components/Equalizer';
import { CustomKnob as Knob } from './components/CustomKnob';
import Image from 'next/image';
import { OscParam } from './types/OscParam';
import { OscParamController } from './components/OscParamController';
import { RandParamController } from './components/RandParamController';
import { IoChevronDown, IoChevronUp, IoDownload, IoPlay, IoStop } from 'react-icons/io5';
import { Visualization } from '../Visualization';
import { _defaultNoiseDParams, NoiseDController, NoiseDParams, NoiseType, ThunderParams, Range } from 'noised';
import { SineWave } from './components/demos/SineWave';
import { RandomBar } from './components/demos/RandomBar';
import { RandParam } from './types/RandParam';
import { Tooltip } from '../Tooltip';
import { useTheme } from '@/app/contexts/ThemeProvider';

export const NoiseDUI = () => {
    const { theme } = useTheme();
    const audioCtxRef = useRef<AudioContext | null>(null);
    const controllerRef = useRef<NoiseDController | null>(null);
    const [isRunning, setIsRunning] = useState(false);
    const [params, setParams] = useState<NoiseDParams>(_defaultNoiseDParams);
    const [analyserNode, setAnalyserNode] = useState<AnalyserNode | null>(null);

    useEffect(() => {
        return () => {
            if (controllerRef.current) {
                controllerRef.current.stop();
                controllerRef.current = null;
            }
            if (audioCtxRef.current) {
                audioCtxRef.current.close();
                audioCtxRef.current = null;
            }
        };
    }, []);

    const handleVolumeChange = (value: number) => {
        const updated = { ...params, masterVolume: value };
        setParams(updated);
        controllerRef.current?.setMasterVolume(value);
    };

    const handleDelayBetweenThundersChange = (type: 'min' | 'max', value: number) => {
        const updated = { ...params, delayBetweenThunders: { ...params.delayBetweenThunders, [type]: value } };
        setParams(updated);
        controllerRef.current?.setDelayBetweenThunders(updated.delayBetweenThunders);
    };

    const handleEqChange = (index: number, value: number) => {
        const updated = { ...params, eqGains: params.eqGains.map((v, i) => (i === index ? value : v)) };
        setParams(updated);
        controllerRef.current?.setEqGain(index, value);
    };

    const handleRainVolumeChange = (value: number) => {
        const updated = { ...params, rainParams: { ...params.rainParams, volume: value } };
        setParams(updated);
        controllerRef.current?.setRainVolume(value);
    };

    const handleNoiseLevelChange = (value: number) => {
        const updated = { ...params, rainParams: { ...params.rainParams, noiseLevel: value } };
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

    const handleRainDropRateChange = (param: number) => {
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

    const handleRainDropDecayTimeChange = (param: number) => {
        const updatedRainParams = { ...params.rainParams, dropDecayTime: param };
        setParams({ ...params, rainParams: updatedRainParams });
        controllerRef.current?.setRainDropDecayTime(param);
    }

    const handleThunderParamChange = (newParam: Partial<ThunderParams>) => {
        const updated = { ...params, thunderParams: { ...params.thunderParams, ...newParam } };
        setParams(updated);
        controllerRef.current?.setThunderParams(newParam);
    }

    const toggle = () => {
        if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();

        if (!controllerRef.current) {
            controllerRef.current = new NoiseDController(audioCtxRef.current, params);
            setAnalyserNode(controllerRef.current.getAnalyser()); // 👈 hook up the visualizer
        }

        if (isRunning) {
            controllerRef.current.stop();
        } else {
            controllerRef.current.start();
        }
        setIsRunning(!isRunning);
    };

    const handleDownloadParams = () => {
        if (!controllerRef.current) return;
        const json = controllerRef.current.exportParamsAsJSON();
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'noised-params.json';
        a.click();

        URL.revokeObjectURL(url);
    };

    const equalizerColors = theme === 'dark'
        ? {
            background: "#1a1a1a",
            Hz: "#fff",
            dB: "#fff",
        }
        : {
            background: "#fff",
            Hz: "#000",
            dB: "#000",
        };

    return <div className="w-full">
        <div className="relative flex flex-wrap items-center justify-around mb-4">
            <div className="absolute top-0 left-0 w-full h-full opacity-50 rounded-lg z-0 pointer-events-none">
                <Visualization
                    analyserRef={{ current: analyserNode }}
                    isPlaying={isRunning}
                    type="waveform"
                    barCount={48}
                />
            </div>

            {/* Foreground elements */}
            <div className="relative w-72 h-28 flex-shrink-0 z-10">
                <Image
                    src="/images/noised-logo-full.png"
                    alt="NoiseD Logo"
                    fill
                    className="object-contain object-bottom"
                />
            </div>

            <button
                onClick={toggle}
                className="h-fit flex text-white font-bold py-2 px-4 rounded-full bg-amber-500 hover:bg-amber-300 transition duration-300 ease-in-out cursor-pointer z-10"
                title={isRunning ? "Stop" : "Start"}
            >
                {isRunning ? "Silence!" : "Start the Noise!"}
            </button>
            <Tooltip content="Download a JSON file with the current parameters" placement="top">
                <button
                    onClick={handleDownloadParams}
                    className="text-amber-500 font-bold p-4 rounded-full hover:text-amber-300 transition duration-300 ease-in-out cursor-pointer z-10"
                    title="Download Params"
                >
                    <IoDownload size={50} />
                </button>
            </Tooltip>
        </div>
        <div className="space-y-6">
            <Panel title="Instructions" openInit={true}>
                <Instructions />
            </Panel>
            <Panel title='Master'>
                <div className='flex flex-wrap items-center justify-around gap-4'>
                    <Knob
                        label="Volume"
                        value={params.masterVolume}
                        min={0}
                        max={1}
                        step={0.01}
                        onChange={handleVolumeChange}
                    />
                    <MinMaxPair
                        label="Delay Between Thunders"
                        range={params.delayBetweenThunders}
                        onChange={(type, value) => handleDelayBetweenThundersChange(type, value)}
                        min={1000}
                        max={30000}
                    />
                    <div className='w-82 sm:w-[420px]'>
                        <Equalizer
                            gains={params.eqGains}
                            freqs={[31, 62, 125, 250, 500, 1000, 2000, 4000, 8000, 16000]}
                            onChange={handleEqChange}
                            rotateLabels={-25}
                            colors={equalizerColors}
                            height={200}
                        />
                    </div>
                </div>
            </Panel>

            <Panel title='Rain Settings'>
                <div className='relative flex flex-wrap items-start w-full min-w-0"'>
                    <ControlContainer label="Rain Volume" width="150px" height="260px">
                        <Knob
                            label="Volume"
                            value={params.rainParams.volume}
                            min={0}
                            max={1}
                            step={0.01}
                            onChange={(value) => handleRainVolumeChange(value)}
                        />
                    </ControlContainer>
                    <ControlContainer label="Rain EQ" width="465px" height="260px">
                        <Equalizer
                            gains={params.rainParams.eqGains}
                            freqs={[31, 62, 125, 250, 500, 1000, 2000, 4000, 8000, 16000]}
                            onChange={(index, value) => handleRainEqChange(index, value)}
                            rotateLabels={-25}
                            colors={equalizerColors}
                        />
                    </ControlContainer>
                    <ControlContainer label="Background Noise" width="480px" height="260px">
                        <div className='w-full h-full flex items-center justify-around'>
                            <div className='h-full flex flex-col grow items-center justify-around p-2'>
                                <div className='w-full flex flex-col gap-2'>
                                    <label className="text-sm font-bold">Noise Type</label>
                                    <Select
                                        value={params.rainParams.noiseType}
                                        onChange={(value) => handleNoiseTypeChange(value as NoiseType)}
                                        options={['white', 'pink']}
                                    />
                                </div>
                                <Knob
                                    label="Noise Level"
                                    size={80}
                                    value={params.rainParams.noiseLevel}
                                    min={0}
                                    max={1}
                                    step={0.01}
                                    onChange={(value) => handleNoiseLevelChange(value)}
                                />
                            </div>
                            <XSeparator />
                            <div className='h-full flex flex-col grow items-center justify-center'>
                                <OscParamController
                                    label="Noise Filter Freq"
                                    param={params.rainParams.noiseFilterFreq}
                                    onChange={(p: OscParam) => handleRainNoiseFilterFreqChange(p)}
                                    valueRange={[20, 8000]}
                                    ampRange={[0, 2000]}
                                    freqRange={[0, 1]}
                                    step={0.01}
                                />
                            </div>
                        </div>
                    </ControlContainer>
                    <ControlContainer label="Drops Level" width="300px" height="260px">
                        <div className='h-full w-full flex items-center justify-around'>
                            <Knob
                                label="Dry Level"
                                value={params.rainParams.dropDryLevel}
                                min={0}
                                max={1}
                                step={0.01}
                                onChange={(value) => handleRainDropDryLevelChange(value)}
                            />
                            <XSeparator />
                            <Knob
                                label="Wet Level"
                                value={params.rainParams.dropWetLevel}
                                min={0}
                                max={1}
                                step={0.01}
                                onChange={(value) => handleRainDropWetLevelChange(value)}
                            />
                        </div>
                    </ControlContainer>
                    <ControlContainer label="Drops Resonance" width="160px" height="260px">
                        <Knob
                            label="Q"
                            value={params.rainParams.dropQ}
                            onChange={(value) => handleRainDropQChange(value)}
                            min={0}
                            max={5}
                            step={0.1}
                        />
                    </ControlContainer>
                    <ControlContainer label="Drops Rate" width="150px" height="260px">
                        <Knob
                            label="Rate"
                            value={params.rainParams.dropRate}
                            onChange={(value) => handleRainDropRateChange(value)}
                            min={0.1}
                            max={200}
                            step={0.1}
                        />
                    </ControlContainer>
                    <ControlContainer label="Drops Decay" width="150px" height="260px">
                        <Knob
                            label="Decay Time"
                            value={params.rainParams.dropDecayTime}
                            onChange={(value) => handleRainDropDecayTimeChange(value)}
                            min={0.01}
                            max={1}
                            step={0.01}
                        />
                    </ControlContainer>
                    <ControlContainer label="Reverb" width="300px" height="260px">
                        <OscParamController
                            label="Reverb Level"
                            param={params.rainParams.dropReverbLevel}
                            onChange={(p: OscParam) => handleRainDropReverbLevelChange(p)}
                            valueRange={[0, 1]}
                            ampRange={[0, 1]}
                            freqRange={[0, 1]}
                            step={0.01}
                        />
                    </ControlContainer>
                    <ControlContainer label="Drops Panning" width="300px" height="260px">
                        <OscParamController
                            label="Pan Range"
                            param={params.rainParams.dropPanRange}
                            onChange={(p) => handleRainDropPanRangeChange(p)}
                            valueRange={[0, 1]}
                            ampRange={[0, 1]}
                            freqRange={[0, 5]}
                            step={0.01}
                        />
                    </ControlContainer>
                    <ControlContainer label="Drops Pitch" width="600px" height="260px">
                        <div className='h-full w-full flex items-center justify-around'>
                            <OscParamController
                                label="Drop Min Pitch"
                                param={params.rainParams.dropMinPitch}
                                onChange={(p) => handleRainDropMinPitchChange(p)}
                                valueRange={[20, 8000]}
                                ampRange={[0, 1000]}
                                step={10}
                            />
                            <XSeparator />
                            <OscParamController
                                label="Drop Max Pitch"
                                param={params.rainParams.dropMaxPitch}
                                onChange={(p) => handleRainDropMaxPitchChange(p)}
                                valueRange={[20, 8000]}
                                ampRange={[0, 1000]}
                                step={1}
                            />
                        </div>
                    </ControlContainer>
                </div>
            </Panel>

            <Panel title='Thunder Settings'>
                <div className='relative flex flex-wrap items-start w-full min-w-0"'>
                    <ControlContainer label="Thunder Volume" width="250px" height="260px">
                        <RandParamController
                            label="Volume"
                            param={params.thunderParams.volume}
                            onChange={(p) => handleThunderParamChange({ volume: p })}
                            valueRange={[0, 1]}
                            distRange={[0, 0.5]}
                            step={0.01}
                        />
                    </ControlContainer>
                    <ControlContainer label="Thunder EQ" width="465px" height="260px">
                        <Equalizer
                            gains={params.thunderParams.eqGains}
                            freqs={[31, 62, 125, 250, 500, 1000, 2000, 4000, 8000, 16000]}
                            onChange={(index, value) => handleThunderParamChange({ eqGains: params.thunderParams.eqGains.map((v, i) => (i === index ? value : v)) })}
                            rotateLabels={-25}
                            colors={equalizerColors}
                        />
                    </ControlContainer>
                    <ControlContainer label="Thunder Duration" width="250px" height="260px">
                        <RandParamController
                            label="Duration"
                            param={params.thunderParams.duration}
                            onChange={(p) => handleThunderParamChange({ duration: p })}
                            valueRange={[0, 10]}
                            distRange={[0, 5]}
                            step={0.01}
                        />
                    </ControlContainer>
                    <ControlContainer label="Panning" width="250px" height="260px">
                        <RandParamController
                            label="Pan Range"
                            param={params.thunderParams.panRange}
                            onChange={(p) => handleThunderParamChange({ panRange: p })}
                            valueRange={[0, 1]}
                            distRange={[0, 0.5]}
                            step={0.01}
                        />
                    </ControlContainer>
                    <ControlContainer label="Thunder Filter" width="250px" height="260px">
                        <RandParamController
                            label="Filter Freq"
                            param={params.thunderParams.filterFreq}
                            onChange={(p) => handleThunderParamChange({ filterFreq: p })}
                            valueRange={[0, 3000]}
                            distRange={[0, 1000]}
                            step={0.01}
                        />
                    </ControlContainer>
                    <ControlContainer label="Bursts" width="250px" height="260px">
                        <RandParamController
                            label="Burst Count"
                            param={params.thunderParams.burstCount}
                            onChange={(p) => handleThunderParamChange({ burstCount: p })}
                            valueRange={[1, 10]}
                            distRange={[0, 5]}
                            step={1}
                        />
                    </ControlContainer>
                    <ControlContainer label="Reverb" width="750px" height="260px">
                        <div className='h-full w-full flex items-center justify-around'>
                            <RandParamController
                                label="Reverb Duration"
                                param={params.thunderParams.reverbDuration}
                                onChange={(p) => handleThunderParamChange({ reverbDuration: p })}
                                valueRange={[0, 10]}
                                distRange={[0, 5]}
                                step={0.01}
                            />
                            <XSeparator />
                            <RandParamController
                                label="Reverb Decay"
                                param={params.thunderParams.reverbDecay}
                                onChange={(p) => handleThunderParamChange({ reverbDecay: p })}
                                valueRange={[0, 10]}
                                distRange={[0, 5]}
                                step={0.01}
                            />
                            <XSeparator />
                            <RandParamController
                                label="Reverb Wet Level"
                                param={params.thunderParams.reverbWetLevel}
                                onChange={(p) => handleThunderParamChange({ reverbWetLevel: p })}
                                valueRange={[0, 1]}
                                distRange={[0, 0.5]}
                                step={0.01}
                            />
                        </div>
                    </ControlContainer>
                    <ControlContainer label="Filter" width="250px" height="260px">
                        <RandParamController
                            label="High Pass Freq"
                            param={params.thunderParams.highPassFreq}
                            onChange={(p) => handleThunderParamChange({ highPassFreq: p })}
                            valueRange={[20, 1000]}
                            distRange={[0, 500]}
                            step={10}
                        />
                    </ControlContainer>
                    <ControlContainer label="Crackle" width="250px" height="260px">
                        <RandParamController
                            label="Crackle Amount"
                            param={params.thunderParams.crackleAmount}
                            onChange={(p) => handleThunderParamChange({ crackleAmount: p })}
                            valueRange={[0, 1]}
                            distRange={[0, 0.5]}
                            step={0.01}
                        />
                    </ControlContainer>
                    <ControlContainer label="Rumble" width="1000px" height="260px">
                        <div className='h-full w-full flex items-center justify-around'>
                            <RandParamController
                                label="Rumble Freq Start"
                                param={params.thunderParams.rumbleFreqStart}
                                onChange={(p) => handleThunderParamChange({ rumbleFreqStart: p })}
                                valueRange={[20, 100]}
                                distRange={[0, 10]}
                                step={1}
                            />
                            <XSeparator />
                            <RandParamController
                                label="Rumble Freq End"
                                param={params.thunderParams.rumbleFreqEnd}
                                onChange={(p) => handleThunderParamChange({ rumbleFreqEnd: p })}
                                valueRange={[20, 1000]}
                                distRange={[0, 10]}
                                step={1}
                            />
                            <XSeparator />
                            <RandParamController
                                label="Rumble Volume"
                                param={params.thunderParams.rumbleVolume}
                                onChange={(p) => handleThunderParamChange({ rumbleVolume: p })}
                                valueRange={[0, 1]}
                                distRange={[0, 0.5]}
                                step={0.01}
                            />
                            <XSeparator />
                            <RandParamController
                                label="Rumble Decay"
                                param={params.thunderParams.rumbleDecay}
                                onChange={(p) => handleThunderParamChange({ rumbleDecay: p })}
                                valueRange={[0, 10]}
                                distRange={[0, 5]}
                                step={0.01}
                            />
                        </div>
                    </ControlContainer>
                </div>
            </Panel>
        </div>
    </div>;
};

const Panel: FC<{
    title: string,
    children?: React.ReactNode,
    openInit?: boolean
}> = ({ title, children, openInit }) => {
    const [open, setOpen] = useState(openInit || false);

    return <div
        className="flex flex-col font-[courier] border"
        style={{
            backgroundColor: '#77777777',
            backdropFilter: 'blur(10px)',
        }}
    >
        <div
            className="text-xl font-semibold p-2"
            style={{
                color: '#de006b',
            }}
        >
            <div className='flex items-center gap-2'>
                <span>{title}</span>
                <button
                    onClick={() => setOpen(!open)}
                    className="font-bold p-2 cursor-pointer"
                    style={{
                        color: '#de006b',
                    }}
                    title={(open ? "Hide " : "Show ") + title}
                >
                    {open ? <IoChevronUp size={20} /> : <IoChevronDown size={20} />}
                </button>
            </div>
        </div>
        {open && children}
    </div>;
}

const Section: FC<{
    title: string,
    children?: React.ReactNode
}> = ({ title, children }) => {
    return <div
        className="h-full flex flex-col grow p-4 gap-2 font-[courier]"
        style={{
            // backgroundColor: '#77777777',
            borderRadius: '12px',

        }}
    >
        <h2 className="flex flex-col text-lg font-semibold">
            {title}
        </h2>
        {children}
    </div >;
}

const ControlContainer: FC<{
    label: string;
    width?: string;
    height: string;
    children?: React.ReactNode;
}> = ({ label, children, width, height }) => {
    return (
        <div
            className="relative flex flex-col grow items-center shadow-inner border border-neutral-500/30 overflow-hidden"
            style={{
                flexBasis: width, // Suggested width
                maxWidth: "100%", // Never overflow parent
                height
            }}
        >
            <label className="w-full p-1 font-medium bg-neutral-600 text-white">{label}</label>
            <div className="w-full h-full flex items-center justify-center overflow-x-auto">
                {children}
            </div>
        </div>
    );
};

const Select: FC<{
    value: string;
    onChange: (value: string) => void;
    options: string[];
}> = ({ value, onChange, options }) => {
    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="bg-pink-500/50 border border-neutral-500 rounded p-2 shadow-inner hover:shadow-[0_0_5px_#00faff] transition cursor-pointer w-full"
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
            <Knob
                label="Min"
                value={range.min}
                min={min}
                max={max}
                step={step}
                onChange={(v) => onChange('min', v)}
                colors={{
                    labels: 'white',
                }}
            />
            <Knob
                label="Max"
                value={range.max}
                min={min}
                max={max}
                step={step}
                onChange={(v) => onChange('max', v)}
                colors={{
                    labels: 'white',
                }}
            />
        </div>
    </div>
);


const Instructions: FC = () => {
    const [sine, setSine] = useState<OscParam>({
        amp: 0.1,
        freq: 1,
        osc: true,
        value: 0.5,
    });
    const [rand, setRand] = useState<RandParam>({
        dist: 0.1,
        rand: true,
        value: 0.5,
    });

    return <div className='w-full grid grid-cols-1 sm:grid-cols-2 gap-4 text-wrap'>
        <div className='flex flex-col gap-4 text-lg'>
            <p>This is a demonstration of the NoiseD audio engine.</p>
            <p>When playing, you will hear the generated rain and the ocasional generated thunder.</p>
            <p>The controls are separated into 3 sections:</p>
        </div>
        <Section title='Master Controls'>
            <ul>
                <li>Volume</li>
                <li>Equalizer</li>
                <li>Delay Between Thunders</li>
            </ul>
        </Section>
        <Section title='Rain Settings'>
            <div className='h-full flex flex-col justify-between gap-4'>
                <p>Various controls, some can oscillate around the set value.</p>
                <p>You can adjust the amplitude and frequency of the oscillations.</p>
                <div className='w-full flex flex-wrap gap-4 items-stretch'>
                    <OscParamController
                        label="Sine Wave"
                        param={sine}
                        onChange={(p: OscParam) => setSine(p)}
                        valueRange={[0, 1]}
                        ampRange={[0, 1]}
                        freqRange={[0, 10]}
                    />
                    <div className='h-auto w-64'>
                        <SineWave param={sine} />
                    </div>
                </div>
            </div>
        </Section>
        <Section title='Thunder Settings'>
            <div className='h-full flex flex-col justify-between gap-4'>
                <p>Various controls, most can randomize around the set value, so each thunder strike is a little different.</p>
                <p>You can adjust the maximum distance to allow random values to deviate from the set value.</p>
                <div className='w-full flex flex-wrap gap-4'>
                    <RandParamController
                        label="Random"
                        param={rand}
                        onChange={(p: RandParam) => setRand(p)}
                        valueRange={[0, 1]}
                        distRange={[0, 1]}
                    />
                    <div className='h-auto w-64'>
                        <RandomBar param={rand} />
                    </div>
                </div>
            </div>
        </Section>
    </div>
}

const XSeparator: FC = () => {
    return (
        <div
            className="bg-neutral-500/30"
            style={{
                width: '1px',
                minWidth: '1px',
                height: '100%',
                flexShrink: 0,
                flexGrow: 0,
            }}
        />
    );
};