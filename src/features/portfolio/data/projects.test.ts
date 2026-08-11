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
        expect(agentDiagram?.links.download).toBe("/downloads/agent-diagram-0.1.0-x64-setup.exe");
        expect(agentDiagram?.links.github).toBe("https://github.com/stargazingdave/agent-diagram");
    });

    it("links Orlog to its project page and source", () => {
        const orlog = projects.find((project) => project.title === "Orlog");
        expect(orlog?.links.website).toBe("/orlog");
        expect(orlog?.links.github).toBe("https://github.com/stargazingdave/orlog");
        expect(orlog?.links.modelGithub).toBe("https://github.com/stargazingdave/self_orlog");
        expect(orlog?.links.demo).toBe("https://orlog-delta.vercel.app/");
        expect(orlog?.status).toBe("prod");
    });

    it("labels unfinished audio projects as experiments", () => {
        const noised = projects.find((project) => project.title === "NoiseD");
        const tunerd = projects.find((project) => project.title === "TunerD");

        expect(noised?.status).toBe("experiment");
        expect(noised?.links.demo).toBe("/noised/demo");
        expect(tunerd?.status).toBe("experiment");
        expect(tunerd?.links.download).toBe("/downloads/tunerd-v1.0-release.apk");
    });

    it("links Danny Krivosh to its dedicated project page", () => {
        const danny = projects.find((project) => project.title === "dannykrivosh.com");

        expect(danny?.links.website).toBe("/dannykrivosh");
        expect(danny?.links.demo).toBe("https://dannykrivosh.com");
    });
});
