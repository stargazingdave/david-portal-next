import Image from "next/image";
import Link from "next/link";
import { ThemeSelector } from "@/components/theme/theme-selector";

export function Navbar() {
    return (
        <nav
            aria-label="Primary navigation"
            className="sticky top-0 z-40 flex h-16 w-full items-center justify-between bg-[var(--background)]/80 p-4 text-[var(--foreground)] shadow-sm backdrop-blur-md"
        >
            <div className="flex items-center gap-2 font-[family-name:var(--font-comfortaa)]">
                <Link
                    aria-label="David Portal Dev home"
                    className="relative flex h-12 w-12 items-center justify-center"
                    href="/"
                >
                    <Image
                        src="/images/dpd-logo.png"
                        alt="Logo"
                        fill
                        className="rounded-full object-contain"
                        sizes="48px"
                    />
                </Link>
                <p className="font-extralight"><b className="font-bold">d</b>avid<b className="font-bold">p</b>ortal.<b className="font-bold">d</b>ev</p>
            </div>

            <ThemeSelector />
        </nav>
    );
}
