'use client';

import Image from "next/image";
import React, { useRef } from "react";

export default function TunerDIndex() {
    const needleRef = useRef<HTMLDivElement>(null);
    const [needleAngle, setNeedleAngle] = React.useState(15); // base angle

    return (
        <div className="flex flex-col items-center px-4 py-8">
            <Image
                src="/images/tunerd-logo.png"
                alt="TunerD Logo"
                width={250}
                height={250}
                className="mb-6"
            />
            <h1 className="text-4xl font-bold mb-2 text-center">TunerD - Guitar Tuner</h1>
            <p className="text-lg text-gray-300 mb-6 text-center max-w-lg">
                A free, minimalist guitar tuner app for Android. Responsive pitch detection,
                clean analog-style interface, and no ads.
            </p>

            <Image
                src="/images/tunerd-screenshot.jpg"
                alt="TunerD Screenshot"
                width={1080}
                height={2171}
                className="mb-6"
                style={{ maxWidth: '250px', height: 'auto', borderRadius: '12px' }}
            />

            <a
                href="https://davidportal.dev/downloads/tunerd-v1.0-release.apk"
                className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition"
            >
                Download APK
            </a>
            <p className="mt-4 text-gray-400">
                Version 1.0
            </p>

            <div className="mt-12 max-w-2xl text-center">
                <h2 className="text-2xl font-bold mb-4">Features</h2>
                <ul className="space-y-2 text-gray-300">
                    <li>🎚️ Accurate pitch detection</li>
                    <li>🎯 Needle-style visual tuner</li>
                    <li>🔔 Standard tuning (E A D G B e) with adjustable note selection</li>
                    <li>🎨 Minimalist design</li>
                    <li>💰 Free, no ads</li>
                </ul>
            </div>

            <div className="mt-12 max-w-2xl text-center">
                <h2 className="text-2xl font-bold mb-4">Permissions & Privacy</h2>
                <p className="text-gray-400">
                    TunerD uses your microphone for real-time pitch detection.
                    No data is collected, stored, or shared. The app works entirely offline.
                </p>
            </div>
        </div>
    );
}