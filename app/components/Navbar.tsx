import { FC } from "react";

export const Navbar: FC = () => {
    return (
        <div className="flex items-center justify-between w-full h-full px-[32px]">
            <div className="flex items-center gap-2 font-[family-name:var(--font-comfortaa)]">
                <div className="flex items-center justify-center rounded-full h-12 w-12 border-2">
                    <h1 className="text-xl font-bold tracking-tighter">dpd</h1>
                </div>
                <p className="font-extralight"><b className="font-bold">d</b>avid<b className="font-bold">p</b>ortal.<b className="font-bold">d</b>ev</p>
            </div>
            <div className="flex items-center gap-[24px]">
                <a href="#" className="text-lg font-medium">
                    Home
                </a>
                <a href="#" className="text-lg font-medium">
                    About
                </a>
                <a href="#" className="text-lg font-medium">
                    Contact
                </a>
            </div>
        </div>
    );
}