import React, { useEffect, useState } from 'react';
import { useTheme } from '../contexts/ThemeProvider';
import { FaCheck, FaChevronDown } from 'react-icons/fa6';
import { MdDarkMode, MdLightMode } from 'react-icons/md';
import * as Select from '@radix-ui/react-select';

const ThemeSelector: React.FC = () => {
    const { theme, setTheme } = useTheme();
    const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

    useEffect(() => {
        const matchMedia = window.matchMedia('(prefers-color-scheme: dark)');

        const updateResolvedTheme = () => {
            setResolvedTheme(matchMedia.matches ? 'dark' : 'light');
        };

        updateResolvedTheme(); // initial

        matchMedia.addEventListener('change', updateResolvedTheme);
        return () => matchMedia.removeEventListener('change', updateResolvedTheme);
    }, []);

    const effectiveTheme = theme === 'system' ? resolvedTheme : theme;

    const iconMap = {
        light: <MdLightMode size={20} />,
        dark: <MdDarkMode size={20} />
    };

    return (
        <Select.Root
            key={theme}
            value={theme}
            onValueChange={(value) => setTheme(value as 'light' | 'dark' | 'system')}
            aria-label="Theme Selector"
        >
            <Select.Trigger
                aria-label="Theme"
                className="inline-flex items-center justify-between gap-2 px-3 py-2 rounded text-sm border cursor-pointer"
            >
                <Select.Value>{iconMap[effectiveTheme]}</Select.Value>
                <Select.Icon>
                    <FaChevronDown />
                </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
                <Select.Content
                    className="z-50 bg-[var(--background)] text-[var(--foreground)] border rounded shadow"
                    position="popper"
                    sideOffset={5}
                    align="end"
                >
                    <Select.Viewport className="p-1">
                        <Select.Item value="light" className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
                            <div className="flex items-center gap-2">
                                {iconMap.light}
                                Light
                            </div>
                            <Select.ItemIndicator className="ml-auto">
                                <FaCheck />
                            </Select.ItemIndicator>
                        </Select.Item>
                        <Select.Item value="dark" className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
                            <div className="flex items-center gap-2">
                                {iconMap.dark}
                                Dark
                            </div>
                            <Select.ItemIndicator className="ml-auto">
                                <FaCheck />
                            </Select.ItemIndicator>
                        </Select.Item>
                        <Select.Item value="system" className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
                            <div className="flex items-center gap-2">
                                {iconMap[resolvedTheme]}
                                System
                            </div>
                            <Select.ItemIndicator className="ml-auto">
                                <FaCheck />
                            </Select.ItemIndicator>
                        </Select.Item>
                    </Select.Viewport>
                </Select.Content>
            </Select.Portal>
        </Select.Root>
    );
};

export default ThemeSelector;
