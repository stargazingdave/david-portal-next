// ThunderGenerator.ts
import { createImpulseResponse } from "../functions/createImpulseBuffer";

export interface ThunderParams {
    volume: number;
    duration: number;
    filterFreq: number;
    burstCount: number;
    distance?: number;
    delayMs?: number;
    reverbDuration?: number;
    reverbDecay?: number;
    subLevel?: number;
    panRange?: number;
    highPassFreq?: number;
    crackleAmount?: number;
}

export class ThunderGenerator {
    private ctx: AudioContext;
    private reverbBuffer: AudioBuffer | null = null;
    private output: GainNode;
    private params: ThunderParams;

    constructor(audioContext: AudioContext) {
        this.ctx = audioContext;
        this.params = {
            volume: 1,
            duration: 2,
            filterFreq: 1500,
            burstCount: 1,
            subLevel: 0.1,
            panRange: 1,
            reverbDuration: 2,
            reverbDecay: 2,
            delayMs: 0,
            highPassFreq: 20,
            crackleAmount: 1,
        };
        this.output = this.ctx.createGain();
        this.output.connect(this.ctx.destination);
    }

    setParams(newParams: Partial<ThunderParams>) {
        const updated = { ...this.params, ...newParams };
        if (updated.distance != null) {
            const d = updated.distance;
            updated.volume = Math.max(0.05, 1 / (d * 0.6));
            updated.delayMs = d / 0.343;
            updated.reverbDuration = 2 + d * 0.4;
            updated.reverbDecay = 1.5 + d * 0.3;
            updated.subLevel = Math.max(0, 1 - d / 10);
            updated.panRange = Math.max(0.2, 1 - d / 15);
        }
        this.params = updated;
    }

    setGeneratedReverb() {
        this.reverbBuffer = createImpulseResponse(
            this.ctx,
            this.params.reverbDuration ?? 2,
            this.params.reverbDecay ?? 2
        );
    }

    triggerThunder() {
        const delay = this.params.delayMs ?? 0;
        setTimeout(() => {
            for (let i = 0; i < this.params.burstCount; i++) {
                setTimeout(() => this._playSingleBurst(this.params.duration, this.params.volume), Math.random() * 800);
            }
        }, delay);
    }

    private _playSingleBurst(duration: number, volume: number) {
        const now = this.ctx.currentTime;

        const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * duration, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        const crackle = this.params.crackleAmount ?? 1;
        for (let i = 0; i < data.length; i++) {
            const decay = Math.exp(-i / (this.ctx.sampleRate * 0.4));
            const noise = (Math.random() * 2 - 1) * Math.pow(Math.random(), 1 - crackle);
            data[i] = noise * decay;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const lowpass = this.ctx.createBiquadFilter();
        lowpass.type = 'lowpass';
        lowpass.frequency.value = this.params.filterFreq;

        const highpass = this.ctx.createBiquadFilter();
        highpass.type = 'highpass';
        highpass.frequency.value = this.params.highPassFreq ?? 20;

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(volume, now);
        gain.gain.exponentialRampToValueAtTime(volume * 0.4, now + duration * 0.5);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration * 1.5);

        const panner = this.ctx.createStereoPanner();
        const panRange = this.params.panRange ?? 1;
        panner.pan.value = (Math.random() * 2 - 1) * panRange;

        const useReverb = !!this.reverbBuffer;
        if (useReverb) {
            const convolver = this.ctx.createConvolver();
            convolver.buffer = this.reverbBuffer!;
            noise.connect(lowpass).connect(highpass).connect(gain);
            gain.connect(convolver).connect(panner).connect(this.output);
            gain.connect(panner).connect(this.output);
        } else {
            noise.connect(lowpass).connect(highpass).connect(gain).connect(panner).connect(this.output);
        }

        const osc = this.ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.value = 40 + Math.random() * 10;

        const subGain = this.ctx.createGain();
        subGain.gain.setValueAtTime((this.params.subLevel ?? 0.1) * volume, now);
        subGain.gain.exponentialRampToValueAtTime(0.001, now + duration * 2);

        osc.connect(subGain).connect(this.output);
        osc.start();
        osc.stop(now + duration * 2);

        noise.start();
    }
}
