import { Button } from "@dpdev/nucleard";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { HiOutlineMenu } from "react-icons/hi";

interface NavbarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}

export const Navbar: FC<NavbarProps> = ({
    sidebarOpen,
    setSidebarOpen,
}) => {
    return (
        <div className="flex items-center justify-between w-full h-full p-4 bg-[var(--background)]/30 backdrop-blur-md text-[var(--text)]">
            <div className="flex items-center gap-2 font-[family-name:var(--font-comfortaa)]">
                <Button onClick={() => setSidebarOpen(!sidebarOpen)} clearStyle textHover>
                    <HiOutlineMenu size={30} />
                </Button>
                {/* <div className="flex items-center justify-center rounded-full h-12 w-12 border-2">
                    <h1 className="text-xl font-bold tracking-tighter">dpd</h1>
                </div> */}
                <Link className="relative flex items-center justify-center h-12 w-12" href="/">
                    <Image
                        src="/images/dpd-logo.png"
                        alt="Logo"
                        fill
                        className="rounded-full object-contain"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </Link>
                <p className="font-extralight"><b className="font-bold">d</b>avid<b className="font-bold">p</b>ortal.<b className="font-bold">d</b>ev</p>
            </div>
        </div>
    );
}