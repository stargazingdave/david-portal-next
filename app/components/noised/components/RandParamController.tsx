'use client';

import { RandParam } from '../types/RandParam';
import { AmpToggleSwitch } from './AmpToggleSwitch';
import { Knob } from './NewKnob';
import React from 'react';

interface RandParamControllerProps {
  label: React.ReactNode;
  param: RandParam;
  onChange: (newParam: RandParam) => void;
  valueRange: [number, number];
  distRange?: [number, number];
  step?: number;
}

export const RandParamController: React.FC<RandParamControllerProps> = ({
  label,
  param,
  onChange,
  valueRange,
  distRange = [0, 1],
  step = 0.01,
}) => {
  const update = (updates: Partial<RandParam>) => {
    onChange({ ...param, ...updates });
  };

  return (
    <div className="flex flex-col justify-around gap-2 p-4 rounded bg-[#111] border border-[#333] font-[courier] shadow-inner">
      <div className="text-[#aaa]">{label}</div>
      <div className='flex items-end gap-2'>
        <div className='flex flex-col items-center gap-2'>
          <Knob
            value={param.value}
            onChange={(val) => update({ value: val })}
            min={valueRange[0]}
            max={valueRange[1]}
            step={step}
            label="Value"
          />
        </div>

        <div className="flex flex-col items-center gap-2 h-full">
          <div className='flex items-center gap-2 text-xs mt-1 text-[#ccc]'>
            <AmpToggleSwitch
              checked={param.rand}
              onChange={(val) => update({ rand: val })}
              label="Randomize"
            />
            <div className={`w-2 h-2 rounded-full border border-[#222] shadow-sm transition-all duration-300 ${param.rand ? 'bg-red-500 shadow-[0_0_6px_#f00a]' : 'bg-[#220000]'}`} />
          </div>

          <div className="flex gap-4 items-center justify-center">
            <Knob
              value={param.dist}
              onChange={(val) => update({ dist: val })}
              min={distRange[0]}
              max={distRange[1]}
              step={step}
              label="Dist"
              size={60}
              disabled={!param.rand}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
