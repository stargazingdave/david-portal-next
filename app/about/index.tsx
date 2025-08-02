'use client';

import Image from "next/image";
import { Card } from "@dpdev/nucleard";

export default function AboutIndex() {
    return (
        <div className="w-full max-w-3xl mx-auto p-6 flex flex-col gap-6">
            <div className="w-full flex flex-col sm:flex-row gap-4 items-center">
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
                    <h1 className="text-3xl font-bold">Hi, I’m David</h1>
                    <p className="text-lg">
                        A full-stack dev, audio nerd, and all-around curious person.
                        I build things I wish existed, and then I put them out in the world.
                    </p>
                </div>
            </div>

            {/* Philosophy */}
            <Card glassy style={{ boxShadow: 'var(--shadow)' }} className="p-6 flex flex-col gap-3">
                <h2 className="text-2xl font-semibold">Why I Build</h2>
                <p className="text-base">
                    Most of what I make is public — not because I think it's perfect, but because I believe in sharing.
                    I like understanding how things work, building stuff from scratch (sometimes obsessively),
                    and getting to results fast.
                </p>
                <p className="text-base">
                    I'm not allergic to libraries or inspiration — I just like learning by doing.
                    You can use it, remix it, or ignore it. I just like making things that feel good.
                </p>
            </Card>

            {/* Contact */}
            <Card glassy style={{ boxShadow: 'var(--shadow)' }} className="p-6 flex flex-col gap-3">
                <h2 className="text-2xl font-semibold">Reach Out</h2>
                <p className="text-base">
                    Want to ask something? Suggest a feature? Propose a collaboration?
                    I'm open — as long as it fits the vibe. Be kind and real.
                </p>
                <ul className="text-sm list-disc ml-6">
                    <li>GitHub: <a className="underline" href="https://github.com/stargazingdave" target="_blank">stargazingdave</a></li>
                    <li>Email: <a className="underline" href="mailto:david@davidportal.dev">david@davidportal.dev</a></li>
                    {/* Add LinkedIn, site, etc. if you want */}
                </ul>
            </Card>

            {/* Optional / Fun Stuff */}
            <Card glassy style={{ boxShadow: 'var(--shadow)' }} className="p-6 flex flex-col gap-3">
                <h2 className="text-2xl font-semibold italic">If you care…</h2>
                <ul className="flex flex-col gap-2 ml-2">
                    <li className="flex gap-2">
                        <span>🎸</span>
                        <span>I mess around with analog guitar effects.</span>
                    </li>
                    <li className="flex gap-2">
                        <span>🧠</span>
                        <span>I study computers and software engineering at the faculty of electrical and computer engineering at the Technion.</span>
                    </li>
                    <li className="flex gap-2">
                        <span>🎶</span>
                        <span>Music is also a passion of mine — I sing, play guitar, and produce electronic music.</span>
                    </li>
                    <li className="flex gap-2">
                        <span>🛠️</span>
                        <span>I’m super into DIY.</span>
                    </li>
                    <li className="flex gap-2">
                        <span>🤖</span>
                        <span>
                            I often work with an AI agent (yep — this page too).
                            Not because I can’t do it alone, but because it makes me faster, clearer, and sometimes even funnier.
                            You know what I’m talking about. 😉
                        </span>
                    </li>
                </ul>
            </Card>
        </div>
    );
}
