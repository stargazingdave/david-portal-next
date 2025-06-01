import { useRef, useEffect, useState, JSX } from "react";

export type KnobColors = {
    body: string;
    face: string;
    indicator: string;
    track: string;
};

const defaultColors: KnobColors = {
    body: '#222',
    face: '#999',
    indicator: '#000',
    track: '#888',
};

interface KnobProps {
    min?: number;
    max?: number;
    step?: number;
    value: number;
    onChange: (value: number) => void;
    size?: number;
    strokeWidth?: number;
    trackWidth?: number;
    className?: string;
    label?: string;
    disabled?: boolean;
    colors?: Partial<KnobColors>;
}

export const Knob = ({
    min = 0,
    max = 100,
    step = 1,
    value,
    onChange,
    size = 100,
    strokeWidth,
    trackWidth = 1,
    className = "",
    label = "",
    disabled = false,
    colors
}: KnobProps) => {
    const knobRef = useRef<SVGSVGElement>(null);
    const [isDragging, setDragging] = useState(false);
    const [inputValue, setInputValue] = useState(value.toString());

    const roundToDecimals = (val: number, digits: number) => {
        const factor = Math.pow(10, digits);
        return Math.round(val * factor) / factor;
    };

    const getStepPrecision = (step: number): number => {
        const stepStr = step.toString();
        if (stepStr.includes('.')) {
            return stepStr.split('.')[1].length;
        }
        return 0;
    };

    const decimalDigits = getStepPrecision(step);

    useEffect(() => {
        setInputValue(roundToDecimals(value, decimalDigits).toFixed(decimalDigits));
    }, [value]);

    const center = size / 2;
    const radius = center - trackWidth;
    const angleRange = 270; // degrees
    const startAngle = 135;
    const fontSize = size < 70 ? "text-xs" : "text-sm";
    const normalizedStroke = strokeWidth || size * 0.1; // 10% default
    const pointerWidth = normalizedStroke * 0.5;
    const trackColor = colors?.track || defaultColors.track;
    const faceColor = colors?.face || defaultColors.face;
    const bodyColor = colors?.body || defaultColors.body;
    const indicatorColor = colors?.indicator || defaultColors.indicator;

    const clamp = (val: number) => Math.min(max, Math.max(min, val));

    const valueToAngle = (v: number) =>
        ((v - min) / (max - min)) * angleRange + startAngle;

    const angularDistance = (a: number, b: number) => {
        return Math.min((a - b + 360) % 360, (b - a + 360) % 360);
    };

    const angleToValue = (angle: number) => {
        const endAngle = (startAngle + angleRange) % 360;

        const isInRange =
            startAngle < endAngle
                ? angle >= startAngle && angle <= endAngle
                : angle >= startAngle || angle <= endAngle;

        if (!isInRange) {
            const distToStart = angularDistance(angle, startAngle);
            const distToEnd = angularDistance(angle, endAngle);

            return distToStart < distToEnd ? min : max;
        }

        let a = (angle - startAngle + 360) % 360;
        const raw = min + (a / angleRange) * (max - min);
        return Math.round(raw / step) * step;
    };

    const getAngleFromPointer = (e: PointerEvent | TouchEvent): number => {
        const rect = knobRef.current!.getBoundingClientRect();
        const x = "touches" in e ? e.touches[0].clientX : (e as PointerEvent).clientX;
        const y = "touches" in e ? e.touches[0].clientY : (e as PointerEvent).clientY;
        const dx = x - (rect.left + center);
        const dy = y - (rect.top + center);
        const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
        return (angle + 360) % 360;
    };

    const handlePointerMove = (e: PointerEvent | TouchEvent) => {
        if (!isDragging) return;
        e.preventDefault();
        const angle = getAngleFromPointer(e);
        const newValue = clamp(angleToValue(angle));
        onChange(newValue);
    };

    const stopDrag = () => setDragging(false);

    const startDrag = (e: React.PointerEvent | React.TouchEvent) => {
        e.preventDefault();
        setDragging(true);
    };

    useEffect(() => {
        const move = (e: any) => handlePointerMove(e);
        const up = () => stopDrag();

        window.addEventListener("pointermove", move);
        window.addEventListener("pointerup", up);
        window.addEventListener("touchmove", move, { passive: false });
        window.addEventListener("touchend", up);

        return () => {
            window.removeEventListener("pointermove", move);
            window.removeEventListener("pointerup", up);
            window.removeEventListener("touchmove", move);
            window.removeEventListener("touchend", up);
        };
    }, [isDragging]);

    const angle = valueToAngle(value);
    const radians = (angle * Math.PI) / 180;


    const handleKeyDown = (e: React.KeyboardEvent) => {
        let delta = 0;
        if (e.key === "ArrowUp" || e.key === "ArrowRight") delta = step;
        if (e.key === "ArrowDown" || e.key === "ArrowLeft") delta = -step;
        if (e.key === "PageUp") delta = step * 10;
        if (e.key === "PageDown") delta = -step * 10;

        if (delta !== 0) {
            e.preventDefault();
            onChange(clamp(value + delta));
        }
    };

    function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
        const start = polarToCartesian(x, y, radius, endAngle);
        const end = polarToCartesian(x, y, radius, startAngle);
        const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

        return [
            "M", start.x, start.y,
            "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
        ].join(" ");
    }

    const round = (val: number, digits: number = 6) =>
        parseFloat(val.toFixed(digits));

    function polarToCartesian(cx: number, cy: number, r: number, angleInDegrees: number) {
        const angleInRadians = angleInDegrees * Math.PI / 180.0;
        return {
            x: round(cx + r * Math.cos(angleInRadians)),
            y: round(cy + r * Math.sin(angleInRadians))
        };
    }

    function calculateBodyGradient(baseColor: string): { start: string, end: string } {
        const color = baseColor.startsWith('#') ? baseColor.slice(1) : baseColor;
        const r = parseInt(color.slice(0, 2), 16);
        const g = parseInt(color.slice(2, 4), 16);
        const b = parseInt(color.slice(4, 6), 16);

        // Darken the color by reducing RGB values
        const darkenedR = Math.max(0, r - 50).toString(16).padStart(2, '0');
        const darkenedG = Math.max(0, g - 50).toString(16).padStart(2, '0');
        const darkenedB = Math.max(0, b - 50).toString(16).padStart(2, '0');

        return {
            start: `#${darkenedR}${darkenedG}${darkenedB}`,
            end: baseColor
        };
    }

    const bodyGradient = calculateBodyGradient(bodyColor);

    function renderTicks(count: number, radius: number, center: number) {
        const ticks: JSX.Element[] = [];

        for (let i = 0; i <= count; i++) {
            const percent = i / count;
            const angle = startAngle + percent * angleRange;
            const isMajor = i === 0 || i === count || i === Math.floor(count / 2);
            const tickLength = isMajor ? normalizedStroke * 0.8 : normalizedStroke * 0.4;
            const tickWidth = isMajor ? 2 : 1;

            const start = polarToCartesian(center, center, radius - tickLength, angle);
            const end = polarToCartesian(center, center, radius, angle);

            ticks.push(
                <line
                    key={i}
                    x1={start.x}
                    y1={start.y}
                    x2={end.x}
                    y2={end.y}
                    stroke={trackColor}
                    strokeWidth={tickWidth}
                    strokeLinecap="round"
                />
            );
        }

        return ticks;
    }

    return (
        <div className={`flex flex-col max-w-40 items-center gap-1 font-[courier] ${fontSize} ${disabled ? 'text-amber-200 opacity-50' : 'text-amber-100'} transition ${className}`}>
            <div className="text-center text-wrap">{label}</div>
            <svg
                ref={knobRef}
                width={size}
                height={size}
                tabIndex={0}
                role="slider"
                aria-label={label || 'Knob control'}
                aria-valuemin={min}
                aria-valuemax={max}
                aria-valuenow={value}
                aria-valuetext={`${roundToDecimals(value, decimalDigits)}${label ? ` ${label}` : ''}`}
                aria-disabled={disabled}
                onPointerDown={!disabled ? startDrag : undefined}
                onTouchStart={!disabled ? startDrag : undefined}
                onKeyDown={!disabled ? handleKeyDown : undefined}
                style={{ outline: "none", touchAction: "none", cursor: "pointer" }}
            >
                <title>{label}</title>
                {/* Style Definitions */}
                <defs>
                    <radialGradient id="knob-body-gradient" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor={bodyGradient.start} />
                        <stop offset="100%" stopColor={bodyGradient.end} />
                    </radialGradient>
                </defs>

                {/* Arc Track */}
                {renderTicks(20, radius, center)}
                <path
                    d={describeArc(center, center, radius, startAngle, startAngle + angleRange)}
                    stroke={trackColor}
                    strokeWidth={trackWidth}
                    fill="none"
                    strokeLinecap="round"
                />

                {/* Body Circle */}
                <circle
                    cx={center}
                    cy={center}
                    r={radius * 0.8}
                    stroke="none"
                    fill="url(#knob-body-gradient)"
                />

                {/* Face Circle */}
                <circle
                    cx={center}
                    cy={center}
                    r={radius / 1.9}
                    fill={faceColor}
                    stroke="none"
                />

                {/* Indicator */}
                <line
                    x1={center}
                    y1={center}
                    x2={center + (radius / 1.9 - pointerWidth) * Math.cos(radians)}
                    y2={center + (radius / 1.9 - pointerWidth) * Math.sin(radians)}
                    stroke={indicatorColor}
                    strokeWidth={pointerWidth}
                    strokeLinecap="round"
                />
            </svg>
            <div className="relative w-full flex flex-col items-center justify-between text-[10px]">
                <div className="absolute flex justify-between w-full" style={{ top: -1 * size * 0.2 }}>
                    <span>{min}</span>
                    <span>{max}</span>
                </div>

                <div className="">
                    <input
                        type="text"
                        inputMode="decimal"
                        pattern="[0-9.]*"
                        value={inputValue}
                        aria-label={label || 'Knob value input'}
                        aria-live="polite"
                        onChange={(e) => {
                            setInputValue(e.target.value);
                        }}
                        onBlur={() => {
                            const parsed = parseFloat(inputValue);
                            if (!isNaN(parsed)) onChange(clamp(parsed));
                            else setInputValue(value.toString()); // revert to valid value
                        }}
                        onKeyDown={(e) => {
                            const allowed = [
                                "Backspace", "Tab", "ArrowLeft", "ArrowRight",
                                "Delete", "Enter", ".", "-", "Home", "End"
                            ];
                            if (!allowed.includes(e.key) && !/^\d$/.test(e.key)) {
                                e.preventDefault();
                            }

                            if (e.key === "." && inputValue.includes(".")) {
                                e.preventDefault();
                            }

                            if (e.key === "Enter") {
                                const parsed = parseFloat(inputValue);
                                if (!isNaN(parsed)) onChange(clamp(parsed));
                                else setInputValue(value.toString());
                            }

                            e.stopPropagation();
                        }}
                        className="w-full max-w-[3.5rem] bg-transparent border-none text-xs text-amber-100 font-mono outline-none text-center"
                    />
                </div>
            </div>
        </div>
    );
};

