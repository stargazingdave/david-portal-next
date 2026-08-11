import { describe, expect, it } from "vitest";
import savedNoisedParams from "../../../../noised-params.json";
import { cloneNoisedParams, initialNoisedParams } from "./noised-params";

describe("cloneNoisedParams", () => {
    it("uses the saved demo parameters as its initial state", () => {
        expect(initialNoisedParams).toEqual(savedNoisedParams);
    });

    it("creates an independent deep clone", () => {
        const original = structuredClone(initialNoisedParams);
        const clone = cloneNoisedParams(original);

        clone.eqGains[0] += 1;
        clone.rainParams.eqGains[0] += 1;

        expect(clone).not.toBe(original);
        expect(clone.rainParams).not.toBe(original.rainParams);
        expect(clone.eqGains[0]).not.toBe(original.eqGains[0]);
        expect(clone.rainParams.eqGains[0]).not.toBe(original.rainParams.eqGains[0]);
    });
});
