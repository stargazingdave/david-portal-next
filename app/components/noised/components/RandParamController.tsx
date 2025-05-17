'use client';

import { RandParam } from '../types/RandParam';
import { Knob } from './Knob';
import React from 'react';

interface RandParamControllerProps {
  label: React.ReactNode;
  param: RandParam;
  onChange: (newParam: RandParam) => void;
  valueRange: [number, number];
  ampRange?: [number, number];
  freqRange?: [number, number];
  step?: number;
}

export const RandParamController: React.FC<RandParamControllerProps> = ({
  label,
  param,
  onChange,
  valueRange,
  ampRange = [0, 1],
  freqRange = [0.01, 100],
  step = 0.01,
}) => {
  const update = (updates: Partial<RandParam>) => {
    onChange({ ...param, ...updates });
  };

  return (
    <div className="flex flex-col items-center gap-2 w-40 p-2 rounded bg-[#111] border border-[#333] shadow-inner">
      <div className="text-xs text-[#aaa]">{label}</div>

      <Knob
        value={param.value}
        onChange={(val) => update({ value: val })}
        min={valueRange[0]}
        max={valueRange[1]}
        step={step}
        label="Value"
      />

      <label className="flex items-center gap-2 text-xs mt-1 text-[#ccc]">
        <input
          type="checkbox"
          checked={param.rand}
          onChange={(e) => update({ rand: e.target.checked })}
        />
        Randomize
      </label>

      {param.rand && (
        <div className="flex gap-4 items-center justify-center">
          <Knob
            value={param.dist}
            onChange={(val) => update({ dist: val })}
            min={ampRange[0]}
            max={ampRange[1]}
            step={0.01}
            label="Dist"
          />
        </div>
      )}
    </div>
  );
};
