import React, { useRef, useEffect, useState } from 'react';

export const Knob = ({
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
            newVal = Math.round((Math.min(max, Math.max(min, newVal))) / step) * step;
            newVal = parseFloat(newVal.toFixed(2)); // control precision
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
        <div className="flex flex-col items-center gap-1 font-[courier] text-amber-100">
            {/* Label */}
            <div className="text-sm text-center">{label}</div>
            {/* Knob */}
            <div
                className="relative w-20 h-20 border-2 border-amber-400 rounded-full shadow-inner cursor-grab select-none"
                ref={knobRef}
                onMouseDown={handleDrag}
            >
                {/* Knob Indicator */}
                <div className="absolute top-[10%] left-1/2 w-1 h-[28%] bg-amber-400 transition-transform duration-100 ease-in-out rounded-xs" style={{ transform: `rotate(${deg}deg)`, transformOrigin: 'bottom center' }} />
                {/* Knob Background */}
                <div className="absolute top-2 left-2 right-2 bottom-2 rounded-full z-0 pointer-events-none" style={{ boxShadow: '0 0 8px #d4af37a0, inset 0 0 6px #d4af3730' }} />
            </div>
            <div className="text-xs text-amber-100">{internalVal.toFixed(2)}</div>
        </div>
    );
};
