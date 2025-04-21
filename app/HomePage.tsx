'use client';

import Link from "next/link";
import { Button, Card } from "@dpdev/nucleard";

export function HomePage() {
  const pages = [
    {
      label: 'Code',
      href: '/code',
      image: '/images/code.jpg'
    },
    // {
    //   label: 'Rain Synth',
    //   href: '/rain_synth',
    //   image: '/images/rain.jpg'
    // },
    {
      label: 'Weather Synth',
      href: '/weather_synth',
      image: '/images/thunder.jpg'
    },
  ]
  return (
    <div className="w-full flex flex-col items-center">
      <Button
        color="green"
        hoverBgColor="blue"
      >
        TEST
      </Button>
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
                // width: "300px",
              }}
              backgroundImage={`url(${page.image})`}
              overlayColor='rgba(0,0,0,0.7)'
              className="h-full w-full flex items-center justify-center cursor-pointer hover:text-gray-500 transition duration-200 ease-in-out"
            >
              <p className="text-4xl sm:text-6xl">
                {page.label}
              </p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
