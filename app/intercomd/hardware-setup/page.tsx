export default function HardwareSetupPage() {
    return (
        <div className="flex flex-col items-center p-6 space-y-6">
            <header className="text-center">
                <h1 className="text-4xl font-bold mb-2">IntercomD - Hardware Setup</h1>
                <p className="text-lg text-secondary-foreground">
                    List of hardware components and how to assemble them.
                </p>
            </header>

            <section className="space-y-1 max-w-3xl text-left">
                <h2 className="text-2xl font-semibold">Components:</h2>
                <ul className="list-disc list-inside space-y-2 text-secondary-foreground">
                    <li>ESP32 Development Board (e.g., ESP32-WROOM-32)</li>
                    <li>MAX98357A I2S Audio Amplifier</li>
                    <li>Microphone (I2S or analog with ADC)</li>
                    <li>Push-to-Talk Button</li>
                    <li>LED Indicators (Blue, Green, Red)</li>
                    <li>Power Supply (e.g., LiPo battery with charger)</li>
                    <li>Miscellaneous: Resistors, Capacitors, Connectors, Enclosure</li>
                </ul>
            </section>
        </div>
    );
}