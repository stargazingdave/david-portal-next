import { FC, useRef } from "react"

type EqualizerProps = {
    gains: number[]
    freqs: number[]
    onChange: (index: number, value: number) => void
    min?: number
    max?: number
}

export const Equalizer: FC<EqualizerProps> = ({ gains, freqs, onChange, min = -12, max = 12 }) => {
    const containerRef = useRef<HTMLDivElement>(null)

    const handleDrag = (e: React.MouseEvent, index: number) => {
        const container = containerRef.current
        if (!container) return

        const rect = container.getBoundingClientRect()
        const height = rect.height
        const y = e.clientY - rect.top
        const clampedY = Math.max(0, Math.min(height, y))
        const percent = 1 - clampedY / height
        const newValue = min + percent * (max - min)
        onChange(index, Math.round(newValue * 10) / 10)
    }

    const ticks = [
        min,
        Math.round(min + (max - min) * 0.2),
        Math.round(min + (max - min) * 0.4),
        Math.round(min + (max - min) * 0.5),
        Math.round(min + (max - min) * 0.6),
        Math.round(min + (max - min) * 0.8),
        max,
    ]

    return (
        <div className="flex p-4 h-50 w-full">
            {/* Ruler */}
            <div className="h-full flex flex-col justify-between items-end pr-1 text-xs text-gray-500 text-nowrap gap-2">
                <div className="h-full flex flex-col justify-between items-end pr-1 text-xs text-gray-500">
                    {ticks.map((val) => (
                        <div key={val} className="h-fit leading-none">
                            {val} dB
                        </div>
                    ))}

                </div>
                <div className="flex h-fit items-end text-xs mx-2">
                    Hz
                </div>
            </div>

            {/* Bars */}
            <div ref={containerRef} className="flex justify-between items-end h-full w-full text-nowrap">
                {gains.map((gain, i) => {
                    const percent = (gain - min) / (max - min)
                    return (
                        <div
                            key={i}
                            className="flex flex-col items-center w-6 h-full cursor-pointer select-none gap-1"
                            onMouseDown={(e) => {
                                e.preventDefault()
                                const move = (e: MouseEvent) => handleDrag(e as unknown as React.MouseEvent, i)
                                const up = () => {
                                    window.removeEventListener('mousemove', move)
                                    window.removeEventListener('mouseup', up)
                                }
                                window.addEventListener('mousemove', move)
                                window.addEventListener('mouseup', up)
                                handleDrag(e as unknown as React.MouseEvent, i)
                            }}
                        >
                            <div className="relative h-full w-8 bg-gray-700 rounded overflow-hidden">
                                <div
                                    className="absolute bottom-0 w-full bg-sky-500"
                                    style={{ height: `${percent * 100}%` }}
                                />
                            </div>
                            <span className="text-xs mt-1">{formatFrequency(freqs[i])}</span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

function formatFrequency(freq: number) {
    return freq < 1000 ? freq : `${(freq / 1000).toFixed(1)}k`
}