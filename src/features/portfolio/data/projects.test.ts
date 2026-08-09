import { describe, expect, it } from "vitest";
import { projects } from "./projects";

describe("projects", () => {
    it("uses unique titles as stable identifiers", () => {
        const titles = projects.map((project) => project.title);
        expect(new Set(titles).size).toBe(titles.length);
    });

    it("uses the canonical NoiseD route", () => {
        const noised = projects.find((project) => project.title === "NoiseD");
        expect(noised?.links.website).toBe("/noised");
    });
});
