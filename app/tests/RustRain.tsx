'use client';

import { useEffect, useRef, useState } from 'react';

export default function Home() {
    const [ready, setReady] = useState(false);
    const [rate, setRate] = useState(1); // drops/sec
    const audioCtxRef = useRef<AudioContext | null>(null);
    const generatorRef = useRef<any>(null);
    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        const init = async () => {
            const wasm = await import('../../public/pkg/rain_thunder_gen');
            await wasm.default();
            generatorRef.current = new wasm.DropGenerator(44100);
            generatorRef.current.set_rate(rate);
            generatorRef.current.set_reverb_level(2.6);
            setReady(true);
        };
        init();
    }, []);

    const start = () => {
        if (!ready || !generatorRef.current) return;

        if (intervalRef.current) clearInterval(intervalRef.current);
        if (audioCtxRef.current) audioCtxRef.current.close();

        const ctx = new AudioContext();
        audioCtxRef.current = ctx;
        generatorRef.current.reset();
        generatorRef.current.set_rate(rate);
        generatorRef.current.start();

        intervalRef.current = window.setInterval(() => {
            const samples = generatorRef.current.generate_samples(512);
            const buffer = ctx.createBuffer(1, 512, 44100);
            buffer.copyToChannel(samples, 0);

            const source = ctx.createBufferSource();
            source.buffer = buffer;
            source.connect(ctx.destination);
            source.start();
        }, 512 / 44.1); // ms
    };

    const stop = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        generatorRef.current?.stop();
        audioCtxRef.current?.close();
        audioCtxRef.current = null;
    };

    const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newRate = parseFloat(e.target.value);
        setRate(newRate);
        if (generatorRef.current) {
            generatorRef.current.set_rate(newRate);
        }
    };

    return (
        <main className="p-8">
            <h1 className="text-2xl mb-4">Rain Drop Generator</h1>
            <div className="mb-4">
                <label className="block mb-2">Drop Rate: {rate} per second</label>
                <input
                    type="range"
                    min="0.2"
                    max="20"
                    step="0.1"
                    value={rate}
                    onChange={handleRateChange}
                />
            </div>
            <button className="px-4 py-2 bg-green-500 text-white mr-2" onClick={start} disabled={!ready}>
                Start
            </button>
            <button className="px-4 py-2 bg-red-500 text-white" onClick={stop}>
                Stop
            </button>
        </main>
    );
}
