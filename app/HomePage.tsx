'use client';

import Image from "next/image";
import { CodeProject } from "@/types/CodeProject";
import { FC } from "react";
import { CodeShowcase } from "./components/CodeShowcase";

interface HomePageProps {
  projects: CodeProject[];
}

export const HomePage: FC<HomePageProps> = ({ projects }) => {
  return (
    <div className="w-full h-full min-h-full flex flex-col items-center p-4 gap-4 relative">
      <div className="w-full max-w-3xl flex flex-col sm:flex-row gap-4 items-center">
        <div className="rounded-full overflow-hidden border border-gray-600">
          {/* Replace with actual image */}
          <Image
            src="/images/me.jpg"
            alt="Me"
            width={250}
            height={250}
            sizes="500px"
          />
        </div>

        <div className="flex-1">
          <h1 className="text-3xl font-bold">Hi, I’m David Portal</h1>
          <p className="text-lg font-bold">Code | Music | DIY</p>
          <p className="text-base">
            Currently a full-stack developer at{" "}
            <a
              href="https://www.linkedin.com/company/news-factory/"
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-blue-400"
            >
              News Factory
            </a>.
          </p>
          <p className="text-base">
            And a computer and software engineering student at{" "}
            <a
              href="https://www.linkedin.com/school/technion"
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-blue-400"
            >
              Technion
            </a>.
          </p>
        </div>
      </div>

      <div className="w-full max-w-3xl flex flex-col items-center">
        <p className="text-lg font-bold">You're welcome to explore some of my personal projects.</p>
        <p>They were all built to solve problems I had — and maybe they'll help you too.</p>
        <p>Feel free to use them, copy them, or draw inspiration.</p>
        <p>And if you have questions or feedback, I’d genuinely love to hear it.</p>
      </div>

      <CodeShowcase projects={projects} />
    </div>
  );
}
