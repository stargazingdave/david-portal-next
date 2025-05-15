// Marshall-style WeatherSynth UI upgrades coming up!

// We'll be building:
// 1. <MarshallKnob /> v2 - LED ring + responsive rotation
// 2. <ToggleSwitch /> - Power-style toggle
// 3. <VUeqMeter /> - Animated bar/VU meter
// 4. PresetControls - Save, Load, Reset
// 5. Amp-style layout with grill cloth + brass border

// Let's start with MarshallKnob v2 in a file called MarshallKnob.tsx:

import React, { useRef, useEffect, useState } from 'react';
import './marshallKnob.css'; // Create this file for custom styling

export const MarshallKnob = ({
    label,
    value,
    min = 0,
    max = 1,
    step = 0.01,
    onChange,
}: {
    label: string;
    value: number;
    min?: number;
    max?: number;
    step?: number;
    onChange: (newVal: number) => void;
}) => {
    const [internalVal, setInternalVal] = useState(value);
    const knobRef = useRef<HTMLDivElement>(null);
    const deg = ((internalVal - min) / (max - min)) * 270 - 135;

    useEffect(() => setInternalVal(value), [value]);

    const handleDrag = (e: React.MouseEvent) => {
        const startY = e.clientY;
        const startVal = internalVal;

        const moveHandler = (moveEvent: MouseEvent) => {
            const delta = startY - moveEvent.clientY;
            const range = max - min;
            let newVal = startVal + (delta / 100) * range;
            newVal = Math.min(max, Math.max(min, parseFloat(newVal.toFixed(3))));
            setInternalVal(newVal);
            onChange(newVal);
        };

        const upHandler = () => {
            document.removeEventListener('mousemove', moveHandler);
            document.removeEventListener('mouseup', upHandler);
        };

        document.addEventListener('mousemove', moveHandler);
        document.addEventListener('mouseup', upHandler);
    };

    return (
        <div className="knob-wrapper">
            <div className="knob-label">{label}</div>
            <div
                className="knob-body"
                ref={knobRef}
                onMouseDown={handleDrag}
            >
                <div className="knob-indicator" style={{ transform: `rotate(${deg}deg)` }} />
                <div className="led-ring" />
            </div>
            <div className="knob-value">{internalVal.toFixed(2)}</div>
        </div>
    );
};
