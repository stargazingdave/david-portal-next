import { FC, useRef, useEffect, useState } from "react";

export type EqualizerProps = {
    gains: number[];
    freqs: number[];
    onChange: (index: number, value: number) => void;
    min?: number;
    max?: number;
    colors?: {
        bar?: string;
        background?: string;
        Hz?: string;
        dB?: string;
    };
    rotateLabels?: number;
    height?: number; // Optional height prop for future use
};

export const Equalizer: FC<EqualizerProps> = ({
    gains,
    freqs,
    onChange,
    min = -12,
    max = 12,
    colors = {},
    rotateLabels,
    height = 200,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const activeTouchIndex = useRef<number | null>(null);

    const [showDbScale, setShowDbScale] = useState<boolean>(true);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const observer = new ResizeObserver(() => {
            const width = container.offsetWidth;
            const minWidth = gains.length * 40; // better estimate
            setShowDbScale(width >= minWidth);
        });

        observer.observe(container);

        return () => {
            observer.disconnect();
        };
    }, [gains.length]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleTouchMove = (e: TouchEvent) => {
            if (activeTouchIndex.current === null) return;
            const touch = e.touches[0];
            if (!touch) return;
            const bar = container.querySelectorAll('[data-index]')[activeTouchIndex.current] as HTMLElement;
            if (!bar) return;
            const barContainer = bar.querySelector(".bar-container") as HTMLElement;
            if (!barContainer) return;
            const rect = barContainer.getBoundingClientRect();
            const y = touch.clientY - rect.top;
            updateGainFromY(activeTouchIndex.current, y, rect.height);
        };

        const handleTouchEnd = () => {
            activeTouchIndex.current = null;
            window.removeEventListener("touchmove", handleTouchMove);
            window.removeEventListener("touchend", handleTouchEnd);
        };

        if (activeTouchIndex.current !== null) {
            window.addEventListener("touchmove", handleTouchMove, { passive: false });
            window.addEventListener("touchend", handleTouchEnd);
        }

        return () => {
            window.removeEventListener("touchmove", handleTouchMove);
            window.removeEventListener("touchend", handleTouchEnd);
        };
    }, [activeTouchIndex.current]);

    const updateGainFromY = (index: number, y: number, height: number) => {
        const clampedY = Math.max(0, Math.min(height, y));
        const percent = 1 - clampedY / height;
        const newValue = min + percent * (max - min);
        onChange(index, Math.round(newValue * 10) / 10);
    };

    const handleMouseDown = (e: React.MouseEvent, index: number) => {
        const bar = e.currentTarget.querySelector(".bar-container") as HTMLElement;
        const rect = bar.getBoundingClientRect();
        const y = e.clientY - rect.top;
        updateGainFromY(index, y, rect.height);

        const move = (moveEvent: MouseEvent) => {
            const moveRect = bar.getBoundingClientRect();
            const moveY = moveEvent.clientY - moveRect.top;
            updateGainFromY(index, moveY, moveRect.height);
        };
        const up = () => {
            window.removeEventListener("mousemove", move);
            window.removeEventListener("mouseup", up);
        };
        window.addEventListener("mousemove", move);
        window.addEventListener("mouseup", up);
    };

    const ticks = [
        max,
        Math.round(min + (max - min) * 0.8),
        Math.round(min + (max - min) * 0.6),
        Math.round(min + (max - min) * 0.5),
        Math.round(min + (max - min) * 0.4),
        Math.round(min + (max - min) * 0.2),
        min,
    ];

    return (
        <div
            style={{
                width: '100%',
                display: 'grid',
                gridTemplateColumns: `repeat(${gains.length + (showDbScale ? 1 : 0)}, 1fr)`,
                gap: '0 4px',
                gridTemplateRows: `1fr auto`, // or `calc(${height}px - 20px) auto` if you need exact
                height: height ? `${height}px` : "100%",

            }}
            ref={containerRef}
        >
            {/* dB Scale */}
            {
                showDbScale &&
                <div className="flex flex-col justify-between text-end text-xs pr-2 h-full flex-shrink-0"
                    style={{ color: colors.dB || "#fff" }}>
                    {ticks.map((val, i) => (
                        <div key={i} className="whitespace-nowrap leading-none">
                            {val} dB
                        </div>
                    ))}
                </div>
            }


            {/* Bars */}
            {gains.map((gain, i) => {
                const percent = (gain - min) / (max - min);
                const height = `${Math.min(Math.max(percent * 100, 0), 100)}%`;

                return <div
                    key={i}
                    role="slider"
                    aria-valuemin={min}
                    aria-valuemax={max}
                    aria-valuenow={gain}
                    aria-label={`Gain at ${formatFrequency(freqs[i])}`}
                    tabIndex={0}
                    onKeyDown={(e) => {
                        let delta = 0;
                        if (e.key === "ArrowUp") delta = 1;
                        if (e.key === "ArrowDown") delta = -1;
                        if (e.key === "PageUp") delta = 5;
                        if (e.key === "PageDown") delta = -5;
                        if (delta !== 0) {
                            e.preventDefault();
                            onChange(i, Math.max(min, Math.min(max, Math.round((gain + delta) * 10) / 10)));
                        }
                    }}
                    onMouseDown={(e) => handleMouseDown(e, i)}
                    onTouchStart={(e) => {
                        const bar = e.currentTarget.querySelector(".bar-container") as HTMLElement;
                        const rect = bar.getBoundingClientRect();
                        const y = e.touches[0].clientY - rect.top;
                        updateGainFromY(i, y, rect.height);
                        activeTouchIndex.current = i;
                    }}
                    style={{ touchAction: 'none' }}
                    data-index={i}
                    className="h-full max-w-4 flex justify-center"
                >
                    <div
                        className="bar-container relative h-full w-4 rounded overflow-hidden"
                        style={{
                            background: colors.background || "#333",
                        }}
                    >
                        <div
                            className="absolute bottom-0 w-full"
                            style={{
                                height,
                                background: colors.bar || "#de006b",
                            }}
                        />
                    </div>
                </div>;
            })}

            {/* Frequency Labels Header */}
            {
                showDbScale &&
                <span
                    className="whitespace-nowrap text-xs text-end pb-0 mb-0 pr-2"
                    style={{ color: colors.Hz || "#fff" }}
                >
                    Hz
                </span>
            }

            {freqs.map((freq, i) => (
                <span
                    key={i}
                    className="max-w-4 pb-0 mb-0 pt-1 whitespace-nowrap text-xs text-center"
                    style={{
                        transform: rotateLabels ? `rotate(${rotateLabels}deg)` : undefined,
                        transformOrigin: "center",
                        color: colors.Hz || "#fff"
                    }}
                >
                    {formatFrequency(freq)}
                </span>
            ))}
        </div>
    );
};

function formatFrequency(freq: number) {
    return freq < 1000 ? `${freq}` : `${(freq / 1000).toFixed(1)}k`;
}
