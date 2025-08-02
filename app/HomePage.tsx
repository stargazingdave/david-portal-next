'use client';

import Link from "next/link";
import Image from "next/image";
import { Button, Card } from "@dpdev/nucleard";
import { useTheme } from "./contexts/ThemeProvider";

export function HomePage() {
  const { resolvedTheme } = useTheme();

  const pages = [
    {
      label: 'About Me',
      href: '/about',
      image: '/images/me.jpg'
    },
    {
      label: 'Projects',
      href: '/projects',
      image: '/images/code.jpg'
    },
    {
      label: 'NoiseD',
      href: '/weather_synth',
      image: '/images/thunder.jpg'
    },
    {
      label: 'TunerD',
      href: '/tunerd',
      image: '/images/tunerd-tile.jpg'
    }
  ]
  return (
    <div className="w-full h-full min-h-full flex flex-col items-center p-4 relative">
      <div className="fixed top-0 left-0 w-1/3 h-[150%] z-[-10] pl-32 pointer-events-none">
        <div className="relative h-full w-full">
          <Image
            src="/images/dpd-logo.png"
            alt="Logo"
            fill
            className="object-contain object-left-top"
            sizes="50vw"
          />
        </div>
      </div>
      <Card
        style={{
          boxShadow: "var(--shadow)",
        }}
        overlayColor={resolvedTheme === "dark" ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)'}
        glassy
        hoverable
      >
        <div className="flex flex-col items-center gap-2 font-[family-name:var(--font-comfortaa)]">
          <h1 className="text-4xl sm:text-6xl font-semibold p-8">
            Welcome
          </h1>
          <p className="max-w-xl text-center text-base sm:text-lg px-4">
            I’m David — full-stack dev, sound nerd, and curious builder.
            This site showcases some of the things I’ve been crafting lately —
            tools, experiments, and bits of code I’m proud of.
          </p>
        </div>
      </Card>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
        {pages.map((page, index) => (
          <Link
            key={index}
            href={page.href}
          >
            <Card
              key={index}
              style={{
                boxShadow: "var(--shadow)",
                height: "200px",
              }}
              backgroundImage={page.image}
              overlayColor='rgba(0,0,0,0.1)'
              className="h-full w-full flex items-center justify-center cursor-pointer text-gray-500 hover:text-white transition duration-200 ease-in-out"
              glassy
              hoverable
            >
              <p className="text-4xl sm:text-6xl p-8">
                {page.label}
              </p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
