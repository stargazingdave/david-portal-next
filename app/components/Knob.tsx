import { FC, ReactNode, useEffect, useRef, useState } from "react";

interface KnobProps {
    label: ReactNode;
    value: number;
    onChange: (newValue: number) => void;
    min: number;
    max: number;
    step?: number;
}

export const Knob: FC<KnobProps> = ({
    label,
    value,
    onChange,
    min,
    max,
    step = (max - min) / 100,
}) => {
    const knobRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const lastAngleRef = useRef<number | null>(null);

    const valueToAngle = (val: number) => {
        return -135 + ((val - min) / (max - min)) * 270;
    };

    const angleToValue = (angle: number) => {
        const clampedAngle = Math.max(-135, Math.min(135, angle));
        const percent = (clampedAngle + 135) / 270;
        const val = min + percent * (max - min);
        const stepped = Math.round(val / step) * step;
        return parseFloat(stepped.toFixed(2));
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging || !knobRef.current) return;

            const rect = knobRef.current.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;

            const dx = e.clientX - cx;
            const dy = e.clientY - cy;

            let angle = Math.atan2(dy, dx) * (180 / Math.PI); // -180..180

            if (angle < -135) angle = -135;
            if (angle > 135) angle = 135;

            // Prevent jumping over the min/max edges
            const last = lastAngleRef.current;
            if (last !== null) {
                const delta = angle - last;
                if (Math.abs(delta) > 180) return; // ignore weird wrap jumps
            }
            lastAngleRef.current = angle;

            const newValue = angleToValue(angle);
            onChange(newValue);
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            lastAngleRef.current = null;
        };

        if (isDragging) {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
        }

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isDragging, min, max, step, onChange]);

    const rotation = valueToAngle(value);

    return (
        <div className="flex flex-col items-center gap-2 select-none">
            <label>{label}</label>
            <div
                ref={knobRef}
                onMouseDown={() => {
                    setIsDragging(true);
                    lastAngleRef.current = valueToAngle(value); // init from current value
                }}
                className="relative w-16 h-16 rounded-full bg-gray-800 border-2 border-gray-600 cursor-pointer"
            >
                <div
                    className="absolute left-1/2 top-1/2 w-[2px] h-6 bg-green-400 origin-bottom"
                    style={{
                        transform: `translate(-50%, -100%) rotate(${rotation}deg)`
                    }}
                />
            </div>
            <label>{value}</label>
        </div>
    );
};
