'use client';

import { RandParam } from '../types/RandParam';
import { AmpToggleSwitch } from './AmpToggleSwitch';
import { CustomKnob as Knob } from './CustomKnob';
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
    <div className="h-fit flex flex-col gap-2 p-2">
      <div className="font-bold">{label}</div>

      <div className='flex items-end gap-2'>
        <div className='flex flex-col items-center gap-2'>
          <Knob
            value={param.value}
            onChange={(val) => update({ value: val })}
            min={valueRange[0]}
            max={valueRange[1]}
            step={step}
            label="Value"
            size={80}
            colors={{
              face: '#de006b',
            }}
          />
        </div>

        <div className="flex flex-col items-center gap-2 h-fit">
          <div className='flex items-center gap-2 text-xs mt-1'>
            <AmpToggleSwitch
              checked={param.rand}
              onChange={(val) => update({ rand: val })}
              label="Randomize"
            />
            <div className={`w-2 h-2 rounded-full border border-[#222] shadow-sm transition-all duration-300 ${param.rand ? 'bg-red-500 shadow-[0_0_6px_#f00a]' : 'bg-[#220000]'}`} />
          </div>

          <div className="flex gap-4">
            <Knob
              value={param.dist}
              onChange={(val) => update({ dist: val })}
              min={distRange[0]}
              max={distRange[1]}
              step={step}
              label="Dist"
              size={50}
              disabled={!param.rand}
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
