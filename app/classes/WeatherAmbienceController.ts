import { RainGenerator, RainParams, NoiseType } from "./RainGenerator";
import { ThunderGenerator, ThunderParams } from "./ThunderGenerator";

export type Range<T = number> = {
    min: T;
    max: T;
};

export interface AmbientSettings {
    masterVolume: number;
    rainIntensity: Range;
    rainDropRate: Range;
    rainMinPitch: Range;
    rainMaxPitch: Range;
    rainDecayTime: Range;
    rainDryLevel: Range;
    rainWetLevel: Range;
    rainDropDryLevel: Range;
    rainPanRange: Range;
    rainDropQ: Range;
    rainNoiseType: NoiseType;
    thunderDelay: Range<number>;
    eqGains: number[];
    thunderParams: Partial<{ [K in keyof ThunderParams]: Range<number> }>;
}

export class WeatherAmbienceController {
    private ctx: AudioContext;
    private rain: RainGenerator;
    private thunder: ThunderGenerator;
    private masterGain: GainNode;
    private settings: AmbientSettings;
    private thunderTimeout: any = null;

    constructor(ctx: AudioContext, settings: AmbientSettings) {
        this.ctx = ctx;
        this.settings = structuredClone(settings);

        this.masterGain = ctx.createGain();
        this.masterGain.gain.value = settings.masterVolume;
        this.masterGain.connect(ctx.destination);

        this.rain = new RainGenerator(ctx);
        this.rain.connect(this.masterGain);

        this.thunder = new ThunderGenerator(ctx);
        this.thunder.connect(this.masterGain);

        this.applySettings();
    }

    public start() {
        this.rain.start();
        this.scheduleThunder();
    }

    public stop() {
        this.rain.stop();
        if (this.thunderTimeout) clearTimeout(this.thunderTimeout);
    }

    public setMasterVolume(value: number) {
        this.masterGain.gain.value = value;
    }

    public updateEqGains(gains: number[]) {
        this.settings.eqGains = gains;
        this.thunder.setParams({ eqGains: gains });
    }

    public updateSettings(settings: AmbientSettings) {
        this.settings = structuredClone(settings);
        this.applySettings();
    }

    private applySettings() {
        const s = this.settings;

        const rainParams: Partial<RainParams> = {
            volume: (s.rainIntensity.min + s.rainIntensity.max) / 2,
            noiseType: s.rainNoiseType,
            noiseLevel: (s.rainIntensity.min + s.rainIntensity.max) / 2,
            noiseFilterFreq: 4000,
            eqGains: s.eqGains,
            dropRate: this.avg(s.rainDropRate),
            dropMinPitch: this.avg(s.rainMinPitch),
            dropMaxPitch: this.avg(s.rainMaxPitch),
            dropDecayTime: this.avg(s.rainDecayTime),
            dropDryLevel: this.avg(s.rainDropDryLevel),
            dropWetLevel: this.avg(s.rainWetLevel),
            dropPanRange: this.avg(s.rainPanRange),
            dropQ: this.avg(s.rainDropQ),
        };

        this.rain.setNoiseType(rainParams.noiseType!);
        this.rain.setVolume(rainParams.volume!);
        this.rain.setNoiseLevel(rainParams.noiseLevel!);
        this.rain.setNoiseFilterFreq(rainParams.noiseFilterFreq!);
        this.rain.setEQGains(rainParams.eqGains!);
        this.rain.setDropRate(rainParams.dropRate!);
        this.rain.setPitchRange(rainParams.dropMinPitch!, rainParams.dropMaxPitch!);
        this.rain.setDecayTime(rainParams.dropDecayTime!);
        this.rain.setDropDryLevel(rainParams.dropDryLevel!);
        this.rain.setDropWetLevel(rainParams.dropWetLevel!);
        this.rain.setPanRange(rainParams.dropPanRange!);
        this.rain.setDropQ(rainParams.dropQ!);

        this.thunder.setParams({ eqGains: s.eqGains });

        this.setMasterVolume(s.masterVolume);
    }

    private scheduleThunder() {
        const delay = this.rand(this.settings.thunderDelay);
        this.thunderTimeout = setTimeout(() => {
            const thunderParams = this.getThunderParams();
            this.thunder.setParams(thunderParams);
            this.thunder.setGeneratedReverb();
            this.thunder.triggerThunder();
            this.scheduleThunder();
        }, delay);
    }

    private getThunderParams(): ThunderParams {
        const p: Partial<ThunderParams> = {};
        const keys = Object.keys(this.settings.thunderParams) as (keyof ThunderParams)[];

        for (const key of keys) {
            const range = this.settings.thunderParams[key];
            if (range) {
                const value = this.rand(range);
                (p[key] as number | number[]) = value;
            }
        }

        p.eqGains = this.settings.eqGains;
        return p as ThunderParams;
    }

    private rand(range: Range<number>): number {
        return range.min + Math.random() * (range.max - range.min);
    }

    private avg(range: Range<number>): number {
        return (range.min + range.max) / 2;
    }
}