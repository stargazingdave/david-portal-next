import { Card } from "@dpdev/nucleard";
import { FC, ReactNode, useState } from "react";
import { HiChevronDown, HiChevronRight } from "react-icons/hi2";

interface SynthSectionProps {
    label?: ReactNode;
    children?: ReactNode;
}

export const SynthSection: FC<SynthSectionProps> = ({
    label,
    children
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSection = () => {
        setIsOpen(!isOpen);
    };

    return (
        <Card className="flex h-fit grow border-1 p-4 shadow-md">
            <button onClick={toggleSection} className="flex items-center gap-2 p-2 cursor-pointer">
                {isOpen ? <HiChevronDown /> : <HiChevronRight />} {label}
            </button>
            {isOpen && (
                <div className="synth-section-content">
                    {children}
                </div>
            )}
        </Card>
    );
}