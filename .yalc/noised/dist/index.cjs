"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  NoiseDController: () => NoiseDController,
  RainGenerator: () => RainGenerator,
  ThunderGenerator: () => ThunderGenerator,
  _defaultNoiseDParams: () => _defaultNoiseDParams,
  _defaultRainParams: () => _defaultRainParams,
  _defaultThunderParams: () => _defaultThunderParams
});
module.exports = __toCommonJS(index_exports);

// src/RainGenerator.ts
var _defaultRainParams = {
  volume: 0.5,
  noiseLevel: 0.2,
  noiseType: "pink",
  noiseFilterFreq: { value: 4e3, osc: false, amp: 1e3, freq: 0.1 },
  eqGains: new Array(10).fill(0),
  dropDryLevel: 0.5,
  dropWetLevel: 0.5,
  dropRate: 30,
  dropMinPitch: { value: 300, osc: false, amp: 100, freq: 0.1 },
  dropMaxPitch: { value: 800, osc: false, amp: 500, freq: 0.1 },
  dropDecayTime: 0.2,
  dropReverbLevel: { value: 0.4, osc: false, amp: 0.2, freq: 0.1 },
  dropPanRange: { value: 1, osc: false, amp: 0.5, freq: 0.1 },
  dropQ: 1
};
var RainGenerator = class {
  constructor(audioCtx, params) {
    this.eqFrequencies = [31, 62, 125, 250, 500, 1e3, 2e3, 4e3, 8e3, 16e3];
    this.audioCtx = audioCtx;
    this.output = this.audioCtx.createGain();
    this.noiseGainNode = this.audioCtx.createGain();
    this.noiseFilter = this.audioCtx.createBiquadFilter();
    this.noiseFilter.type = "lowpass";
    this.dropGainNode = this.audioCtx.createGain();
    this.dryDropGainNode = this.audioCtx.createGain();
    this.reverbNode = this.audioCtx.createConvolver();
    this.dryGain = this.audioCtx.createGain();
    this.wetGain = this.audioCtx.createGain();
    this.noiseNode = null;
    this.dropInterval = null;
    this.running = false;
    this.lfoMap = /* @__PURE__ */ new Map();
    this.params = { ..._defaultRainParams, ...params };
    this.eqBands = this.eqFrequencies.map((freq) => {
      const band = this.audioCtx.createBiquadFilter();
      band.type = "peaking";
      band.frequency.value = freq;
      band.Q.value = 1;
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
  }
  destroy() {
    this.stop();
    this.output.disconnect();
    this.noiseGainNode.disconnect();
    this.noiseFilter.disconnect();
    this.dropGainNode.disconnect();
    this.dryDropGainNode.disconnect();
    this.reverbNode.disconnect();
    this.dryGain.disconnect();
    this.wetGain.disconnect();
    this.eqBands.forEach((band) => band.disconnect());
    this.lfoMap.forEach(({ osc, gain }) => {
      osc.disconnect();
      gain.disconnect();
    });
    this.lfoMap.clear();
    this.noiseNode = null;
    this.dropInterval = null;
  }
  _connectNodes() {
    this.noiseGainNode.connect(this.noiseFilter);
    this.noiseFilter.connect(this.dryGain);
    this.dropGainNode.connect(this.reverbNode);
    this.reverbNode.connect(this.wetGain);
    this.dryDropGainNode.connect(this.eqBands[0]);
    this.dryGain.connect(this.eqBands[0]);
    this.wetGain.connect(this.eqBands[0]);
  }
  _generateImpulseResponse() {
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
  setOscParam(param, target, id) {
    const now = this.audioCtx.currentTime;
    const prev = this.lfoMap.get(id);
    if (prev) {
      prev.osc.stop();
      prev.osc.disconnect();
      prev.gain.disconnect();
      this.lfoMap.delete(id);
    }
    target.cancelScheduledValues(now);
    target.setValueAtTime(param.value, now);
    if (this.running && param.osc) {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.value = param.freq;
      gain.gain.value = param.amp;
      osc.connect(gain);
      gain.connect(target);
      osc.start();
      this.lfoMap.set(id, { osc, gain });
    }
  }
  async start() {
    if (this.running) return;
    if (this.audioCtx instanceof AudioContext && this.audioCtx.state === "suspended") {
      await this.audioCtx.resume();
    }
    this.running = true;
    const now = this.audioCtx.currentTime;
    this.output.gain.setValueAtTime(this.params.volume, now);
    this.noiseGainNode.gain.setValueAtTime(this.params.volume * 0.4, now);
    this.dropGainNode.gain.setValueAtTime(this.params.dropWetLevel, now);
    this.dryDropGainNode.gain.setValueAtTime(this.params.dropDryLevel, now);
    this.dryGain.gain.setValueAtTime(this.params.noiseLevel, now);
    this.wetGain.gain.setValueAtTime(this.params.dropReverbLevel.value, now);
    this.setNoiseType(this.params.noiseType);
    this.setNoiseFilterFreq(this.params.noiseFilterFreq);
    this.setDropReverbLevel(this.params.dropReverbLevel);
    this.setDropRate(this.params.dropRate);
    this.setPanRange(this.params.dropPanRange);
    this._startDrops();
  }
  stop() {
    this.running = false;
    if (this.noiseNode) {
      this.noiseNode.stop();
      this.noiseNode.disconnect();
      this.noiseNode = null;
    }
    if (this.dropInterval) {
      clearInterval(this.dropInterval);
      this.dropInterval = null;
    }
    this.lfoMap.forEach(({ osc, gain }) => {
      osc.stop();
      osc.disconnect();
      gain.disconnect();
    });
    this.lfoMap.clear();
    const now = this.audioCtx.currentTime;
    this.output.gain.setValueAtTime(0, now);
    this.noiseGainNode.gain.setValueAtTime(0, now);
    this.dropGainNode.gain.setValueAtTime(0, now);
    this.dryDropGainNode.gain.setValueAtTime(0, now);
    this.dryGain.gain.setValueAtTime(0, now);
    this.wetGain.gain.setValueAtTime(0, now);
  }
  setNoiseFilterFreq(param) {
    this.params.noiseFilterFreq = param;
    this.setOscParam(param, this.noiseFilter.frequency, "noiseFilterFreq");
  }
  setDropReverbLevel(param) {
    this.params.dropReverbLevel = param;
    this.setOscParam(param, this.wetGain.gain, "dropReverbLevel");
  }
  setDropRate(param) {
    this.params.dropRate = param;
    if (this.dropInterval) clearInterval(this.dropInterval);
    if (this.running) this._startDrops();
  }
  setPanRange(param) {
    this.params.dropPanRange = param;
  }
  setPitchRange(min, max) {
    this.params.dropMinPitch = min;
    this.params.dropMaxPitch = max;
  }
  setDecayTime(param) {
    this.params.dropDecayTime = param;
  }
  setNoiseLevel(value) {
    this.dryGain.gain.value = value;
  }
  setDropDryLevel(value) {
    this.dryDropGainNode.gain.value = value;
  }
  setDropWetLevel(value) {
    this.dropGainNode.gain.value = value;
  }
  setDropQ(value) {
    this.params.dropQ = value;
  }
  setVolume(value) {
    this.output.gain.value = value;
  }
  setNoiseType(type) {
    this.params.noiseType = type;
    if (this.running) {
      this._startNoise();
    }
  }
  setParams(newParams) {
    this._applyParams(newParams);
  }
  _applyParams(newParams) {
    const updated = { ...this.params, ...newParams };
    if (newParams.eqGains?.length === this.eqBands.length) {
      newParams.eqGains.forEach((gain, i) => {
        this.eqBands[i].gain.value = gain;
      });
    }
    this.params = updated;
  }
  _startNoise() {
    if (this.noiseNode) {
      this.noiseNode.stop();
      this.noiseNode.disconnect();
      this.noiseNode = null;
    }
    const bufferSize = 2 * this.audioCtx.sampleRate;
    const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    if (this.params.noiseType === "white") {
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
  }
  _startDrops() {
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
      filter.type = "bandpass";
      filter.frequency.value = this.params.dropMinPitch.value + Math.random() * (this.params.dropMaxPitch.value - this.params.dropMinPitch.value);
      filter.Q.value = this.params.dropQ;
      const pan = this.audioCtx.createStereoPanner();
      pan.pan.value = (Math.random() * 2 - 1) * this.params.dropPanRange.value;
      const dryGain = this.audioCtx.createGain();
      dryGain.gain.value = this.params.dropDryLevel;
      drop.connect(filter);
      filter.connect(pan);
      pan.connect(this.dropGainNode);
      pan.connect(dryGain);
      dryGain.connect(this.dryDropGainNode);
      drop.start(now);
    };
    const baseRate = this.params.dropRate;
    const baseInterval = 1e3 / baseRate;
    this.dropInterval = setInterval(playDrop, baseInterval);
  }
  connect(node) {
    this.output.connect(node);
  }
  disconnect() {
    this.output.disconnect();
  }
};

// src/functions/createImpulseResponse.ts
function createImpulseResponse(ctx, duration = 2, decay = 2) {
  const sampleRate = ctx.sampleRate;
  const length = sampleRate * duration;
  const impulse = ctx.createBuffer(2, length, sampleRate);
  for (let channel = 0; channel < 2; channel++) {
    const channelData = impulse.getChannelData(channel);
    for (let i = 0; i < length; i++) {
      channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
    }
  }
  return impulse;
}

// src/ThunderGenerator.ts
var _defaultThunderParams = {
  volume: {
    value: 0.5,
    rand: false,
    dist: 0.2
  },
  duration: {
    value: 2,
    rand: false,
    dist: 0.2
  },
  filterFreq: {
    value: 750,
    rand: false,
    dist: 500
  },
  burstCount: {
    value: 3,
    rand: false,
    dist: 1
  },
  delayMs: 0,
  reverbDuration: {
    value: 2,
    rand: false,
    dist: 0.5
  },
  reverbDecay: {
    value: 2,
    rand: false,
    dist: 0.5
  },
  reverbWetLevel: {
    value: 0.4,
    rand: false,
    dist: 0.2
  },
  subLevel: {
    value: 0.1,
    rand: false,
    dist: 0.1
  },
  panRange: {
    value: 1,
    rand: false,
    dist: 0.5
  },
  highPassFreq: {
    value: 20,
    rand: false,
    dist: 5
  },
  crackleAmount: {
    value: 1,
    rand: false,
    dist: 0.5
  },
  eqGains: new Array(10).fill(0),
  rumbleFreqStart: {
    value: 30,
    rand: false,
    dist: 5
  },
  rumbleFreqEnd: {
    value: 20,
    rand: false,
    dist: 5
  },
  rumbleVolume: {
    value: 0.05,
    rand: false,
    dist: 0.1
  },
  rumbleDecay: {
    value: 8,
    rand: false,
    dist: 2
  }
};
var ThunderGenerator = class {
  constructor(audioCtx, params) {
    this.reverbBuffer = null;
    this.eqBands = [];
    this.eqFrequencies = [31, 62, 125, 250, 500, 1e3, 2e3, 4e3, 8e3, 16e3];
    this.ctx = audioCtx;
    this.params = { ..._defaultThunderParams, ...params };
    this.output = this.ctx.createGain();
    this.limiter = this.ctx.createDynamicsCompressor();
    this.limiter.threshold.setValueAtTime(-6, this.ctx.currentTime);
    this.limiter.knee.setValueAtTime(30, this.ctx.currentTime);
    this.limiter.ratio.setValueAtTime(12, this.ctx.currentTime);
    this.limiter.attack.setValueAtTime(3e-3, this.ctx.currentTime);
    this.limiter.release.setValueAtTime(0.25, this.ctx.currentTime);
    this.eqBands = this.eqFrequencies.map((freq) => {
      const band = this.ctx.createBiquadFilter();
      band.type = "peaking";
      band.frequency.value = freq;
      band.Q.value = 1;
      band.gain.value = 0;
      return band;
    });
    let last = this.eqBands[0];
    for (let i = 1; i < this.eqBands.length; i++) {
      last.connect(this.eqBands[i]);
      last = this.eqBands[i];
    }
    last.connect(this.output);
    this.output.connect(this.limiter);
  }
  destroy() {
    this.output.disconnect();
    this.limiter.disconnect();
    this.eqBands.forEach((band) => band.disconnect());
    this.reverbBuffer = null;
  }
  setGeneratedReverb() {
    const duration = this.params.reverbDuration?.value ? this.params.reverbDuration.rand ? this.params.reverbDuration.value + Math.random() * this.params.reverbDuration.dist : this.params.reverbDuration.value : 2;
    const decay = this.params.reverbDecay?.value ? this.params.reverbDecay.rand ? this.params.reverbDecay.value + Math.random() * this.params.reverbDecay.dist : this.params.reverbDecay.value : 2;
    this.reverbBuffer = createImpulseResponse(
      this.ctx,
      duration,
      decay
    );
  }
  triggerThunder() {
    const delay = this.params.delayMs ?? 0;
    const rumbleFreqStart = this.params.rumbleFreqStart?.value ? this.params.rumbleFreqStart.rand ? this.params.rumbleFreqStart.value + Math.random() * this.params.rumbleFreqStart.dist : this.params.rumbleFreqStart.value : 30;
    const rumbleFreqEnd = this.params.rumbleFreqEnd?.value ? this.params.rumbleFreqEnd.rand ? this.params.rumbleFreqEnd.value + Math.random() * this.params.rumbleFreqEnd.dist : this.params.rumbleFreqEnd.value : 20;
    const rumbleVolume = this.params.rumbleVolume?.value ? this.params.rumbleVolume.rand ? this.params.rumbleVolume.value + Math.random() * this.params.rumbleVolume.dist : this.params.rumbleVolume.value : 0.2;
    const rumbleDecay = this.params.rumbleDecay?.value ? this.params.rumbleDecay.rand ? this.params.rumbleDecay.value + Math.random() * this.params.rumbleDecay.dist : this.params.rumbleDecay.value : 8;
    const burstCount = this.params.burstCount?.value ? this.params.burstCount.rand ? this.params.burstCount.value + Math.random() * this.params.burstCount.dist : this.params.burstCount.value : 1;
    const duration = this.params.duration?.value ? this.params.duration.rand ? this.params.duration.value + Math.random() * this.params.duration.dist : this.params.duration.value : 2;
    const volume = this.params.volume?.value ? this.params.volume.rand ? this.params.volume.value + Math.random() * this.params.volume.dist : this.params.volume.value : 0.5;
    setTimeout(() => {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(rumbleFreqStart, now);
      osc.frequency.linearRampToValueAtTime(rumbleFreqEnd, now + rumbleDecay);
      gain.gain.setValueAtTime(rumbleVolume, now);
      gain.gain.exponentialRampToValueAtTime(1e-3, now + rumbleDecay);
      osc.connect(gain).connect(this.eqBands[0]);
      osc.start();
      osc.stop(now + rumbleDecay);
      for (let i = 0; i < burstCount; i++) {
        const burstDelay = 200 + Math.random() * 400;
        setTimeout(() => this._playSingleBurst(
          duration * (0.8 + Math.random() * 0.4),
          volume * (0.7 + Math.random() * 0.6)
        ), burstDelay * i);
      }
    }, delay);
  }
  setParams(newParams) {
    this._applyParams(newParams);
  }
  _applyParams(newParams) {
    const updated = { ...this.params, ...newParams };
    if (newParams.eqGains && newParams.eqGains.length === this.eqBands.length) {
      newParams.eqGains.forEach((gain, i) => {
        this.eqBands[i].gain.value = gain;
      });
    }
    this.params = updated;
  }
  _playSingleBurst(duration, volume) {
    const filterFreq = this.params.filterFreq?.value ? this.params.filterFreq.rand ? this.params.filterFreq.value + Math.random() * this.params.filterFreq.dist : this.params.filterFreq.value : 1500;
    const highPassFreq = this.params.highPassFreq?.value ? this.params.highPassFreq.rand ? this.params.highPassFreq.value + Math.random() * this.params.highPassFreq.dist : this.params.highPassFreq.value : 10;
    const panRange = this.params.panRange?.value ? this.params.panRange.rand ? this.params.panRange.value + Math.random() * this.params.panRange.dist : this.params.panRange.value : 1;
    const reverbWetLevel = this.params.reverbWetLevel?.value ? this.params.reverbWetLevel.rand ? this.params.reverbWetLevel.value + Math.random() * this.params.reverbWetLevel.dist : this.params.reverbWetLevel.value : 0.4;
    const subLevel = this.params.subLevel?.value ? this.params.subLevel.rand ? this.params.subLevel.value + Math.random() * this.params.subLevel.dist : this.params.subLevel.value : 0.1;
    const crackleAmount = this.params.crackleAmount?.value ? this.params.crackleAmount.rand ? this.params.crackleAmount.value + Math.random() * this.params.crackleAmount.dist : this.params.crackleAmount.value : 1;
    const now = this.ctx.currentTime;
    const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * duration, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      const buildUp = Math.min(1, i / (this.ctx.sampleRate * (duration * 0.25)));
      const decay = Math.exp(-i / (this.ctx.sampleRate * duration));
      const noise2 = (Math.random() * 2 - 1) * Math.pow(Math.random(), 2);
      data[i] = noise2 * decay * buildUp;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const lowpass = this.ctx.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.setValueAtTime(filterFreq, now);
    lowpass.frequency.exponentialRampToValueAtTime(100, now + duration);
    const highpass = this.ctx.createBiquadFilter();
    highpass.type = "highpass";
    highpass.frequency.value = highPassFreq;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(volume * 0.8, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(volume * 0.5, now + duration * 0.9);
    gain.gain.exponentialRampToValueAtTime(1e-3, now + duration * 3);
    const pan = this.ctx.createStereoPanner();
    const basePan = (Math.random() * 2 - 1) * (panRange * 0.3);
    pan.pan.setValueAtTime(basePan, now);
    pan.pan.linearRampToValueAtTime(-basePan, now + duration);
    noise.connect(lowpass).connect(highpass).connect(gain).connect(pan).connect(this.eqBands[0]);
    if (this.reverbBuffer) {
      const convolver = this.ctx.createConvolver();
      convolver.buffer = this.reverbBuffer;
      const preVerbFilter = this.ctx.createBiquadFilter();
      preVerbFilter.type = "highpass";
      preVerbFilter.frequency.value = 80;
      const wetGain = this.ctx.createGain();
      wetGain.gain.value = reverbWetLevel;
      gain.connect(preVerbFilter).connect(convolver).connect(wetGain).connect(this.eqBands[0]);
    }
    const rumbleOsc = this.ctx.createOscillator();
    rumbleOsc.type = "sine";
    rumbleOsc.frequency.setValueAtTime(25, now);
    rumbleOsc.frequency.linearRampToValueAtTime(15, now + duration);
    const subGain = this.ctx.createGain();
    subGain.gain.setValueAtTime(subLevel * volume * 0.6, now);
    subGain.gain.exponentialRampToValueAtTime(1e-3, now + duration * 2.5);
    rumbleOsc.connect(subGain).connect(this.eqBands[0]);
    rumbleOsc.start();
    rumbleOsc.stop(now + duration * 2.5);
    const tailBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * duration * 1.5, this.ctx.sampleRate);
    const tailData = tailBuffer.getChannelData(0);
    let lastOut = 0;
    for (let i = 0; i < tailData.length; i++) {
      const white = Math.random() * 2 - 1;
      lastOut = (lastOut + 0.02 * white * crackleAmount) / (1.02 + crackleAmount * 0.05);
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
    brownGain.gain.setValueAtTime(volume * 0.6, now);
    brownGain.gain.exponentialRampToValueAtTime(1e-3, now + duration * 2.5);
    brown.connect(brownHighPass).connect(brownLowpass).connect(brownGain).connect(this.eqBands[0]);
    noise.start();
    brown.start();
  }
  connect(node) {
    this.output.connect(node);
  }
};

// src/NoiseDController.ts
var _defaultNoiseDParams = {
  masterVolume: 0.5,
  delayBetweenThunders: { min: 5e3, max: 15e3 },
  eqGains: new Array(10).fill(0),
  rainParams: { ..._defaultRainParams, on: true },
  thunderParams: { ..._defaultThunderParams, on: true }
};
var NoiseDController = class _NoiseDController {
  constructor(ctx, params = {}) {
    this.eqBands = [];
    this.eqFrequencies = [31, 62, 125, 250, 500, 1e3, 2e3, 4e3, 8e3, 16e3];
    this.thunderTimeout = null;
    this.running = false;
    this.ctx = ctx;
    this.params = { ..._defaultNoiseDParams, ...params };
    this.masterGain = this.ctx.createGain();
    this.rain = new RainGenerator(this.ctx, this.params.rainParams);
    this.thunder = new ThunderGenerator(this.ctx, this.params.thunderParams);
    this.eqBands = this.eqFrequencies.map((freq) => {
      const band = this.ctx.createBiquadFilter();
      band.type = "peaking";
      band.frequency.value = freq;
      band.Q.value = 1;
      band.gain.value = 0;
      return band;
    });
    let last = this.eqBands[0];
    for (let i = 1; i < this.eqBands.length; i++) {
      last.connect(this.eqBands[i]);
      last = this.eqBands[i];
    }
    this.rain.connect(this.eqBands[0]);
    this.thunder.connect(this.eqBands[0]);
    last.connect(this.masterGain);
    this.masterGain.connect(this.ctx.destination);
    this._applyParams();
  }
  destroy() {
    this.stop();
    this.eqBands.forEach((band) => band.disconnect());
    this.eqBands = [];
    this.masterGain.disconnect();
    this.rain.destroy();
    this.thunder.destroy();
    this.thunderTimeout = null;
  }
  start() {
    if (this.running) return;
    this.running = true;
    if (this.params.rainParams.on) {
      this.rain.start();
    }
    if (this.params.thunderParams.on) {
      this.scheduleThunder();
    }
  }
  stop() {
    this.running = false;
    this.rain.stop();
    if (this.thunderTimeout) {
      clearTimeout(this.thunderTimeout);
      this.thunderTimeout = null;
    }
  }
  startRain() {
    this.params.rainParams.on = true;
    this.rain.start();
  }
  stopRain() {
    this.params.rainParams.on = false;
    this.rain.stop();
  }
  startThunder() {
    this.params.thunderParams.on = true;
    this.scheduleThunder();
  }
  stopThunder() {
    this.params.thunderParams.on = false;
    if (this.thunderTimeout) {
      clearTimeout(this.thunderTimeout);
      this.thunderTimeout = null;
    }
  }
  setMasterVolume(value) {
    this.params.masterVolume = value;
    this.masterGain.gain.setValueAtTime(value, this.ctx.currentTime);
  }
  setDelayBetweenThunders(value) {
    this.params.delayBetweenThunders = value;
  }
  setEqGain(index, value) {
    if (index < 0 || index >= this.eqBands.length) return;
    this.params.eqGains[index] = value;
    this.eqBands[index].gain.setValueAtTime(value, this.ctx.currentTime);
  }
  updateRainParams(newRainParams) {
    this.params.rainParams = { ...this.params.rainParams, ...newRainParams };
    this.rain.setParams(this.params.rainParams);
  }
  updateThunderParams(newThunderParams) {
    this.params.thunderParams = { ...this.params.thunderParams, ...newThunderParams };
    this.thunder.setParams(this.params.thunderParams);
  }
  _applyParams() {
    this.setMasterVolume(this.params.masterVolume);
    if (this.params.eqGains.length === this.eqBands.length) {
      this.params.eqGains.forEach((gain, i) => {
        this.eqBands[i].gain.setValueAtTime(gain, this.ctx.currentTime);
      });
    }
    this.rain.setParams(this.params.rainParams);
    this.thunder.setParams(this.params.thunderParams);
  }
  scheduleThunder() {
    if (!this.running || !this.params.thunderParams.on) return;
    const delay = this._rand(this.params.delayBetweenThunders.min, this.params.delayBetweenThunders.max);
    this.thunderTimeout = window.setTimeout(() => {
      this.thunder.triggerThunder();
      this.scheduleThunder();
    }, delay);
  }
  _rand(min, max) {
    return Math.random() * (max - min) + min;
  }
  async renderToFile(durationSec) {
    const sampleRate = this.ctx.sampleRate;
    const offlineCtx = new OfflineAudioContext(2, durationSec * sampleRate, sampleRate);
    const controller = new _NoiseDController(offlineCtx, this.params);
    controller.start();
    await offlineCtx.startRendering();
    const buffer = await offlineCtx.startRendering();
    const wavBlob = await this._bufferToWavBlob(buffer);
    return wavBlob;
  }
  async _bufferToWavBlob(buffer) {
    const numOfChan = buffer.numberOfChannels;
    const length = buffer.length * numOfChan * 2 + 44;
    const bufferArray = new ArrayBuffer(length);
    const view = new DataView(bufferArray);
    let offset = 0;
    const writeString = (s) => {
      for (let i = 0; i < s.length; i++) {
        view.setUint8(offset++, s.charCodeAt(i));
      }
    };
    const writeUint32 = (v) => {
      view.setUint32(offset, v, true);
      offset += 4;
    };
    const writeUint16 = (v) => {
      view.setUint16(offset, v, true);
      offset += 2;
    };
    writeString("RIFF");
    writeUint32(length - 8);
    writeString("WAVE");
    writeString("fmt ");
    writeUint32(16);
    writeUint16(1);
    writeUint16(numOfChan);
    writeUint32(buffer.sampleRate);
    writeUint32(buffer.sampleRate * numOfChan * 2);
    writeUint16(numOfChan * 2);
    writeUint16(16);
    writeString("data");
    writeUint32(length - offset - 4);
    const interleaved = new Float32Array(buffer.length * numOfChan);
    for (let ch = 0; ch < numOfChan; ch++) {
      buffer.copyFromChannel(interleaved.subarray(ch, interleaved.length), ch);
    }
    const output = new Int16Array(interleaved.length);
    for (let i = 0; i < interleaved.length; i++) {
      const s = Math.max(-1, Math.min(1, interleaved[i]));
      output[i] = s < 0 ? s * 32768 : s * 32767;
    }
    new Uint8Array(bufferArray, offset).set(new Uint8Array(output.buffer));
    return new Blob([bufferArray], { type: "audio/wav" });
  }
  setRainVolume(value) {
    this.params.rainParams.volume = value;
    this.rain.setVolume(value);
  }
  setRainNoiseType(value) {
    this.params.rainParams.noiseType = value;
    this.rain.setNoiseType(value);
  }
  setRainNoiseLevel(value) {
    this.params.rainParams.noiseLevel = value;
    this.rain.setNoiseLevel(value);
  }
  setRainDropDryLevel(value) {
    this.params.rainParams.dropDryLevel = value;
    this.rain.setDropDryLevel(value);
  }
  setRainDropWetLevel(value) {
    this.params.rainParams.dropWetLevel = value;
    this.rain.setDropWetLevel(value);
  }
  setRainDropPanRange(value) {
    this.params.rainParams.dropPanRange = value;
    this.rain.setPanRange(value);
  }
  setRainDropQ(value) {
    this.params.rainParams.dropQ = value;
    this.rain.setDropQ(value);
  }
  setRainDropMinPitch(value) {
    this.params.rainParams.dropMinPitch = value;
    this.rain.setPitchRange(value, this.params.rainParams.dropMaxPitch);
  }
  setRainDropMaxPitch(value) {
    this.params.rainParams.dropMaxPitch = value;
    this.rain.setPitchRange(this.params.rainParams.dropMinPitch, value);
  }
  setRainDropDecayTime(value) {
    this.params.rainParams.dropDecayTime = value;
    this.rain.setDecayTime(value);
  }
  setRainDropRate(value) {
    this.params.rainParams.dropRate = value;
    this.rain.setDropRate(value);
  }
  setRainDropReverbLevel(value) {
    this.params.rainParams.dropReverbLevel = value;
    this.rain.setDropReverbLevel(value);
  }
  setRainNoiseFilterFreq(value) {
    this.params.rainParams.noiseFilterFreq = value;
    this.rain.setNoiseFilterFreq(value);
  }
  setRainEqGain(index, value) {
    const newRainParams = {
      ...this.params.rainParams,
      eqGains: this.params.rainParams.eqGains.map((gain, i) => i === index ? value : gain)
    };
    this.params.rainParams = newRainParams;
    this.rain.setParams(newRainParams);
  }
  setThunderParams(newParams) {
    this.thunder.setParams(newParams);
    this.params.thunderParams = { ...this.params.thunderParams, ...newParams };
    if (newParams.reverbDuration || newParams.reverbDecay) {
      this.thunder.setGeneratedReverb();
    }
  }
  exportParamsAsJSON() {
    return JSON.stringify(this.params, null, 2);
  }
  getAnalyser() {
    const analyser = this.ctx.createAnalyser();
    this.masterGain.connect(analyser);
    return analyser;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  NoiseDController,
  RainGenerator,
  ThunderGenerator,
  _defaultNoiseDParams,
  _defaultRainParams,
  _defaultThunderParams
});
//# sourceMappingURL=index.cjs.map