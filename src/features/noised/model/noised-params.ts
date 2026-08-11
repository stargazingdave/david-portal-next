import type { NoiseDParams } from "noised";
import savedNoisedParams from "../../../../noised-params.json";

export const initialNoisedParams = savedNoisedParams as NoiseDParams;

export function cloneNoisedParams(params: NoiseDParams): NoiseDParams {
    return structuredClone(params);
}
