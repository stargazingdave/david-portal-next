import { describe, expect, it } from "vitest";
import { stripIndent } from "./strip-indent";

describe("stripIndent", () => {
    it("removes the smallest shared indentation", () => {
        expect(stripIndent(`
            first
              second
            third
        `)).toBe("first\n  second\nthird");
    });

    it("preserves relative indentation and blank lines", () => {
        expect(stripIndent("  first\n\n    second")).toBe("first\n\n  second");
    });

    it("handles an empty string", () => {
        expect(stripIndent("")).toBe("");
    });
});
