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
    eqGains?: number[]; // 10-band EQ
}

export class ThunderGenerator {
    private masterVolume = 1;
    private ctx: AudioContext;
    private reverbBuffer: AudioBuffer | null = null;
    private output: GainNode;
    private params: ThunderParams;
    private eqBands: BiquadFilterNode[] = [];
    private readonly eqFrequencies = [31, 62, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];

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
            eqGains: new Array(10).fill(0)
        };

        this.output = this.ctx.createGain();

        // Create EQ band filters
        this.eqBands = this.eqFrequencies.map(freq => {
            const band = this.ctx.createBiquadFilter();
            band.type = "peaking";
            band.frequency.value = freq;
            band.Q.value = 1.0;
            band.gain.value = 0;
            return band;
        });

        // Chain EQ bands together
        let last = this.eqBands[0];
        for (let i = 1; i < this.eqBands.length; i++) {
            last.connect(this.eqBands[i]);
            last = this.eqBands[i];
        }
        last.connect(this.output);
        this.output.connect(this.ctx.destination);
    }

    setParams(newParams: Partial<ThunderParams>) {
        const updated = { ...this.params, ...newParams };

        if (newParams.volume !== undefined) {
            this.masterVolume = newParams.volume;
        }

        if (updated.distance != null) {
            const d = updated.distance;
            const distanceVolume = Math.max(0.2, 1 / (d * 0.3));
            updated.delayMs = d / 0.343;
            updated.reverbDuration = 2 + d * 0.4;
            updated.reverbDecay = 1.5 + d * 0.3;
            updated.subLevel = Math.max(0, 1 - d / 10);
            updated.panRange = Math.max(0.2, 1 - d / 15);
            updated.volume = this.masterVolume * distanceVolume;
        }

        if (newParams.eqGains && newParams.eqGains.length === this.eqBands.length) {
            newParams.eqGains.forEach((gain, i) => {
                this.eqBands[i].gain.value = gain;
            });
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
                const burstDelay = 200 + Math.random() * 400;
                setTimeout(() => this._playSingleBurst(
                    this.params.duration * (0.8 + Math.random() * 0.4),
                    this.params.volume * (0.7 + Math.random() * 0.6)
                ), burstDelay * i);
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
            const noise = (Math.random() * 2 - 1) * Math.pow(Math.random(), 2);
            data[i] = noise * decay * buildUp;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const lowpass = this.ctx.createBiquadFilter();
        lowpass.type = 'lowpass';
        lowpass.frequency.setValueAtTime(this.params.filterFreq, now);
        lowpass.frequency.exponentialRampToValueAtTime(100, now + duration);

        const highpass = this.ctx.createBiquadFilter();
        highpass.type = 'highpass';
        highpass.frequency.value = this.params.highPassFreq ?? 10;

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(volume * 0.8, now + 0.1);
        gain.gain.exponentialRampToValueAtTime(volume * 0.5, now + duration * 0.9);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration * 3);

        const pan = this.ctx.createStereoPanner();
        const basePan = (Math.random() * 2 - 1) * ((this.params.panRange ?? 1) * 0.3);
        pan.pan.setValueAtTime(basePan, now);
        pan.pan.linearRampToValueAtTime(-basePan, now + duration);

        noise.connect(lowpass).connect(highpass).connect(gain).connect(pan);

        // Connect to EQ chain
        pan.connect(this.eqBands[0]);

        if (this.reverbBuffer) {
            const convolver = this.ctx.createConvolver();
            convolver.buffer = this.reverbBuffer;
            const preVerbFilter = this.ctx.createBiquadFilter();
            preVerbFilter.type = "highpass";
            preVerbFilter.frequency.value = 80;

            const wetGain = this.ctx.createGain();
            wetGain.gain.value = this.params.reverbWetLevel ?? 0.4;

            gain.connect(preVerbFilter).connect(convolver).connect(wetGain).connect(this.eqBands[0]);
        }

        const rumbleOsc = this.ctx.createOscillator();
        rumbleOsc.type = "sine";
        rumbleOsc.frequency.setValueAtTime(25, now);
        rumbleOsc.frequency.linearRampToValueAtTime(15, now + duration);

        const subGain = this.ctx.createGain();
        subGain.gain.setValueAtTime((this.params.subLevel ?? 0.1) * volume * 0.6, now);
        subGain.gain.exponentialRampToValueAtTime(0.001, now + duration * 2.5);

        rumbleOsc.connect(subGain).connect(this.eqBands[0]);
        rumbleOsc.start();
        rumbleOsc.stop(now + duration * 2.5);

        const tailBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * duration * 1.5, this.ctx.sampleRate);
        const tailData = tailBuffer.getChannelData(0);
        let lastOut = 0;
        for (let i = 0; i < tailData.length; i++) {
            const white = Math.random() * 2 - 1;
            lastOut = (lastOut + 0.02 * white * crackle) / (1.02 + crackle * 0.05);
            tailData[i] = lastOut * 1.5 * Math.exp(-i / (this.ctx.sampleRate * duration));
        }

        const brown = this.ctx.createBufferSource();
        brown.buffer = tailBuffer;

        const brownHighPass = this.ctx.createBiquadFilter();
        brownHighPass.type = "highpass";
        brownHighPass.frequency.value = 30;

        const brownLowpass = this.ctx.createBiquadFilter();
        brownLowpass.type = "lowpass";
        brownLowpass.frequency.value = 1500;

        const brownGain = this.ctx.createGain();
        brownGain.gain.setValueAtTime(volume * 0.4, now);
        brownGain.gain.exponentialRampToValueAtTime(0.001, now + duration * 2.5);

        brown.connect(brownHighPass).connect(brownLowpass).connect(brownGain).connect(this.eqBands[0]);

        noise.start();
        brown.start();
    }
}