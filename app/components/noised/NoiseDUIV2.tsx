'use client';

import { useState, useEffect } from "react";
import {
    NoiseDControllerV2,
    defaultRainParamsV2,
    defaultThunderParamsV2,
    RainParamsV2
} from "noised";
import { CustomKnob as Knob } from './components/CustomKnob';
import { Equalizer } from "./components/Equalizer";
import { OscParamController } from "./components/OscParamController";
import { RandParamController } from "./components/RandParamController";

export default function NoiseDUIV2() {
    const [controller, setController] = useState<NoiseDControllerV2 | null>(null);
    const [rainParams, setRainParams] = useState<RainParamsV2.RainParams>(defaultRainParamsV2);
    const [thunderParams, setThunderParams] = useState(defaultThunderParamsV2);

    useEffect(() => {
        const c = new NoiseDControllerV2({
            masterVolume: 0.7,
            eqGains: new Array(10).fill(0),
            rainParams: { ...defaultRainParamsV2, on: true },
            thunderParams: { ...defaultThunderParamsV2, on: true },
        });
        setController(c);
        c.start();

        const loop = () => {
            c.tick(1 / 60);
            requestAnimationFrame(loop);
        };
        loop();

        return () => c.destroy();
    }, []);

    return (
        <div className="p-4 flex flex-col gap-6">
            <h1 className="text-2xl font-bold text-white">NoiseD Weather Synth</h1>

            {/* Master Volume */}
            <Knob
                label="Master Volume"
                value={0.7}
                min={0}
                max={1}
                step={0.01}
                onChange={(v) => controller?.updateParams({ masterVolume: v })}
            />

            {/* Global EQ */}
            <Equalizer
                gains={controller?.getParams().eqGains || []}
                freqs={[60, 170, 310, 600, 1000, 3000, 6000, 12000, 14000, 16000]}
                onChange={(i, val) => {
                    const eqGains = [...(controller?.getParams().eqGains || [])];
                    eqGains[i] = val;
                    controller?.updateParams({ eqGains });
                }}
            />

            {/* Rain */}
            {Object.entries(rainParams.osc.drops).map(([key, param]) => (
                <OscParamController
                    key={key}
                    label={`Drop ${key}`}
                    param={param}
                    onChange={(p) => {
                        const updated = {
                            ...rainParams.osc.drops,
                            [key]: p
                        };
                        const newOsc = {
                            ...rainParams.osc,
                            drops: updated
                        };
                        setRainParams({
                            ...rainParams,
                            osc: newOsc
                        });
                        controller?.updateRainParams({
                            osc: newOsc
                        });
                    }}
                    valueRange={
                        key === "panRange" ? [-1, 1] :
                            key === "reverbLevel" ? [0, 1] :
                                [100, 2000] // default pitch range
                    }
                />
            ))}

            {/* Thunder Volume */}
            <RandParamController
                label="Thunder Volume"
                param={thunderParams.volume}
                onChange={(p) => {
                    setThunderParams({ ...thunderParams, volume: p });
                    controller?.updateThunderParams({ volume: p });
                }}
                valueRange={[0, 1]}
            />
        </div>
    );
}
