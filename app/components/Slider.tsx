import { FC, ReactNode } from "react";

interface SliderProps {
    label: ReactNode;
    value: number;
    onChange: (newValue: number) => void;
    min: number;
    max: number;
    step?: number;
    wrapperDirection?: "row" | "column";
}

export const Slider: FC<SliderProps> = ({
    label,
    value,
    onChange,
    min,
    max,
    step,
    wrapperDirection = "column",
}) => {
    return (
        <div className="flex w-full items-center justify-center gap-2" style={{ flexDirection: wrapperDirection }}>
            <label className="text-nowrap">{label}: {value}</label>
            <input
                type="range"
                min={min}
                max={max}
                step={step || ((max - min) / 100)}
                value={value}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                style={{
                    accentColor: "#4caf50",
                    background: `linear-gradient(to right, #4caf50 ${((value - min) / (max - min)) * 100}%, #ddd ${((value - min) / (max - min)) * 100}%)`,
                }}
            />
        </div>
    );
}