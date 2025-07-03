'use client';


import React, { FC, useEffect, useRef, useState } from 'react';
import { Equalizer } from './components/Equalizer';
import { CustomKnob as Knob } from './components/CustomKnob';
import Image from 'next/image';
import { OscParam } from './types/OscParam';
import { OscParamController } from './components/OscParamController';
import { RandParamController } from './components/RandParamController';
import { IoChevronDown, IoChevronUp, IoDownload, IoPlay, IoSave, IoStop } from 'react-icons/io5';
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
    const [selectedTab, setSelectedTab] = useState<'master' | 'rain' | 'thunder'>('master');

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
            controllerRef.current?.destroy();
            controllerRef.current = null;

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
        <div className="relative flex flex-wrap items-center">
            <div className="absolute top-0 left-0 w-full h-full opacity-50 rounded-lg z-0 pointer-events-none">
                <Visualization
                    analyserRef={{ current: analyserNode }}
                    isPlaying={isRunning}
                    type="waveform"
                    barCount={48}
                />
            </div>

            {/* Foreground elements */}
            <div className="flex flex-wrap items-center justify-between w-full p-4 z-10 relative">
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
                    className="h-fit flex items-center text-white text-xl font-bold py-2 px-4 rounded-full bg-neutral-500 hover:bg-neutral-600 transition duration-300 ease-in-out cursor-pointer z-10"
                    title={isRunning ? "Stop" : "Start"}
                >
                    <Image
                        src="/images/noised-logo-icon.png"
                        alt="NoiseD Logo"
                        width={48}
                        height={48}
                        className="mr-2"
                    />
                    {isRunning ? "Silence!" : "Start the Noise!"}
                </button>
                <Tooltip content="Download a JSON file with the current parameters" placement="top">
                    <button
                        onClick={handleDownloadParams}
                        className="text-pink-500 font-bold p-4 rounded-full hover:text-pink-600 transition duration-300 ease-in-out cursor-pointer z-10"
                        title="Download Params"
                    >
                        <IoSave size={50} />
                    </button>
                </Tooltip>
            </div>
        </div>
        <div className="flex flex-col">
            <div className="flex w-full">
                <button
                    onClick={() => setSelectedTab('master')}
                    className={`flex grow px-4 py-2 font-bold text-xl ${selectedTab === 'master' ? 'bg-pink-700 text-white' : 'bg-neutral-500/30 hover:bg-pink-500/50'}`}
                >
                    <p className='w-full text-center'>Master Controls</p>
                </button>
                <button
                    onClick={() => setSelectedTab('rain')}
                    className={`flex grow px-4 py-2 font-bold text-xl ${selectedTab === 'rain' ? 'bg-pink-700 text-white' : 'bg-neutral-500/30 hover:bg-pink-500/50'}`}
                >
                    <p className='w-full text-center'>Rain Controls</p>
                </button>
                <button
                    onClick={() => setSelectedTab('thunder')}
                    className={`flex grow px-4 py-2 font-bold text-xl ${selectedTab === 'thunder' ? 'bg-pink-700 text-white' : 'bg-neutral-500/30 hover:bg-pink-500/50'}`}
                >
                    <p className='w-full text-center'>Thunder Controls</p>
                </button>
            </div>

            {selectedTab === 'master' && <TabContainer>
                <MasterControls
                    params={params}
                    handleVolumeChange={handleVolumeChange}
                    handleDelayBetweenThundersChange={handleDelayBetweenThundersChange}
                    handleEqChange={handleEqChange}
                    equalizerColors={equalizerColors}
                />
            </TabContainer>}

            {selectedTab === 'rain' && <TabContainer>
                <RainControls
                    params={params}
                    handleRainVolumeChange={handleRainVolumeChange}
                    handleRainEqChange={handleRainEqChange}
                    handleNoiseTypeChange={handleNoiseTypeChange}
                    handleNoiseLevelChange={handleNoiseLevelChange}
                    handleRainNoiseFilterFreqChange={handleRainNoiseFilterFreqChange}
                    handleRainDropDryLevelChange={handleRainDropDryLevelChange}
                    handleRainDropWetLevelChange={handleRainDropWetLevelChange}
                    handleRainDropQChange={handleRainDropQChange}
                    handleRainDropRateChange={handleRainDropRateChange}
                    handleRainDropDecayTimeChange={handleRainDropDecayTimeChange}
                    handleRainDropReverbLevelChange={handleRainDropReverbLevelChange}
                    handleRainDropPanRangeChange={handleRainDropPanRangeChange}
                    handleRainDropMinPitchChange={handleRainDropMinPitchChange}
                    handleRainDropMaxPitchChange={handleRainDropMaxPitchChange}
                    equalizerColors={equalizerColors}
                />
            </TabContainer>}

            {selectedTab === 'thunder' && <TabContainer>
                <ThunderControls
                    params={params}
                    handleThunderParamChange={handleThunderParamChange}
                    equalizerColors={equalizerColors}
                />
            </TabContainer>}
        </div>
    </div>;
};

