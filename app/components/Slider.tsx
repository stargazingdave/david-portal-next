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
                className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-[#111] shadow-inner"
                style={{
                    accentColor: '#00faff',
                    background: `linear-gradient(to right, #00faff ${((value - min) / (max - min)) * 100}%, #333 ${((value - min) / (max - min)) * 100}%)`,
                    boxShadow: 'inset 0 0 6px #00faff66',
                }}
            />
        </div>
    );
}