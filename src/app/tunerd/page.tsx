import Image from "next/image";

export const metadata = {
    title: "TunerD | David Portal Dev",
    description: "A free, minimalist guitar tuner for Android.",
};

const features = [
    "🎚️ Accurate pitch detection",
    "🎯 Needle-style visual tuner",
    "🔔 Standard tuning (E A D G B e) with adjustable note selection",
    "🎨 Minimalist design",
    "💰 Free, no ads",
] as const;

export default function TunerdPage() {
    return (
        <div className="flex flex-col items-center px-4 py-8">
            <Image
                alt="TunerD logo"
                className="mb-6"
                height={250}
                priority
                src="/images/tunerd-logo.png"
                width={250}
            />
            <h1 className="mb-2 text-center text-4xl font-bold">TunerD – Guitar Tuner</h1>
            <p className="mb-6 max-w-lg text-center text-lg text-secondary-foreground">
                A free, minimalist guitar tuner for Android with responsive pitch detection,
                a clean analog-style interface, and no ads.
            </p>

            <Image
                alt="TunerD app screenshot"
                className="mb-6 h-auto max-w-[250px] rounded-xl"
                height={2171}
                sizes="250px"
                src="/images/tunerd-screenshot.jpg"
                width={1080}
            />

            <a
                className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-green-700"
                download
                href="/downloads/tunerd-v1.0-release.apk"
            >
                Download APK
            </a>
            <p className="mt-4 text-muted-foreground">Version 1.0</p>

            <section className="mt-12 max-w-2xl text-center">
                <h2 className="mb-4 text-2xl font-bold">Features</h2>
                <ul className="space-y-2 text-secondary-foreground">
                    {features.map((feature) => <li key={feature}>{feature}</li>)}
                </ul>
            </section>

            <section className="mt-12 max-w-2xl text-center">
                <h2 className="mb-4 text-2xl font-bold">Permissions &amp; Privacy</h2>
                <p className="text-muted-foreground">
                    TunerD uses your microphone for real-time pitch detection. No data is collected,
                    stored, or shared. The app works entirely offline.
                </p>
            </section>
        </div>
    );
}
