type ParamWithLimits = {
    value: number;
    min: number;
    max: number;
    step: number;
}

interface AudioGeneratorParams extends Record<string, ParamWithLimits> {
    volume: ParamWithLimits;
}

export interface AudioGenerator {
    ctx: AudioContext;
    impulse: AudioBuffer;
    params: AudioGeneratorParams & { egGains: number[] };
    output: GainNode;
    limiter: DynamicsCompressorNode;

    setParam(param: keyof AudioGeneratorParams, value: number): void;
    getParam(param: keyof AudioGeneratorParams): number;

    play(): void;
    stop(): void;
    connect(destination: AudioNode): void;
}