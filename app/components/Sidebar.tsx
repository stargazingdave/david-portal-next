'use client';

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export const Sidebar = () => {
    const router = useRouter();
    const pathname = usePathname();

    const sidebarItems: {
        label: string,
        href: string,
    }[] = [
            { label: 'Rain Synth', href: '/rain_synth' },
            { label: 'Thunder Synth', href: '/thunder_synth' },
        ];

    return (
        <div className="w-full h-full p-4 flex flex-col gap-4">
            {
                sidebarItems.map((item, index) => (
                    <Link
                        key={index}
                        href={item.href}
                        className={`p-2 rounded-md hover:bg-gray-700 ${pathname === item.href ? 'bg-gray-700' : ''}`}
                        onClick={() => router.push(item.href)}
                    >
                        {item.label}
                    </Link>
                ))
            }
        </div>
    );
}