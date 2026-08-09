"use client";

import * as Select from "@radix-ui/react-select";
import { FaCheck, FaChevronDown } from "react-icons/fa6";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { type Theme, useTheme } from "./theme-provider";

const themeIcons = {
    light: <MdLightMode aria-hidden size={20} />,
    dark: <MdDarkMode aria-hidden size={20} />,
};

const themeOptions: ReadonlyArray<{ label: string; value: Theme }> = [
    { label: "Light", value: "light" },
    { label: "Dark", value: "dark" },
    { label: "System", value: "system" },
];

export function ThemeSelector() {
    const { resolvedTheme, setTheme, theme } = useTheme();

    return (
        <Select.Root value={theme} onValueChange={(value: Theme) => setTheme(value)}>
            <Select.Trigger
                aria-label="Theme"
                className="inline-flex items-center justify-between gap-2 rounded border px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
                <Select.Value>{themeIcons[resolvedTheme]}</Select.Value>
                <Select.Icon><FaChevronDown aria-hidden /></Select.Icon>
            </Select.Trigger>
            <Select.Portal>
                <Select.Content
                    align="end"
                    className="z-50 rounded border bg-[var(--background)] text-[var(--foreground)] shadow"
                    position="popper"
                    sideOffset={5}
                >
                    <Select.Viewport className="p-1">
                        {themeOptions.map((option) => (
                            <Select.Item
                                key={option.value}
                                value={option.value}
                                className="flex cursor-pointer items-center gap-2 rounded p-2 outline-none hover:bg-gray-100 focus:bg-gray-100 dark:hover:bg-gray-800 dark:focus:bg-gray-800"
                            >
                                {themeIcons[option.value === "system" ? resolvedTheme : option.value]}
                                <Select.ItemText>{option.label}</Select.ItemText>
                                <Select.ItemIndicator className="ml-auto"><FaCheck aria-hidden /></Select.ItemIndicator>
                            </Select.Item>
                        ))}
                    </Select.Viewport>
                </Select.Content>
            </Select.Portal>
        </Select.Root>
    );
}
