'use client';

import React, { useEffect, useRef, useState } from 'react';
import { RainGenerator, NoiseType } from '../classes/RainGenerator';

export type RainParams = {
  volume: number;
  intensity: number;
  minPitch: number;
  maxPitch: number;
  decayTime: number;
  noiseType: NoiseType;
  dryLevel: number;
  wetLevel: number;
  dropDryLevel: number;
  panRange: number;
  dropQ: number;
};

const defaultParams: RainParams = {
  volume: 0.5,
  intensity: 0.5,
  minPitch: 1000,
  maxPitch: 3000,
  decayTime: 0.05,
  noiseType: 'pink',
  dryLevel: 0,
  wetLevel: 0.5,
  dropDryLevel: 0.2,
  panRange: 1,
  dropQ: 10,
};

const labels: Record<keyof RainParams, string> = {
  volume: 'Master Volume',
  intensity: 'Rain Intensity (drops/sec)',
  minPitch: 'Drop Pitch Min (Hz)',
  maxPitch: 'Drop Pitch Max (Hz)',
  decayTime: 'Drop Length (Decay Time)',
  noiseType: 'Background Noise Type',
  dryLevel: 'Background Noise Volume',
  wetLevel: 'Drop Reverb Level',
  dropDryLevel: 'Drop Dry Level (close)',
  panRange: 'Drop Stereo Spread',
  dropQ: 'Drop Sharpness (Filter Q)',
};

export default function RainSynth() {
  const [params, setParams] = useState<RainParams>(defaultParams);
  const ctxRef = useRef<AudioContext | null>(null);
  const rainRef = useRef<RainGenerator | null>(null);

  useEffect(() => {
    const ctx = new AudioContext();
    const rain = new RainGenerator(ctx);
    rain.setVolume(params.volume);
    rain.setIntensity(params.intensity);
    rain.setPitchRange(params.minPitch, params.maxPitch);
    rain.setDecayTime(params.decayTime);
    rain.setNoiseType(params.noiseType);
    rain.setDryLevel(params.dryLevel);
    rain.setWetLevel(params.wetLevel);
    rain.setDropDryLevel(params.dropDryLevel);
    rain.setPanRange(params.panRange);
    rain.setDropQ(params.dropQ);
    rain.connect(ctx.destination);
    rain.start();

    rainRef.current = rain;
    ctxRef.current = ctx;

    return () => rain.stop();
  }, []);

  const updateParam = (key: keyof RainParams, value: number | NoiseType) => {
    const newParams = { ...params, [key]: value };
    setParams(newParams);
    const rain = rainRef.current;
    if (!rain) return;

    if (key === 'volume') rain.setVolume(value as number);
    if (key === 'intensity') rain.setIntensity(value as number);
    if (key === 'minPitch' || key === 'maxPitch') rain.setPitchRange(newParams.minPitch, newParams.maxPitch);
    if (key === 'decayTime') rain.setDecayTime(value as number);
    if (key === 'noiseType') rain.setNoiseType(value as NoiseType);
    if (key === 'dryLevel') rain.setDryLevel(value as number);
    if (key === 'wetLevel') rain.setWetLevel(value as number);
    if (key === 'dropDryLevel') rain.setDropDryLevel(value as number);
    if (key === 'panRange') rain.setPanRange(value as number);
    if (key === 'dropQ') rain.setDropQ(value as number);
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold text-center">🌧️ Rain Synth</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(params).map(([key, value]) => {
          if (key === 'noiseType') {
            return (
              <div key={key} className="flex flex-col">
                <label>{labels[key as keyof RainParams]}</label>
                <select
                  value={value}
                  onChange={(e) => updateParam(key as keyof RainParams, e.target.value as NoiseType)}
                >
                  <option value="pink">Pink</option>
                  <option value="white">White</option>
                </select>
              </div>
            );
          } else {
            const numericValue = value as number;
            let min = 0, max = 1, step = 0.01;
            if (key === 'minPitch') {
              min = 100;
              max = 2000;
              step = 1;
            } else if (key === 'maxPitch') {
              min = 100;
              max = 3000;
              step = 1;
            } else if (key === 'decayTime') {
              min = 0.005;
              max = 1;
              step = 0.001;
            } else if (key === 'intensity') {
              min = 0.001;
              max = 1;
              step = 0.001;
            } else if (key === 'panRange') {
              max = 1;
              step = 0.01;
            } else if (key === 'dropQ') {
              max = 50;
              step = 0.1;
            }

            return (
              <div key={key} className="flex flex-col">
                <label>{labels[key as keyof RainParams]}: {numericValue}</label>
                <input
                  type="range"
                  min={min}
                  max={max}
                  step={step}
                  value={numericValue}
                  onChange={(e) => updateParam(key as keyof RainParams, parseFloat(e.target.value))}
                />
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}
