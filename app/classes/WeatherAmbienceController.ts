import { NoiseType, RainGenerator } from "../classes/RainGenerator";
import { ThunderGenerator, ThunderParams } from "../classes/ThunderGenerator";

export interface Range<T = number> {
    min: T;
    max: T;
}

export interface AmbientSettings {
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
    thunderParams: { [K in keyof ThunderParams]?: Range<number> };
    thunderDelay: Range; // ms
    masterVolume: number;
    eqGains: number[];
}




export class WeatherAmbienceController {
    private ctx: AudioContext;
    private rain: RainGenerator;
    private thunder: ThunderGenerator;
    private output: GainNode;
    private settings: AmbientSettings;
    private thunderTimeout: ReturnType<typeof setTimeout> | null = null;
    private running = false;

    constructor(audioCtx: AudioContext, settings: AmbientSettings) {
        this.ctx = audioCtx;
        this.settings = settings;
        this.output = audioCtx.createGain();
        this.output.gain.value = settings.masterVolume;
        this.rain = new RainGenerator(audioCtx);
        this.thunder = new ThunderGenerator(audioCtx);
        this.rain.connect(this.output);
        this.thunder.connect(this.output);
        this.output.connect(this.ctx.destination);
    }

    private randomInRange({ min, max }: Range<number>): number {
        return min + Math.random() * (max - min);
    }

    private scheduleThunder() {
        if (!this.running) return;
        const thunderSettings: Partial<ThunderParams> = { eqGains: this.settings.eqGains };
        for (const key in this.settings.thunderParams) {
            const range = this.settings.thunderParams[key as keyof ThunderParams];
            if (range && typeof (range as Range<any>).min === 'number') {
                (thunderSettings as any)[key] = this.randomInRange(range as Range<number>);
            }
        }
        this.thunder.setParams(thunderSettings);
        this.thunder.setGeneratedReverb();
        this.thunder.triggerThunder();

        const delay = this.randomInRange(this.settings.thunderDelay);
        this.thunderTimeout = setTimeout(() => this.scheduleThunder(), delay);
    }

    start() {
        if (this.running) return;
        this.running = true;
        // this.rain.setIntensity(this.randomInRange(this.settings.rainIntensity));
        this.rain.setVolume(this.randomInRange(this.settings.rainDropRate));
        this.rain.start();
        this.scheduleThunder();
    }

    stop() {
        this.running = false;
        this.rain.stop();
        if (this.thunderTimeout) clearTimeout(this.thunderTimeout);
    }

    setMasterVolume(vol: number) {
        this.settings.masterVolume = vol;
        this.output.gain.value = vol;
    }

    updateSettings(newSettings: Partial<AmbientSettings>) {
        this.settings = {
            ...this.settings,
            ...newSettings,
        };
    }

    updateEqGains(gains: number[]) {
        this.settings.eqGains = gains;
        this.thunder.setParams({ eqGains: gains });
    }

    connect(node: AudioNode) {
        this.output.connect(node);
    }

    disconnect() {
        this.output.disconnect();
    }
}
