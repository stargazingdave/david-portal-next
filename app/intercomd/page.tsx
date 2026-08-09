import Link from "next/link";

export default function IntercomdPage() {
    const cards: Array<{ title: string; description: string, link: string }> = [
        {
            title: 'Hardware Setup',
            description: 'List of hardware components and how to assemble them.',
            link: '/intercomd/hardware-setup'
        },
        {
            title: 'Software Setup',
            description: 'The code flashed onto the ESP32, with explanations for each section.',
            link: '/intercomd/software-setup'
        },
        {
            title: 'PCB Design',
            description: 'PCB design files ready for fabrication.',
            link: '/intercomd/pcb-design'
        },
        {
            title: 'Full Build Instructions',
            description: 'Step-by-step guide to assembling the complete device.',
            link: '/intercomd/full-build-instructions'
        },
    ];

    return (
        <div className="flex flex-col items-center p-6 space-y-6">
            <header className="text-center">
                <h1 className="text-4xl font-bold mb-2">IntercomD</h1>
                <p className="text-lg text-secondary-foreground">
                    A communication device based on ESP32.
                </p>
            </header>

            <section className="space-y-1">
                <h2 className="text-2xl font-semibold">Features:</h2>
                <ul className="list-disc list-inside space-y-2 text-secondary-foreground">
                    <li>Communication over <span className="font-mono">ESP-NOW</span></li>
                    <li>Real-time audio streaming</li>
                    <li>Jitter buffering</li>
                    <li>
                        LED indicators:
                        <ul className="list-none mt-2 ml-4 space-y-1">
                            <li className="flex items-center"><LEDGlow color="blue" /> <span className="ml-2">Peer is online</span></li>
                            <li className="flex items-center"><LEDGlow color="green" /> <span className="ml-2">Peer is transmitting</span></li>
                            <li className="flex items-center"><LEDGlow color="red" /> <span className="ml-2">Base is transmitting</span></li>
                        </ul>
                    </li>
                </ul>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {cards.map((card) => (
                    <Link key={card.title} href={card.link} className="max-w-64 border border-secondary-foreground rounded-lg p-4 cursor-pointer shadow-lg hover:bg-foreground/10 transition-colors">
                        <h3 className="text-lg font-semibold">{card.title}</h3>
                        <p className="text-sm text-secondary-foreground">{card.description}</p>
                    </Link>
                ))}
            </section>
        </div>
    );
}

const LEDGlow = ({ color }: { color: 'blue' | 'green' | 'red' }) => {
    const bg = {
        blue: 'bg-blue-500',
        green: 'bg-green-500',
        red: 'bg-red-500',
    }

    // set the per-element shadow color
    const ledVar = {
        blue: '[--tw-shadow-color:rgba(59,130,246,0.7)]',
        green: '[--tw-shadow-color:rgba(34,197,94,0.7)]',
        red: '[--tw-shadow-color:rgba(239,68,68,0.7)]',
    }

    // use the var inside the shadow geometry
    const geom = 'shadow-[0_0_4px_2px_var(--tw-shadow-color)]'

    return (
        <span className={`inline-block w-4 h-4 rounded-full ${bg[color]} ${ledVar[color]} ${geom}`} />
    )
}