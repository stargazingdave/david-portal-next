interface OscParam {
    value: number;
    osc: boolean;
    amp: number;
    freq: number;
}

type NoiseType = 'pink' | 'white';
interface RainParams {
    volume: number;
    eqGains: number[];
    noiseLevel: number;
    noiseType: NoiseType;
    noiseFilterFreq: OscParam;
    dropDryLevel: number;
    dropWetLevel: number;
    dropRate: number;
    dropMinPitch: OscParam;
    dropMaxPitch: OscParam;
    dropDecayTime: number;
    dropReverbLevel: OscParam;
    dropPanRange: OscParam;
    dropQ: number;
}
declare const _defaultRainParams: RainParams;
declare class RainGenerator<T extends BaseAudioContext = AudioContext> {
    private audioCtx;
    private output;
    private noiseGainNode;
    private dropGainNode;
    private dryDropGainNode;
    private reverbNode;
    private dryGain;
    private wetGain;
    private noiseFilter;
    private noiseNode;
    private dropInterval;
    private running;
    private params;
    private eqBands;
    private lfoMap;
    private readonly eqFrequencies;
    constructor(audioCtx: T, params?: Partial<RainParams>);
    destroy(): void;
    private _connectNodes;
    private _generateImpulseResponse;
    private setOscParam;
    start(): Promise<void>;
    stop(): void;
    setNoiseFilterFreq(param: OscParam): void;
    setDropReverbLevel(param: OscParam): void;
    setDropRate(param: number): void;
    setPanRange(param: OscParam): void;
    setPitchRange(min: OscParam, max: OscParam): void;
    setDecayTime(param: number): void;
    setNoiseLevel(value: number): void;
    setDropDryLevel(value: number): void;
    setDropWetLevel(value: number): void;
    setDropQ(value: number): void;
    setVolume(value: number): void;
    setNoiseType(type: NoiseType): void;
    setParams(newParams: Partial<RainParams>): void;
    private _applyParams;
    private _startNoise;
    private _startDrops;
    connect(node: AudioNode): void;
    disconnect(): void;
}

interface RandParam {
    value: number;
    rand: boolean;
    dist: number;
}

type ThunderParamsLimits = Record<keyof ThunderParams, {
    min: number;
    max: number;
}>;
interface ThunderParams {
    volume: RandParam;
    duration: RandParam;
    filterFreq: RandParam;
    burstCount: RandParam;
    delayMs: number;
    reverbDuration: RandParam;
    reverbDecay: RandParam;
    reverbWetLevel: RandParam;
    subLevel: RandParam;
    panRange: RandParam;
    highPassFreq: RandParam;
    crackleAmount: RandParam;
    eqGains: number[];
    rumbleFreqStart: RandParam;
    rumbleFreqEnd: RandParam;
    rumbleVolume: RandParam;
    rumbleDecay: RandParam;
}
declare const _defaultThunderParams: ThunderParams;
declare class ThunderGenerator<T extends BaseAudioContext = AudioContext> {
    private ctx;
    private reverbBuffer;
    private output;
    private limiter;
    private params;
    private eqBands;
    private readonly eqFrequencies;
    constructor(audioCtx: T, params?: Partial<ThunderParams>);
    destroy(): void;
    setGeneratedReverb(): void;
    triggerThunder(): void;
    setParams(newParams: Partial<ThunderParams>): void;
    private _applyParams;
    private _playSingleBurst;
    connect(node: AudioNode): void;
}

type Range<T = number> = {
    min: T;
    max: T;
};
interface NoiseDParams {
    masterVolume: number;
    delayBetweenThunders: Range<number>;
    eqGains: number[];
    rainParams: RainParams & {
        on: boolean;
    };
    thunderParams: ThunderParams & {
        on: boolean;
    };
}
declare const _defaultNoiseDParams: NoiseDParams;
declare class NoiseDController<T extends BaseAudioContext = AudioContext> {
    private ctx;
    private rain;
    private thunder;
    private masterGain;
    private eqBands;
    private readonly eqFrequencies;
    private params;
    private thunderTimeout;
    private running;
    constructor(ctx: T, params?: Partial<NoiseDParams>);
    destroy(): void;
    start(): void;
    stop(): void;
    startRain(): void;
    stopRain(): void;
    startThunder(): void;
    stopThunder(): void;
    setMasterVolume(value: number): void;
    setDelayBetweenThunders(value: Range<number>): void;
    setEqGain(index: number, value: number): void;
    updateRainParams(newRainParams: Partial<RainParams>): void;
    updateThunderParams(newThunderParams: Partial<ThunderParams>): void;
    private _applyParams;
    private scheduleThunder;
    private _rand;
    renderToFile(durationSec: number): Promise<Blob>;
    private _bufferToWavBlob;
    setRainVolume(value: number): void;
    setRainNoiseType(value: 'pink' | 'white'): void;
    setRainNoiseLevel(value: number): void;
    setRainDropDryLevel(value: number): void;
    setRainDropWetLevel(value: number): void;
    setRainDropPanRange(value: OscParam): void;
    setRainDropQ(value: number): void;
    setRainDropMinPitch(value: OscParam): void;
    setRainDropMaxPitch(value: OscParam): void;
    setRainDropDecayTime(value: number): void;
    setRainDropRate(value: number): void;
    setRainDropReverbLevel(value: OscParam): void;
    setRainNoiseFilterFreq(value: OscParam): void;
    setRainEqGain(index: number, value: number): void;
    setThunderParams(newParams: Partial<ThunderParams>): void;
    exportParamsAsJSON(): string;
    getAnalyser(): AnalyserNode;
}

export { NoiseDController, type NoiseDParams, type NoiseType, RainGenerator, type RainParams, type Range, ThunderGenerator, type ThunderParams, type ThunderParamsLimits, _defaultNoiseDParams, _defaultRainParams, _defaultThunderParams };
