export type NoiseType = 'pink' | 'white';

export interface RainParams {
    volume: number;
    eqGains: number[];

    noiseLevel: number;
    noiseType: NoiseType;
    noiseFilterFreq: number;

    dropDryLevel: number;
    dropWetLevel: number;
    dropRate: number;
    dropMinPitch: number;
    dropMaxPitch: number;
    dropDecayTime: number;
    dropReverbLevel: number;
    dropPanRange: number;
    dropQ: number;
}

export class RainGenerator {
    private audioCtx: AudioContext;
    private output: GainNode;
    private noiseGainNode: GainNode;
    private dropGainNode: GainNode;
    private dryDropGainNode: GainNode;
    private reverbNode: ConvolverNode;
    private dryGain: GainNode;
    private wetGain: GainNode;
    private noiseFilter: BiquadFilterNode;
    private noiseNode: AudioBufferSourceNode | null;
    private dropInterval: ReturnType<typeof setInterval> | null;
    private running: boolean;
    private params: RainParams;
    private eqBands: BiquadFilterNode[];
    private readonly eqFrequencies = [31, 62, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];

    constructor(audioCtx: AudioContext, params?: Partial<RainParams>) {
        this.audioCtx = audioCtx;
        this.output = this.audioCtx.createGain();
        this.noiseGainNode = this.audioCtx.createGain();
        this.noiseFilter = this.audioCtx.createBiquadFilter();
        this.noiseFilter.type = 'lowpass';

        this.dropGainNode = this.audioCtx.createGain();
        this.dryDropGainNode = this.audioCtx.createGain();
        this.reverbNode = this.audioCtx.createConvolver();
        this.dryGain = this.audioCtx.createGain();
        this.wetGain = this.audioCtx.createGain();
        this.noiseNode = null;
        this.dropInterval = null;
        this.running = false;

        const defaultParams: RainParams = {
            volume: 0.5,
            noiseLevel: 0.2,
            noiseType: 'pink',
            noiseFilterFreq: 4000,
            eqGains: new Array(10).fill(0),
            dropDryLevel: 0.2,
            dropWetLevel: 0.4,
            dropRate: 10,
            dropMinPitch: 300,
            dropMaxPitch: 800,
            dropDecayTime: 0.2,
            dropReverbLevel: 0.4,
            dropPanRange: 1.0,
            dropQ: 10,
        };

        this.params = { ...defaultParams, ...params };
        this.noiseFilter.frequency.value = this.params.noiseFilterFreq;

        this.eqBands = this.eqFrequencies.map(freq => {
            const band = this.audioCtx.createBiquadFilter();
            band.type = 'peaking';
            band.frequency.value = freq;
            band.Q.value = 1.0;
            band.gain.value = 0;
            return band;
        });

        let last = this.eqBands[0];
        for (let i = 1; i < this.eqBands.length; i++) {
            last.connect(this.eqBands[i]);
            last = this.eqBands[i];
        }
        last.connect(this.output);

        this._connectNodes();
        this._generateImpulseResponse();
        this._applyParams();
    }

    private _connectNodes() {
        this.noiseGainNode.connect(this.noiseFilter);
        this.noiseFilter.connect(this.dryGain);

        this.dropGainNode.connect(this.reverbNode);
        this.reverbNode.connect(this.wetGain);

        this.dryDropGainNode.connect(this.eqBands[0]);
        this.dryGain.connect(this.eqBands[0]);
        this.wetGain.connect(this.eqBands[0]);
    }