const MasterControls: FC<{
    params: NoiseDParams;
    handleVolumeChange: (value: number) => void;
    handleDelayBetweenThundersChange: (type: 'min' | 'max', value: number) => void;
    handleEqChange: (index: number, value: number) => void;
    equalizerColors: Record<string, string>;
}> = ({
    params,
    handleVolumeChange,
    handleDelayBetweenThundersChange,
    handleEqChange,
    equalizerColors
}) => {
        return <div className='relative flex flex-wrap items-start w-full min-w-0'>
            <ControlContainer label="Master EQ" width="150px" height="260px">
                <Knob
                    label="Volume"
                    value={params.masterVolume}
                    min={0}
                    max={1}
                    step={0.01}
                    onChange={handleVolumeChange}
                />
            </ControlContainer>
            <ControlContainer label="Delay Between Thunders" width="300px" height="260px">
                <MinMaxPair
                    label="Delay Between Thunders"
                    range={params.delayBetweenThunders}
                    onChange={(type, value) => handleDelayBetweenThundersChange(type, value)}
                    min={1000}
                    max={30000}
                />
            </ControlContainer>
            <ControlContainer label="Master EQ" width="465px" height="260px">
                <Equalizer
                    gains={params.eqGains}
                    freqs={[31, 62, 125, 250, 500, 1000, 2000, 4000, 8000, 16000]}
                    onChange={handleEqChange}
                    rotateLabels={-25}
                    colors={equalizerColors}
                    height={200}
                />
            </ControlContainer>
        </div>
    }

const RainControls: FC<{
    params: NoiseDParams;
    handleRainVolumeChange: (value: number) => void;
    handleRainEqChange: (index: number, value: number) => void;
    handleNoiseTypeChange: (value: NoiseType) => void;
    handleNoiseLevelChange: (value: number) => void;
    handleRainNoiseFilterFreqChange: (param: OscParam) => void;
    handleRainDropDryLevelChange: (value: number) => void;
    handleRainDropWetLevelChange: (value: number) => void;
    handleRainDropQChange: (value: number) => void;
    handleRainDropRateChange: (value: number) => void;
    handleRainDropDecayTimeChange: (value: number) => void;
    handleRainDropReverbLevelChange: (param: OscParam) => void;
    handleRainDropPanRangeChange: (param: OscParam) => void;
    handleRainDropMinPitchChange: (param: OscParam) => void;
    handleRainDropMaxPitchChange: (param: OscParam) => void;
    equalizerColors: {
        bar?: string;
        background?: string;
        Hz?: string;
        dB?: string;
    } | undefined;

}> = ({
    params,
    handleRainVolumeChange,
    handleRainEqChange,
    handleNoiseTypeChange,
    handleNoiseLevelChange,
    handleRainNoiseFilterFreqChange,
    handleRainDropDryLevelChange,
    handleRainDropWetLevelChange,
    handleRainDropQChange,
    handleRainDropRateChange,
    handleRainDropDecayTimeChange,
    handleRainDropReverbLevelChange,
    handleRainDropPanRangeChange,
    handleRainDropMinPitchChange,
    handleRainDropMaxPitchChange,
    equalizerColors
}) => {
        return <div className='relative flex flex-wrap items-start w-full min-w-0'>
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
                            tooltipText="This is a low-pass filter. You can adjust the frequency to control the cutoff point."
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
                    tooltipText="Level of the reverb effect applied to the drops."
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
                    tooltipText="Controls the panning range of the drops. 0 is center, 1 is full left/right."
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
                        tooltipText="Controls the frequency of the start of the drop."
                    />
                    <XSeparator />
                    <OscParamController
                        label="Drop Max Pitch"
                        param={params.rainParams.dropMaxPitch}
                        onChange={(p) => handleRainDropMaxPitchChange(p)}
                        valueRange={[20, 8000]}
                        ampRange={[0, 1000]}
                        step={1}
                        tooltipText="Controls the frequency of the end of the drop."
                    />
                </div>
            </ControlContainer>
        </div>
    }

