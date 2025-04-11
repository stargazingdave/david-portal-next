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
    reverbWetLevel?: number;
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
            reverbWetLevel: 0.4,
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
                const burstDelay = i * 250 + Math.random() * 100;
                setTimeout(() => this._playSingleBurst(this.params.duration, this.params.volume), burstDelay);
            }
        }, delay);
    }

    private _playSingleBurst(duration: number, volume: number) {
        const now = this.ctx.currentTime;

        const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * duration, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        const crackle = this.params.crackleAmount ?? 1;
        for (let i = 0; i < data.length; i++) {
            const buildUp = Math.min(1, i / (this.ctx.sampleRate * (duration * 0.25)));
            const decay = Math.exp(-i / (this.ctx.sampleRate * duration));
            const noise = (Math.random() * 2 - 1) * Math.pow(Math.random(), 1 - crackle);
            data[i] = noise * decay * buildUp;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const lowpass = this.ctx.createBiquadFilter();
        lowpass.type = 'lowpass';
        lowpass.frequency.setValueAtTime(this.params.filterFreq, now);
        lowpass.frequency.exponentialRampToValueAtTime(200, now + duration * 1.2);

        const highpass = this.ctx.createBiquadFilter();
        highpass.type = 'highpass';
        highpass.frequency.value = this.params.highPassFreq ?? 20;

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(volume, now + 0.3);
        gain.gain.exponentialRampToValueAtTime(volume * 0.5, now + duration * 0.7);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration * 2.5);

        const pan = this.ctx.createStereoPanner();
        const panRange = this.params.panRange ?? 1;
        const basePan = (Math.random() * 2 - 1) * panRange;
        pan.pan.setValueAtTime(basePan, now);
        pan.pan.linearRampToValueAtTime(-basePan, now + duration);

        const dryGain = this.ctx.createGain();
        dryGain.gain.value = 1;

        const wetGain = this.ctx.createGain();
        wetGain.gain.value = this.params.reverbWetLevel ?? 0.4;

        const convolver = this.ctx.createConvolver();
        if (this.reverbBuffer) convolver.buffer = this.reverbBuffer;

        // Optional highpass before reverb to cut sub mud
        const preVerbFilter = this.ctx.createBiquadFilter();
        preVerbFilter.type = "highpass";
        preVerbFilter.frequency.value = 250;

        noise.connect(lowpass).connect(highpass).connect(gain);
        gain.connect(pan);
        pan.connect(dryGain).connect(this.output);

        if (this.reverbBuffer) {
            gain.connect(preVerbFilter).connect(convolver).connect(wetGain).connect(this.output);
        }

        const rumbleOsc = this.ctx.createOscillator();
        rumbleOsc.type = "sine";
        rumbleOsc.frequency.setValueAtTime(30, now);
        rumbleOsc.frequency.linearRampToValueAtTime(20, now + duration);

        const subGain = this.ctx.createGain();
        subGain.gain.setValueAtTime((this.params.subLevel ?? 0.1) * volume, now);
        subGain.gain.exponentialRampToValueAtTime(0.001, now + duration * 2.5);

        rumbleOsc.connect(subGain).connect(this.output);
        rumbleOsc.start();
        rumbleOsc.stop(now + duration * 2.5);

        const tailBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * duration * 1.5, this.ctx.sampleRate);
        const tailData = tailBuffer.getChannelData(0);
        let lastOut = 0;
        for (let i = 0; i < tailData.length; i++) {
            const white = Math.random() * 2 - 1;
            tailData[i] = (lastOut + 0.02 * white) / 1.02;
            lastOut = tailData[i];
            tailData[i] *= 3.5 * Math.exp(-i / (this.ctx.sampleRate * duration));
        }
        const brown = this.ctx.createBufferSource();
        brown.buffer = tailBuffer;

        const brownGain = this.ctx.createGain();
        brownGain.gain.setValueAtTime(volume * 0.2, now);
        brownGain.gain.exponentialRampToValueAtTime(0.001, now + duration * 2.5);

        brown.connect(brownGain).connect(this.output);

        noise.start();
        brown.start();
    }
}