    private _generateImpulseResponse() {
        const length = this.audioCtx.sampleRate * 2;
        const impulse = this.audioCtx.createBuffer(2, length, this.audioCtx.sampleRate);
        for (let channel = 0; channel < 2; channel++) {
            const data = impulse.getChannelData(channel);
            for (let i = 0; i < length; i++) {
                data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2.5);
            }
        }
        this.reverbNode.buffer = impulse;
    }

    private _applyParams() {
        this.setVolume(this.params.volume);
        this.setNoiseType(this.params.noiseType);
        this.setNoiseFilterFreq(this.params.noiseFilterFreq);
        this.setNoiseLevel(this.params.noiseLevel);
        this.setDropDryLevel(this.params.dropDryLevel);
        this.setDropWetLevel(this.params.dropWetLevel);
        this.setDropRate(this.params.dropRate);
        this.setPanRange(this.params.dropPanRange);
        this.setDropQ(this.params.dropQ);
        this.setPitchRange(this.params.dropMinPitch, this.params.dropMaxPitch);
        this.setDecayTime(this.params.dropDecayTime);
        this.setDropReverbLevel(this.params.dropReverbLevel);
        this.setEQGains(this.params.eqGains);
    }

    public setEQGains(gains: number[]) {
        this.params.eqGains = gains;
        gains.forEach((gain, i) => {
            if (this.eqBands[i]) this.eqBands[i].gain.value = gain;
        });
    }

    public start() {
        if (this.running) return;
        this.running = true;
        this._startNoise();
        this._startDrops();
    }

    public stop() {
        this.running = false;
        if (this.noiseNode) this.noiseNode.stop();
        if (this.dropInterval) clearInterval(this.dropInterval);
    }

    public setVolume(value: number) {
        this.output.gain.value = value;
    }

    public setNoiseLevel(value: number) {
        this.dryGain.gain.value = value;
    }

    public setDropDryLevel(value: number) {
        this.dryDropGainNode.gain.value = value;
    }

    public setDropWetLevel(value: number) {
        this.dropGainNode.gain.value = value;
    }

    public setDropRate(value: number) {
        this.params.dropRate = value;
        if (this.dropInterval) clearInterval(this.dropInterval);
        if (this.running) this._startDrops();
    }

    public setDropReverbLevel(value: number) {
        this.params.dropReverbLevel = value;
        this.wetGain.gain.value = value;
    }

    public setNoiseType(type: NoiseType) {
        this.params.noiseType = type;
        this._startNoise();
    }

    public setNoiseFilterFreq(value: number) {
        this.params.noiseFilterFreq = value;
        this.noiseFilter.frequency.value = value;
    }

    public setPanRange(value: number) {
        this.params.dropPanRange = value;
    }

    public setDropQ(value: number) {
        this.params.dropQ = value;
    }

    public setPitchRange(min: number, max: number) {
        this.params.dropMinPitch = min;
        this.params.dropMaxPitch = max;
    }

    public setDecayTime(seconds: number) {
        this.params.dropDecayTime = seconds;
    }

    private _startNoise() {
        if (this.noiseNode) this.noiseNode.stop();
        const bufferSize = 2 * this.audioCtx.sampleRate;
        const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        if (this.params.noiseType === 'white') {
            for (let i = 0; i < bufferSize; i++) {
                output[i] = Math.random() * 2 - 1;
            }
        } else {
            let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
            for (let i = 0; i < bufferSize; i++) {
                const white = Math.random() * 2 - 1;
                b0 = 0.99886 * b0 + white * 0.0555179;
                b1 = 0.99332 * b1 + white * 0.0750759;
                b2 = 0.969 * b2 + white * 0.153852;
                b3 = 0.8665 * b3 + white * 0.3104856;
                b4 = 0.55 * b4 + white * 0.5329522;
                b5 = -0.7616 * b5 - white * 0.016898;
                output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
                output[i] *= 0.11;
                b6 = white * 0.115926;
            }
        }
        this.noiseNode = this.audioCtx.createBufferSource();
        this.noiseNode.buffer = noiseBuffer;
        this.noiseNode.loop = true;
        this.noiseNode.connect(this.noiseGainNode);
        this.noiseNode.start();
        this.noiseGainNode.gain.value = this.params.volume * 0.4;
    }

    private _startDrops() {
        const playDrop = () => {
            const now = this.audioCtx.currentTime;
            const duration = Math.min(this.params.dropDecayTime, 0.2);
            const buffer = this.audioCtx.createBuffer(1, this.audioCtx.sampleRate * duration, this.audioCtx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < data.length; i++) {
                const fade = Math.pow(1 - i / data.length, 2.5);
                data[i] = (Math.random() * 2 - 1) * fade;
            }
            const drop = this.audioCtx.createBufferSource();
            drop.buffer = buffer;

            const filter = this.audioCtx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.value = this.params.dropMinPitch + Math.random() * (this.params.dropMaxPitch - this.params.dropMinPitch);
            filter.Q.value = this.params.dropQ;

            const pan = this.audioCtx.createStereoPanner();
            pan.pan.value = (Math.random() * 2 - 1) * this.params.dropPanRange;

            const dryGain = this.audioCtx.createGain();
            dryGain.gain.value = this.params.dropDryLevel;

            drop.connect(filter);
            filter.connect(pan);
            pan.connect(this.dropGainNode);
            pan.connect(dryGain);
            dryGain.connect(this.dryDropGainNode);

            drop.start(now);
        };

        if (this.dropInterval) clearInterval(this.dropInterval);
        const interval = 1000 / this.params.dropRate;
        this.dropInterval = setInterval(playDrop, interval);
    }

    public connect(node: AudioNode) {
        this.output.connect(node);
    }

    public disconnect() {
        this.output.disconnect();
    }
}