const ThunderControls: FC<{
    params: NoiseDParams;
    handleThunderParamChange: (newParam: Partial<ThunderParams>) => void;
    equalizerColors: Record<string, string>;
}> = ({ params, handleThunderParamChange, equalizerColors }) => {
    return <div className='relative flex flex-wrap items-start w-full min-w-0'>
        <ControlContainer label="Thunder Volume" width="250px" height="260px">
            <RandParamController
                label="Volume"
                param={params.thunderParams.volume}
                onChange={(p) => handleThunderParamChange({ volume: p })}
                valueRange={[0, 1]}
                distRange={[0, 0.5]}
                step={0.01}
                tooltipText='Controls the master volume of the thunders.'
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
                tooltipText='Controls the duration of each thunder.'
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
                tooltipText='Controls the panning range of the thunders. 0 is center, 1 is full left/right.'
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
                tooltipText='This is a low-pass filter. You can adjust the frequency to control the cutoff point.'
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
                tooltipText='Controls the number of thunder bursts.'
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
                    tooltipText='Controls the duration of the reverb effect.'
                />
                <XSeparator />
                <RandParamController
                    label="Reverb Decay"
                    param={params.thunderParams.reverbDecay}
                    onChange={(p) => handleThunderParamChange({ reverbDecay: p })}
                    valueRange={[0, 10]}
                    distRange={[0, 5]}
                    step={0.01}
                    tooltipText='Controls the decay time of the reverb effect.'
                />
                <XSeparator />
                <RandParamController
                    label="Reverb Wet Level"
                    param={params.thunderParams.reverbWetLevel}
                    onChange={(p) => handleThunderParamChange({ reverbWetLevel: p })}
                    valueRange={[0, 1]}
                    distRange={[0, 0.5]}
                    step={0.01}
                    tooltipText='Controls the wet level of the reverb effect.'
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
                tooltipText='Controls the cutoff frequency of the high-pass filter. This is useful for removing too bass-heavy sounds.'
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
                tooltipText='Controls the amount of crackle effect applied to the thunder.'
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
                    tooltipText='Controls the starting frequency of the rumble effect.'
                />
                <XSeparator />
                <RandParamController
                    label="Rumble Freq End"
                    param={params.thunderParams.rumbleFreqEnd}
                    onChange={(p) => handleThunderParamChange({ rumbleFreqEnd: p })}
                    valueRange={[20, 1000]}
                    distRange={[0, 10]}
                    step={1}
                    tooltipText='Controls the ending frequency of the rumble effect.'
                />
                <XSeparator />
                <RandParamController
                    label="Rumble Volume"
                    param={params.thunderParams.rumbleVolume}
                    onChange={(p) => handleThunderParamChange({ rumbleVolume: p })}
                    valueRange={[0, 1]}
                    distRange={[0, 0.5]}
                    step={0.01}
                    tooltipText='Controls the volume of the rumble effect.'
                />
                <XSeparator />
                <RandParamController
                    label="Rumble Decay"
                    param={params.thunderParams.rumbleDecay}
                    onChange={(p) => handleThunderParamChange({ rumbleDecay: p })}
                    valueRange={[0, 10]}
                    distRange={[0, 5]}
                    step={0.01}
                    tooltipText='Controls the decay time of the rumble effect.'
                />
            </div>
        </ControlContainer>
    </div>
}

const TabContainer: FC<{
    children?: React.ReactNode,
}> = ({ children }) => {

    return <div
        className="flex flex-col font-[courier] border bg-neutral-500/30"
        style={{
            backdropFilter: 'blur(10px)',
        }}
    >
        {children}
    </div>;
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
    <div className="flex flex-col items-center p-4 rounded-lg shadow-inner gap-2">
        <label className="font-medium text-center">{label}</label>
        <div className="flex gap-4">
            <Knob
                label="Min"
                value={range.min}
                min={min}
                max={max}
                step={step}
                onChange={(v) => onChange('min', v)}
                colors={{
                    face: '#de006b',
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
                    face: '#de006b',
                }}
            />
        </div>
    </div>
);

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