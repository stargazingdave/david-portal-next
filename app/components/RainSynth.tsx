'use client';

import React, { useEffect, useRef, useState } from 'react';
import { RainGenerator, NoiseType, RainParams } from '../classes/RainGenerator';
import { Equalizer } from '../components/Equalizer';
import { Slider } from './Slider';
import { SynthSection } from './SynthSection';
import { Knob } from './Knob';

const defaultParams: RainParams = {
  volume: 0.5,
  eqGains: new Array(10).fill(0),
  noiseLevel: 0.2,
  noiseType: 'pink',
  noiseFilterFreq: 4000,
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

const labels: Record<keyof RainParams, string> = {
  volume: 'Volume',
  eqGains: 'EQ',
  noiseLevel: 'Noise Level',
  noiseType: 'Noise Type',
  noiseFilterFreq: 'Noise Filter Freq',
  dropDryLevel: 'Drop Dry Level',
  dropWetLevel: 'Drop Wet Level',
  dropRate: 'Drop Rate',
  dropMinPitch: 'Drop Min Pitch',
  dropMaxPitch: 'Drop Max Pitch',
  dropDecayTime: 'Drop Decay Time',
  dropReverbLevel: 'Drop Reverb Level',
  dropPanRange: 'Drop Pan Range',
  dropQ: 'Drop Q',
};

const eqFrequencies = [31, 62, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];

export default function RainSynth() {
  const [params, setParams] = useState<RainParams>(defaultParams);
  const ctxRef = useRef<AudioContext | null>(null);
  const rainRef = useRef<RainGenerator | null>(null);

  useEffect(() => {
    const ctx = new AudioContext();
    const rain = new RainGenerator(ctx, defaultParams);
    rain.connect(ctx.destination);
    rain.start();

    rainRef.current = rain;
    ctxRef.current = ctx;

    return () => rain.stop();
  }, []);

  const updateParam = (key: keyof RainParams, value: any) => {
    const newParams = { ...params, [key]: value };
    setParams(newParams);

    const rain = rainRef.current;
    if (!rain) return;

    if (key === 'volume') rain.setVolume(value);
    if (key === 'noiseType') rain.setNoiseType(value);
    if (key === 'noiseLevel') rain.setNoiseLevel(value);
    if (key === 'dropDryLevel') rain.setDropDryLevel(value);
    if (key === 'dropWetLevel') rain.setDropWetLevel(value);
    if (key === 'dropPanRange') rain.setPanRange(value);
    if (key === 'dropQ') rain.setDropQ(value);
    if (key === 'dropMinPitch' || key === 'dropMaxPitch') {
      rain.setPitchRange(newParams.dropMinPitch, newParams.dropMaxPitch);
    }
    if (key === 'dropDecayTime') rain.setDecayTime(value);
    if (key === 'dropRate') rain.setDropRate(value);
    if (key === 'dropReverbLevel') rain.setDropReverbLevel(value);
    if (key === 'noiseFilterFreq') rain.setNoiseFilterFreq(value);
    if (key === 'eqGains') rain.setEQGains(value);
  };

  const updateEQBand = (index: number, value: number) => {
    const newGains = [...params.eqGains];
    newGains[index] = value;
    updateParam('eqGains', newGains);
  };

  return (
    <div
      className="bg-gradient-to-br from-[#1a1a1a] via-[#2c2c2c] to-[#1a1a1a] rounded-2xl shadow-[0_0_20px_#00faff40] border border-[#00faff40] text-white font-mono divide-y"
      style={{ maxWidth: 1200, margin: '0 auto' }}
    >
      <h2 className="text-2xl font-bold text-center text-[#00faff] tracking-wide drop-shadow-[0_0_4px_#00faff] p-4">
        Rain Synth
      </h2>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 divide-x'>
        <div className="w-full flex flex-col gap-8 p-4">
          <h1>Master Controls</h1>
          <Slider
            label={<span className="text-[#0ff] drop-shadow">{labels.volume}</span>}
            value={params.volume}
            onChange={(value) => updateParam('volume', value)}
            min={0}
            max={1}
            step={0.01}
            wrapperDirection='column'
          />
          <Equalizer gains={params.eqGains} freqs={eqFrequencies} onChange={updateEQBand} />
        </div>

        <div className="w-full flex flex-col gap-8 p-4">
          <h1>Noise Controls</h1>
          <div className="flex flex-wrap justify-center gap-8 text-[#ff0]">
            <div className="flex flex-col w-32 items-center gap-2">
              <label className="text-[#ccc] text-sm">Noise Type</label>
              <select
                value={params.noiseType}
                onChange={(e) => updateParam('noiseType', e.target.value as NoiseType)}
                className="w-full bg-[#111] text-[#0ff] border border-[#555] rounded p-2 shadow-inner hover:shadow-[0_0_5px_#00faff] transition"
              >
                <option value="pink">Pink</option>
                <option value="white">White</option>
              </select>
            </div>

            <Knob
              label={<span className="text-[#0ff]">{labels.noiseLevel}</span>}
              value={params.noiseLevel}
              onChange={(value) => updateParam('noiseLevel', value)}
              min={0}
              max={1}
              step={0.01}
            />
            <Knob
              label={<span className="text-[#0ff]">{labels.noiseFilterFreq}</span>}
              value={params.noiseFilterFreq}
              onChange={(value) => updateParam('noiseFilterFreq', value)}
              min={20}
              max={8000}
              step={10}
            />
          </div>
        </div>
      </div>

      <div className='w-full flex flex-col gap-8 p-4'>
        <h1>Drop Controls</h1>
        <div className="grid grid-cols-4 justify-center gap-6">
          {([
            'dropDryLevel',
            'dropWetLevel',
            'dropReverbLevel',
            'dropPanRange',
            'dropQ',
            'dropRate',
            'dropMinPitch',
            'dropMaxPitch',
            'dropDecayTime',
          ] as (keyof RainParams)[]).map((key) => (
            <Knob
              key={key}
              label={<span className="text-[#0ff] drop-shadow-sm">{labels[key]}</span>}
              value={params[key] as number}
              onChange={(value) => updateParam(key, value)}
              min={key.includes('Pitch') ? 100 : key === 'dropDecayTime' ? 0.005 : 0}
              max={key.includes('Pitch') ? 4000 : key === 'dropDecayTime' ? 1 : key === 'dropRate' ? 100 : key === 'dropQ' ? 5 : 1}
              step={key.includes('Pitch') ? 1 : key === 'dropQ' ? 0.1 : key === 'dropDecayTime' ? 0.001 : 0.01}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
