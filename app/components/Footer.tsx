import { FC } from "react";

export const Footer: FC = () => {
    const year = new Date().getFullYear();

    return (
        <footer className="border-t p-4">
            <div className="max-w-6xl mx-auto grid gap-10 md:grid-cols-3">
                {/* About */}
                <div>
                    <h4 className="text-lg font-semibold mb-2">About</h4>
                    <p className="text-sm leading-relaxed">
                        davidportal.dev is a space for creative, technical, and experimental web projects. Built by David Portal with passion and purpose.
                    </p>
                </div>

                {/* Links */}
                <div>
                    <h4 className="text-lg font-semibold mb-2">Quick Links</h4>
                    <ul className="space-y-1 text-sm">
                        <li>
                            <a href="/about" className="hover:underline">About</a>
                        </li>
                        <li>
                            <a href="/projects" className="hover:underline">Projects</a>
                        </li>
                        <li>
                            <a href="/contact" className="hover:underline">Contact</a>
                        </li>
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h4 className="text-lg font-semibold mb-2">Contact</h4>
                    <p className="text-sm">
                        Email: <a href="mailto:hello@davidportal.dev" className="hover:underline">hello@davidportal.dev</a><br />
                        GitHub: <a href="https://github.com/davidportal" target="_blank" className="hover:underline">github.com/davidportal</a>
                    </p>
                </div>
            </div>

            <div className="border-t border-gray-700 mt-10 pt-4 text-center text-xs text-gray-400">
                © {year} David Portal. All rights reserved.
            </div>
        </footer>
    );
}
