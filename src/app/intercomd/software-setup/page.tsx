import type { Metadata } from "next";
import SoftwareSetupGuide from "@/features/intercomd/components/software-setup-guide";

export const metadata: Metadata = {
    title: "Software Setup | IntercomD",
    description: "ESP32 IntercomD software setup, source code, and implementation notes.",
};

export default function SoftwareSetupPage() {
    return <SoftwareSetupGuide />;
}
