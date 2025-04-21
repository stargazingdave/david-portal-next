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
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold text-center">🌧️ Rain Synth</h2>

      <div className="flex flex-wrap gap-4">
        <div className='flex flex-col items-center w-fit'>
          <Slider
            label={labels.volume}
            value={params.volume}
            onChange={(value) => updateParam('volume', value)}
            min={0}
            max={1}
            step={0.01}
            wrapperDirection='row'
          />
          <Equalizer gains={params.eqGains} freqs={eqFrequencies} onChange={updateEQBand} />
        </div>

        <SynthSection label="Noise Controls">
          <div className='flex flex-wrap justify-around w-fit gap-8'>
            <div className="flex flex-col items-center gap-2">
              <label>Noise Type</label>
              <select
                value={params.noiseType}
                onChange={(e) => updateParam('noiseType', e.target.value as NoiseType)}
                className="bg-gray-800 text-white border border-gray-600 rounded p-2"
              >
                <option value="pink">Pink</option>
                <option value="white">White</option>
              </select>
            </div>

            <Knob
              label={labels.noiseLevel}
              value={params.noiseLevel}
              onChange={(value) => updateParam('noiseLevel', value)}
              min={0}
              max={1}
              step={0.01}
            />
            <Knob
              label={labels.noiseFilterFreq}
              value={params.noiseFilterFreq}
              onChange={(value) => updateParam('noiseFilterFreq', value)}
              min={20}
              max={8000}
              step={10}
            />
          </div>
        </SynthSection>
      </div>

      <SynthSection label="Drop Controls">
        <div className='flex flex-wrap justify-around w-fit gap-8'>
          <Knob
            label={labels.dropDryLevel}
            value={params.dropDryLevel}
            onChange={(value) => updateParam('dropDryLevel', value)}
            min={0}
            max={1}
            step={0.01}
          />
          <Knob
            label={labels.dropWetLevel}
            value={params.dropWetLevel}
            onChange={(value) => updateParam('dropWetLevel', value)}
            min={0}
            max={1}
            step={0.01}
          />
          <Knob
            label={labels.dropReverbLevel}
            value={params.dropReverbLevel}
            onChange={(value) => updateParam('dropReverbLevel', value)}
            min={0}
            max={1}
            step={0.01}
          />
          <Knob
            label={labels.dropPanRange}
            value={params.dropPanRange}
            onChange={(value) => updateParam('dropPanRange', value)}
            min={0}
            max={1}
            step={0.01}
          />
          <Knob
            label={labels.dropQ}
            value={params.dropQ}
            onChange={(value) => updateParam('dropQ', value)}
            min={0.1}
            max={5}
            step={0.1}
          />
          <Knob
            label={labels.dropRate}
            value={params.dropRate}
            onChange={(value) => updateParam('dropRate', value)}
            min={0.1}
            max={100}
            step={0.1}
          />
          <Knob
            label={labels.dropMinPitch}
            value={params.dropMinPitch}
            onChange={(value) => updateParam('dropMinPitch', value)}
            min={100}
            max={4000}
            step={1}
          />
          <Knob
            label={labels.dropMaxPitch}
            value={params.dropMaxPitch}
            onChange={(value) => updateParam('dropMaxPitch', value)}
            min={100}
            max={4000}
            step={1}
          />
          <Knob
            label={labels.dropDecayTime}
            value={params.dropDecayTime}
            onChange={(value) => updateParam('dropDecayTime', value)}
            min={0.005}
            max={1}
            step={0.001}
          />
        </div>
      </SynthSection>
    </div>
  );
}