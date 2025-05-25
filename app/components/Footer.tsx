import { FC } from "react";

export const Footer: FC = () => {
    const year = new Date().getFullYear();

    return (
        <footer className="border-t p-4">
            <div className="max-w-6xl mx-auto grid gap-10 md:grid-cols-3">
                {/* Contact */}
                <div>
                    <h4 className="text-lg font-semibold mb-2">Contact</h4>
                    <p className="text-sm">
                        Email: <a href="mailto:david@davidportal.dev" className="hover:underline">david@davidportal.dev</a><br />
                        GitHub: <a href="https://github.com/stargazingdave" target="_blank" className="hover:underline">github.com/stargazingdave</a>
                    </p>
                </div>
            </div>

            <div className="border-t border-gray-700 mt-10 pt-4 text-center text-xs text-gray-400">
                © {year} David Portal. All rights reserved.
            </div>
        </footer>
    );
}
