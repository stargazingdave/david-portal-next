export type NoiseType = 'pink' | 'white';

export class RainGenerator {
    private audioCtx: AudioContext;
    private output: GainNode;
    private noiseGainNode: GainNode;
    private dropGainNode: GainNode;
    private dryDropGainNode: GainNode;
    private reverbNode: ConvolverNode;
    private reverbGain: GainNode;
    private dryGain: GainNode;
    private wetGain: GainNode;
    private noiseFilter: BiquadFilterNode;
    private noiseNode: AudioBufferSourceNode | null;
    private dropInterval: ReturnType<typeof setInterval> | null;
    private running: boolean;

    private intensity = 0.5;
    private dropRate = 10;
    private volume = 0.5;
    private minPitch = 300;
    private maxPitch = 800;
    private decayTime = 0.2;
    private noiseType: NoiseType = 'pink';
    private dropDryLevel = 0.2;
    private panRange = 1.0;
    private dropQ = 10;

    constructor(audioCtx: AudioContext) {
        this.audioCtx = audioCtx;
        this.output = this.audioCtx.createGain();
        this.noiseGainNode = this.audioCtx.createGain();
        this.noiseFilter = this.audioCtx.createBiquadFilter();
        this.noiseFilter.type = 'lowpass';
        this.noiseFilter.frequency.value = 4000;

        this.dropGainNode = this.audioCtx.createGain();
        this.dryDropGainNode = this.audioCtx.createGain();
        this.reverbNode = this.audioCtx.createConvolver();
        this.reverbGain = this.audioCtx.createGain();
        this.dryGain = this.audioCtx.createGain();
        this.wetGain = this.audioCtx.createGain();
        this.noiseNode = null;
        this.dropInterval = null;
        this.running = false;

        this._connectNodes();
        this._generateImpulseResponse();
    }

    private _connectNodes() {
        this.noiseGainNode.connect(this.noiseFilter);
        this.noiseFilter.connect(this.dryGain);

        this.dropGainNode.connect(this.reverbNode);
        this.reverbNode.connect(this.wetGain);

        this.dryDropGainNode.connect(this.output);
        this.dryGain.connect(this.output);
        this.wetGain.connect(this.output);
    }

    private _generateImpulseResponse() {
        const length = this.audioCtx.sampleRate * 0.5;
        const impulse = this.audioCtx.createBuffer(2, length, this.audioCtx.sampleRate);
        for (let channel = 0; channel < 2; channel++) {
            const data = impulse.getChannelData(channel);
            for (let i = 0; i < length; i++) {
                data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 1.5);
            }
        }
        this.reverbNode.buffer = impulse;
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

    public setIntensity(value: number) {
        this.intensity = value;
        this.dropRate = value * 50;
    }

    public setVolume(value: number) {
        this.volume = value;
        this.output.gain.value = value;
    }

    public setDryLevel(value: number) {
        this.dryGain.gain.value = value;
    }

    public setWetLevel(value: number) {
        this.wetGain.gain.value = value;
    }

    public setDropDryLevel(value: number) {
        this.dropDryLevel = value;
        this.dryDropGainNode.gain.value = value;
    }

    public setPanRange(value: number) {
        this.panRange = value;
    }

    public setDropQ(value: number) {
        this.dropQ = value;
    }

    public setPitchRange(min: number, max: number) {
        this.minPitch = min;
        this.maxPitch = max;
    }

    public setDecayTime(seconds: number) {
        this.decayTime = seconds;
    }

    public setNoiseType(type: NoiseType) {
        this.noiseType = type;
        this._startNoise();
    }

    private _startNoise() {
        if (this.noiseNode) this.noiseNode.stop();
        const bufferSize = 2 * this.audioCtx.sampleRate;
        const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        if (this.noiseType === 'white') {
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
        this.noiseGainNode.gain.value = this.intensity * 0.4;
    }

    private _startDrops() {
        const playDrop = () => {
            const now = this.audioCtx.currentTime;
            const duration = Math.min(this.decayTime, 0.15);
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
            filter.frequency.value = this.minPitch + Math.random() * (this.maxPitch - this.minPitch);
            filter.Q.value = this.dropQ;

            const pan = this.audioCtx.createStereoPanner();
            pan.pan.value = (Math.random() * 2 - 1) * this.panRange;

            const dryGain = this.audioCtx.createGain();
            dryGain.gain.value = this.dropDryLevel;

            // Route drop to both reverb and dry
            drop.connect(filter);
            filter.connect(pan);
            pan.connect(this.dropGainNode);
            pan.connect(dryGain);
            dryGain.connect(this.dryDropGainNode);

            drop.start(now);
        };

        const scheduleDrops = () => {
            if (this.dropInterval) clearInterval(this.dropInterval);
            const interval = 1000 / this.dropRate;
            this.dropInterval = setInterval(playDrop, interval);
        };

        scheduleDrops();
    }

    public connect(node: AudioNode) {
        this.output.connect(node);
    }

    public disconnect() {
        this.output.disconnect();
    }
}
