import { useEffect, useState } from 'react'

export default function StarAnimation() {
    const [particles, setParticles] = useState<{ top: string; left: string }[]>([])

    useEffect(() => {
        // Only run on client
        const newParticles = Array.from({ length: 10 }, () => ({
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
        }))
        setParticles(newParticles)
    }, [])

    return (
        <div className="relative w-96 h-96 flex items-center justify-center">
            {/* Core */}
            <div className="absolute w-16 h-16 rounded-full bg-yellow-700 blur-2xl animate-pulse" />
            <div className="absolute w-28 h-28 rounded-full bg-yellow-100" />

            {/* 3D Ring Simulation */}
            <div className="absolute w-full h-full flex items-center justify-center perspective-3d">
                {/* Inner Tilted Ring */}
                <div className="w-96 h-96 border-8 border-yellow-500 rounded-full opacity-30 animate-spin-slow"
                    style={{
                        transform: 'rotateX(80deg) rotateY(10deg)',
                        boxShadow: '0 0 10px rgba(255, 230, 160, 0.4)',
                    }}
                />

                {/* Outer Depth Ring */}
                <div className="absolute w-80 h-80 border-4 border-yellow-100 rounded-full opacity-10 animate-spin-reverse-slow"
                    style={{
                        transform: 'rotateX(80deg) rotateY(10deg)',
                        boxShadow: '0 0 15px rgba(255, 255, 200, 0.2)',
                    }}
                />
            </div>

            {/* Client-only particles */}
            <div className="absolute inset-0">
                {particles.map((p, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-yellow-200 rounded-full blur-sm opacity-30 animate-float"
                        style={{
                            top: p.top,
                            left: p.left,
                            animationDelay: `${Math.random() * 4}s`,
                        }}
                    />
                ))}
            </div>

            {/* Ambient glow */}
            <div className="absolute w-72 h-72 rounded-full bg-yellow-100 blur-[120px] opacity-10" />
        </div>
    )
}
