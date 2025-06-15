'use client';

import { OscParam } from '../types/OscParam';
import { AmpToggleSwitch } from './AmpToggleSwitch';
import { Knob } from './Knob';
import React from 'react';

interface OscParamControllerProps {
  label: React.ReactNode;
  param: OscParam;
  onChange: (newParam: OscParam) => void;
  valueRange: [number, number];
  ampRange?: [number, number];
  freqRange?: [number, number];
  step?: number;
}

export const OscParamController: React.FC<OscParamControllerProps> = ({
  label,
  param,
  onChange,
  valueRange,
  ampRange = [0, 1],
  freqRange = [0.01, 100],
  step = 0.01,
}) => {
  const update = (updates: Partial<OscParam>) => {
    onChange({ ...param, ...updates });
  };

  return (
    <div className="h-fit flex flex-col gap-2 p-2">
      <div className="font-bold">{label}</div>

      <div className='h-fit flex items-end gap-4'>
        <div className='h-full flex flex-col items-center gap-2'>
          <Knob
            value={param.value}
            onChange={(val) => update({ value: val })}
            min={valueRange[0]}
            max={valueRange[1]}
            step={step}
            label="Value"
            size={80}
            trackWidth={0}
            colors={{
              face: '#de006b',
            }}
          />
        </div>

        <div className="flex flex-col items-center gap-2 h-fit">
          <div className='flex items-center gap-2 text-xs mt-1'>
            <AmpToggleSwitch
              checked={param.osc}
              onChange={(val) => update({ osc: val })}
              label="Oscillator"
            />
            <div className={`w-2 h-2 rounded-full border border-[#222] shadow-sm transition-all duration-300 ${param.osc ? 'bg-red-500 shadow-[0_0_6px_#f00a]' : 'bg-[#220000]'}`} />
          </div>
          <div className="flex gap-4">
            <Knob
              value={param.amp}
              onChange={(val) => update({ amp: val })}
              min={ampRange[0]}
              max={ampRange[1]}
              step={step}
              label="Amp"
              size={50}
              disabled={!param.osc}
              trackWidth={0}
              colors={{
                face: '#de006b',
              }}
            />
            <Knob
              value={param.freq}
              onChange={(val) => update({ freq: val })}
              min={freqRange[0]}
              max={freqRange[1]}
              step={0.01}
              label="Freq"
              size={50}
              disabled={!param.osc}
              trackWidth={0}
              colors={{
                face: '#de006b',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
