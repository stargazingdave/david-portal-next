import React, { useRef, useEffect, useState } from 'react';

export const Knob = ({
    label,
    value,
    min = 0,
    max = 1,
    step = 0.01,
    small = false,
    disabled = false,
    onChange,
}: {
    label: string;
    value: number;
    min?: number;
    max?: number;
    step?: number;
    small?: boolean;
    disabled?: boolean;
    onChange: (newVal: number) => void;
}) => {
    const [internalVal, setInternalVal] = useState(value);
    const knobRef = useRef<HTMLDivElement>(null);
    const deg = ((internalVal - min) / (max - min)) * 270 - 135;

    useEffect(() => setInternalVal(value), [value]);

    const handleDrag = (e: React.MouseEvent) => {
        if (disabled) return;

        const startY = e.clientY;
        const startVal = internalVal;

        const moveHandler = (moveEvent: MouseEvent) => {
            const delta = startY - moveEvent.clientY;
            const range = max - min;
            let newVal = startVal + (delta / 100) * range;
            newVal = Math.round((Math.min(max, Math.max(min, newVal))) / step) * step;
            newVal = parseFloat(newVal.toFixed(2));
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

    const sizeClass = small ? 'w-12 h-12' : 'w-20 h-20';
    const indicatorHeight = small ? 'h-[24%]' : 'h-[28%]';
    const fontSize = small ? 'text-xs' : 'text-sm';
    const knobOpacity = disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-grab';
    const indicatorTopPosition = small ? 'top-[28%]' : 'top-[18%]';

    return (
        <div className={`flex flex-col max-w-40 items-center gap-1 font-[courier] ${fontSize} ${disabled ? 'text-amber-200 opacity-50' : 'text-amber-100'} transition`}>
            <div className="text-center text-wrap">{label}</div>
            <div
                className={`relative ${sizeClass} border-2 border-amber-400 rounded-full shadow-inner select-none ${knobOpacity}`}
                ref={knobRef}
                onMouseDown={handleDrag}
            >
                <div
                    className={`absolute ${indicatorTopPosition} left-1/2 w-1 ${indicatorHeight} origin-bottom transition-transform duration-100 ease-in-out rounded-xs`}
                    style={{
                        transform: `rotate(${deg}deg)`,
                        backgroundColor: disabled ? '#666' : '#fbbf24', // darker if disabled
                    }}
                />
                <div
                    className="absolute top-2 left-2 right-2 bottom-2 rounded-full z-0 pointer-events-none"
                    style={{
                        boxShadow: disabled
                            ? 'inset 0 0 6px #444'
                            : '0 0 8px #d4af37a0, inset 0 0 6px #d4af3730',
                    }}
                />
            </div>
            <div className="text-[10px]">{internalVal.toFixed(2)}</div>
        </div>
    );
};
