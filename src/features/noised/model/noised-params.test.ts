import { describe, expect, it } from "vitest";
import { _defaultNoiseDParams } from "noised";
import { cloneNoisedParams } from "./noised-params";

describe("cloneNoisedParams", () => {
    it("creates an independent deep clone", () => {
        const original = structuredClone(_defaultNoiseDParams);
        const clone = cloneNoisedParams(original);

        clone.eqGains[0] += 1;
        clone.rainParams.eqGains[0] += 1;

        expect(clone).not.toBe(original);
        expect(clone.rainParams).not.toBe(original.rainParams);
        expect(clone.eqGains[0]).not.toBe(original.eqGains[0]);
        expect(clone.rainParams.eqGains[0]).not.toBe(original.rainParams.eqGains[0]);
    });
});
