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

    it("links Agent Diagram to its project page", () => {
        const agentDiagram = projects.find((project) => project.title === "Agent Diagram");
        expect(agentDiagram?.links.website).toBe("/agent-diagram");
    });

    it("links Orlog to its project page and source", () => {
        const orlog = projects.find((project) => project.title === "Orlog");
        expect(orlog?.links.website).toBe("/orlog");
        expect(orlog?.links.github).toBe("https://github.com/stargazingdave/orlog");
        expect(orlog?.links.demo).toBe("https://orlog-delta.vercel.app/");
    });
});
