import type { NoiseDParams } from "noised";

export function cloneNoisedParams(params: NoiseDParams): NoiseDParams {
    return structuredClone(params);
}
